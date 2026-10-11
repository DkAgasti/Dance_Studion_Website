// GET /api/cron/fee-reminders — daily cron: send T5/T3/T1/OVERDUE fee reminders.
// Protected by CRON_SECRET — Vercel Cron sends it as `Authorization: Bearer`;
// also accepts an `x-cron-secret` header or `?secret=` query param for
// manual/external triggering.
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { feeReminderEmail } from "@/emails/fee-reminder";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function daysUntil(dueDate, today) {
  return Math.round((startOfDay(dueDate) - today) / MS_PER_DAY);
}

function reminderTypeFor(daysUntilDue) {
  if (daysUntilDue === 5) return "T5";
  if (daysUntilDue === 3) return "T3";
  if (daysUntilDue === 1) return "T1";
  if (daysUntilDue <= 0) return "OVERDUE";
  return null;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const authHeader = request.headers.get("authorization");
  const provided =
    request.headers.get("x-cron-secret") ||
    searchParams.get("secret") ||
    (authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null);

  if (!process.env.CRON_SECRET || provided !== process.env.CRON_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = startOfDay(new Date());

  const fees = await prisma.fee.findMany({
    where: { status: { not: "PAID" } },
    include: { student: true },
  });

  const summary = { checked: fees.length, sent: 0, byType: { T5: 0, T3: 0, T1: 0, OVERDUE: 0 } };

  // Each fee is independent, so process them concurrently instead of one
  // sequential await chain per fee.
  await Promise.all(
    fees.map(async (fee) => {
      const daysUntilDue = daysUntil(fee.dueDate, today);
      const type = reminderTypeFor(daysUntilDue);
      if (!type) return;

      if (type === "OVERDUE" && fee.status !== "OVERDUE") {
        await prisma.fee.update({ where: { id: fee.id }, data: { status: "OVERDUE" } });
      }

      const alreadySent =
        type === "OVERDUE"
          ? await prisma.reminderLog.findFirst({
              where: { feeId: fee.id, type: "OVERDUE", sentAt: { gte: today } },
            })
          : await prisma.reminderLog.findFirst({ where: { feeId: fee.id, type } });

      if (alreadySent) return;

      if (!fee.student.email) {
        await prisma.reminderLog.create({ data: { feeId: fee.id, type, channel: "email" } });
        return;
      }

      try {
        await sendEmail({
          to: fee.student.email,
          subject: "ASM Dance Studio — Fee Payment Reminder",
          html: await feeReminderEmail({
            studentName: fee.student.name,
            guardianName: fee.student.guardian,
            amount: fee.amount,
            dueDate: fee.dueDate.toDateString(),
            type,
          }),
        });
        await prisma.reminderLog.create({ data: { feeId: fee.id, type, channel: "email" } });
        summary.sent += 1;
        summary.byType[type] += 1;
      } catch (error) {
        console.error(`Failed to send fee reminder for fee ${fee.id}:`, error);
      }
    })
  );

  return Response.json({ ok: true, ...summary });
}
