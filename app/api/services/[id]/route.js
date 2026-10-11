// PATCH/DELETE /api/services/[id] — edit/remove a service (admin only).
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { serviceSchema } from "@/lib/validations/service";
import { slugify } from "@/lib/utils";

export async function PATCH(request, { params }) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = serviceSchema.partial().safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid service data", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const data = { ...parsed.data };
  if (data.name) data.slug = slugify(data.name);

  try {
    const service = await prisma.service.update({ where: { id }, data });
    return Response.json({ service });
  } catch (error) {
    console.error("Failed to update service:", error);
    return Response.json({ error: "Failed to update service" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.service.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete service:", error);
    return Response.json({ error: "Failed to delete service" }, { status: 500 });
  }
}
