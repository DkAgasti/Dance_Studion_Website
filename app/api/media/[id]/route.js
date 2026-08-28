// PATCH/DELETE /api/media/[id] — edit/remove/reorder a media item (admin only).
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { mediaSchema } from "@/lib/validations/media";

export async function PATCH(request, { params }) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = mediaSchema.partial().safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid media data", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    const media = await prisma.media.update({ where: { id }, data: parsed.data });
    return Response.json({ media });
  } catch (error) {
    console.error("Failed to update media:", error);
    return Response.json({ error: "Failed to update media" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.media.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete media:", error);
    return Response.json({ error: "Failed to delete media" }, { status: 500 });
  }
}
