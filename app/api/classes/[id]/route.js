// PATCH/DELETE /api/classes/[id] — edit/remove a class (admin only).
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { danceClassSchema } from "@/lib/validations/danceClass";
import { slugify } from "@/lib/utils";

export async function PATCH(request, { params }) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = danceClassSchema.partial().safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid class data", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const data = parsed.data;

  try {
    const danceClass = await prisma.danceClass.update({
      where: { id },
      data: { ...data, slug: data.name ? slugify(data.name) : undefined },
    });
    return Response.json({ danceClass });
  } catch (error) {
    if (error.code === "P2002") {
      return Response.json(
        { error: "A class with this name already exists." },
        { status: 409 }
      );
    }
    console.error("Failed to update class:", error);
    return Response.json({ error: "Failed to update class" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.danceClass.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete class:", error);
    return Response.json({ error: "Failed to delete class" }, { status: 500 });
  }
}
