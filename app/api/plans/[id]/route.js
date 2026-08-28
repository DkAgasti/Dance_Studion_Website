// PATCH/DELETE /api/plans/[id] — edit/remove a membership plan (admin only).
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { planSchema } from "@/lib/validations/settings";

export async function PATCH(request, { params }) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = planSchema.partial().safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid plan data", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    const plan = await prisma.plan.update({ where: { id }, data: parsed.data });
    return Response.json({ plan });
  } catch (error) {
    console.error("Failed to update plan:", error);
    return Response.json({ error: "Failed to update plan" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.plan.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete plan:", error);
    return Response.json({ error: "Failed to delete plan" }, { status: 500 });
  }
}
