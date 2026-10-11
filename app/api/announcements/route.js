// GET/POST /api/announcements — the promo banner. The admin UI edits a
// single banner, so GET returns the most recently updated one (or null).
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { announcementSchema } from "@/lib/validations/settings";

export async function GET() {
  const announcement = await prisma.announcement.findFirst({
    orderBy: { createdAt: "desc" },
  });

  return Response.json({ announcement });
}

export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = announcementSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid announcement data", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const data = parsed.data;

  try {
    const announcement = await prisma.announcement.create({
      data: {
        ...data,
        startsAt: data.startsAt ? new Date(data.startsAt) : null,
        endsAt: data.endsAt ? new Date(data.endsAt) : null,
      },
    });

    return Response.json({ announcement }, { status: 201 });
  } catch (error) {
    console.error("Failed to create announcement:", error);
    return Response.json({ error: "Failed to create announcement" }, { status: 500 });
  }
}
