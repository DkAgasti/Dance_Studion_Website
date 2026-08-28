// GET/PATCH /api/students/[id] — student profile (admin only).
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { studentSchema } from "@/lib/validations/student";
import { computeFeeStatus } from "@/lib/feeStatus";

export async function GET(request, { params }) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const student = await prisma.student.findUnique({
    where: { id },
    include: { fees: { orderBy: { dueDate: "desc" } } },
  });

  if (!student) {
    return Response.json({ error: "Student not found" }, { status: 404 });
  }

  return Response.json({ student: { ...student, feeStatus: computeFeeStatus(student.fees) } });
}

export async function PATCH(request, { params }) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
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
    const student = await prisma.student.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        className: data.className,
        batchLabel: data.batch,
        planLabel: data.plan,
        guardian: data.guardianName || null,
        guardianPhone: data.guardianPhone || null,
        guardianRelation: data.guardianRelation || null,
      },
      include: { fees: true },
    });

    return Response.json({ student: { ...student, feeStatus: computeFeeStatus(student.fees) } });
  } catch (error) {
    console.error("Failed to update student:", error);
    return Response.json({ error: "Failed to update student" }, { status: 500 });
  }
}
