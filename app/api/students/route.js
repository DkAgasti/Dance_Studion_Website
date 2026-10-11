// GET/POST /api/students — list/create students (admin only).
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { studentSchema } from "@/lib/validations/student";
import { computeFeeStatus } from "@/lib/feeStatus";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const students = await prisma.student.findMany({
    include: { fees: true },
    orderBy: { createdAt: "desc" },
  });

  return Response.json({
    students: students.map((s) => ({ ...s, feeStatus: computeFeeStatus(s.fees) })),
  });
}

export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = studentSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid student data", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const data = parsed.data;

  try {
    const batch = await prisma.batch.findUnique({
      where: { id: data.batchId },
      include: { danceClass: true },
    });
    if (!batch) {
      return Response.json({ error: "Selected batch no longer exists." }, { status: 400 });
    }

    const year = new Date().getFullYear();
    const countThisYear = await prisma.student.count({
      where: { code: { startsWith: `ASM-${year}-` } },
    });
    const code = `ASM-${year}-${String(countThisYear + 1).padStart(3, "0")}`;

    const student = await prisma.student.create({
      data: {
        code,
        name: data.name,
        email: data.email,
        phone: data.phone,
        classId: batch.classId,
        className: batch.danceClass.name,
        batchId: batch.id,
        batchLabel: `${batch.day} • ${batch.startTime}`,
        planLabel: data.plan,
        guardian: data.guardianName || null,
        guardianPhone: data.guardianPhone || null,
        guardianRelation: data.guardianRelation || null,
      },
      include: { fees: true },
    });

    return Response.json(
      { student: { ...student, feeStatus: computeFeeStatus(student.fees) } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create student:", error);
    return Response.json({ error: "Failed to create student" }, { status: 500 });
  }
}
