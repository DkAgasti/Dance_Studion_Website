// PATCH /api/trial-bookings/[id] — update a trial booking's status (admin only).
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { trialStatusUpdateSchema } from "@/lib/validations/trial";

export async function PATCH(request, { params }) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = trialStatusUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid status update", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    const trialBooking = await prisma.trialBooking.update({
      where: { id },
      data: { status: parsed.data.status },
    });

    return Response.json({ trialBooking });
  } catch (error) {
    console.error("Failed to update trial booking:", error);
    return Response.json({ error: "Failed to update trial booking" }, { status: 500 });
  }
}
