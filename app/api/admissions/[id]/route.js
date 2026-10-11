// PATCH/DELETE /api/admissions/[id] — update status / remove an admission (admin only).
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { admissionStatusUpdateSchema } from "@/lib/validations/admission";

export async function PATCH(request, { params }) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = admissionStatusUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid status update", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { status, batchId } = parsed.data;

  try {
    const existing = await prisma.admission.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "Admission not found" }, { status: 404 });
    }
    if (existing.status !== "PENDING") {
      return Response.json(
        { error: "This admission has already been decided and can't be changed again." },
        { status: 400 }
      );
    }

    const admission = await prisma.admission.update({
      where: { id },
      data: { status },
    });

    let student = null;
    if (status === "APPROVED") {
      student = await prisma.student.findUnique({ where: { admissionId: admission.id } });

      if (!student) {
        const batch = await prisma.batch.findUnique({
          where: { id: batchId },
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

        student = await prisma.student.create({
          data: {
            code,
            admissionId: admission.id,
            name: admission.studentName,
            dob: admission.dob,
            email: admission.email,
            phone: admission.phone,
            address: admission.address,
            classId: batch.classId,
            className: batch.danceClass.name,
            batchId: batch.id,
            batchLabel: `${batch.day} • ${batch.startTime}`,
            planLabel: admission.planName,
            guardian: admission.guardianName,
            guardianPhone: admission.guardianPhone,
            guardianRelation: admission.guardianRelationship,
          },
        });
      }
    }

    return Response.json({ admission, student });
  } catch (error) {
    console.error("Failed to update admission:", error);
    return Response.json({ error: "Failed to update admission" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.admission.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete admission:", error);
    return Response.json({ error: "Failed to delete admission" }, { status: 500 });
  }
}
