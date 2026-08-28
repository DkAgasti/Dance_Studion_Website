// GET/POST /api/fees — list fee records and create fee schedules (admin only).
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { feeSchema } from "@/lib/validations/fee";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const fees = await prisma.fee.findMany({
    include: { student: { select: { name: true, className: true } } },
    orderBy: { dueDate: "asc" },
  });

  return Response.json({ fees });
}

export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = feeSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid fee schedule data", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const data = parsed.data;

  try {
    const fee = await prisma.fee.create({
      data: {
        studentId: data.studentId,
        amount: data.amount,
        dueDate: new Date(data.dueDate),
        note: data.note || null,
      },
      include: { student: { select: { name: true, className: true } } },
    });

    return Response.json({ fee }, { status: 201 });
  } catch (error) {
    console.error("Failed to create fee schedule:", error);
    return Response.json({ error: "Failed to create fee schedule" }, { status: 500 });
  }
}
