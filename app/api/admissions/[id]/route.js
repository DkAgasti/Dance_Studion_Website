// PATCH /api/admissions/[id] — update an admission's status (admin only).
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

  try {
    const admission = await prisma.admission.update({
      where: { id },
      data: { status: parsed.data.status },
    });

    return Response.json({ admission });
  } catch (error) {
    console.error("Failed to update admission:", error);
    return Response.json({ error: "Failed to update admission" }, { status: 500 });
  }
}
