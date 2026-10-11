// PATCH/DELETE /api/trainers/[id] — edit/remove a trainer profile (admin only).
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { trainerSchema } from "@/lib/validations/media";

export async function PATCH(request, { params }) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = trainerSchema.partial().safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid trainer data", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    const trainer = await prisma.trainer.update({ where: { id }, data: parsed.data });
    return Response.json({ trainer });
  } catch (error) {
    console.error("Failed to update trainer:", error);
    return Response.json({ error: "Failed to update trainer" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.trainer.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete trainer:", error);
    return Response.json({ error: "Failed to delete trainer" }, { status: 500 });
  }
}
