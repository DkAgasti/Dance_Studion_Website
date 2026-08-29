// GET/POST /api/media — list/create media items (reels, photos, certificates,
// testimonials — all share the Media model, filtered by `type`).
// GET is public (the public site displays this content); POST is admin only.
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { mediaSchema } from "@/lib/validations/media";

const VALID_TYPES = ["REEL", "PHOTO", "CERTIFICATE", "REVIEW", "MILESTONE"];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  if (type && !VALID_TYPES.includes(type)) {
    return Response.json({ error: "Invalid type" }, { status: 400 });
  }

  const media = await prisma.media.findMany({
    where: type ? { type } : undefined,
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return Response.json({ media });
}

export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = mediaSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid media data", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    const media = await prisma.media.create({ data: parsed.data });
    return Response.json({ media }, { status: 201 });
  } catch (error) {
    console.error("Failed to create media:", error);
    return Response.json({ error: "Failed to create media" }, { status: 500 });
  }
}
