// GET /api/cron/fee-reminders — daily cron: flip past-due PENDING fees to
// OVERDUE, then send reminder emails per the admin's configured schedule
// (Settings > Fee Reminders). Guarded by CRON_SECRET.
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { feeReminderEmail } from "@/emails/fee-reminder";

const DEFAULT_CONFIG = {
  schedule: { threeDaysBefore: true, onDueDate: true, overdue: true },
  channels: { email: true, whatsapp: true },
};

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function daysBetween(a, b) {
  return Math.round((startOfDay(a) - startOfDay(b)) / (1000 * 60 * 60 * 24));
}

export async function GET(request) {
  if (process.env.CRON_SECRET) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const today = startOfDay(new Date());

  await prisma.fee.updateMany({
    where: { status: "PENDING", dueDate: { lt: today } },
    data: { status: "OVERDUE" },
  });

  const settings = await prisma.studioSettings.findUnique({ where: { id: "main" } });
  const config = { ...DEFAULT_CONFIG, ...(settings?.reminderConfig ?? {}) };

  if (!config.channels?.email) {
    return Response.json({ ok: true, sent: 0, note: "Email channel disabled" });
  }

  const fees = await prisma.fee.findMany({
    where: { status: { in: ["PENDING", "OVERDUE"] } },
    include: { student: true, reminderLogs: true },
  });

  let sent = 0;

  for (const fee of fees) {
    const daysUntilDue = daysBetween(fee.dueDate, today);
    let type = null;
    if (fee.status === "OVERDUE" && config.schedule.overdue) {
      type = "overdue";
    } else if (fee.status === "PENDING" && daysUntilDue === 0 && config.schedule.onDueDate) {
      type = "onDueDate";
    } else if (fee.status === "PENDING" && daysUntilDue === 3 && config.schedule.threeDaysBefore) {
      type = "threeDaysBefore";
    }

    if (!type) continue;
    if (fee.reminderLogs.some((log) => log.type === type)) continue;
    if (!fee.student.email) continue;

    try {
      await sendEmail({
        to: fee.student.email,
        subject: "ASM Dance Studio — Fee Payment Reminder",
        html: feeReminderEmail({
          studentName: fee.student.name,
          amount: fee.amount,
          dueDate: fee.dueDate.toDateString(),
          status: fee.status,
        }),
      });
      await prisma.reminderLog.create({
        data: { feeId: fee.id, type, channel: "email" },
      });
      sent += 1;
    } catch (error) {
      console.error(`Failed to send fee reminder for fee ${fee.id}:`, error);
    }
  }

  return Response.json({ ok: true, sent });
}
