// PATCH /api/announcements/[id] — update the promo banner (admin only).
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { announcementSchema } from "@/lib/validations/settings";

export async function PATCH(request, { params }) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = announcementSchema.partial().safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid announcement data", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const data = parsed.data;

  try {
    const announcement = await prisma.announcement.update({
      where: { id },
      data: {
        ...data,
        startsAt: data.startsAt ? new Date(data.startsAt) : undefined,
        endsAt: data.endsAt ? new Date(data.endsAt) : undefined,
      },
    });

    return Response.json({ announcement });
  } catch (error) {
    console.error("Failed to update announcement:", error);
    return Response.json({ error: "Failed to update announcement" }, { status: 500 });
  }
}
