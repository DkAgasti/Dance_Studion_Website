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

  const data = parsed.data;

  try {
    const existing = await prisma.trialBooking.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "Trial booking not found" }, { status: 404 });
    }
    if (existing.status !== "NEW") {
      return Response.json(
        { error: "This trial booking's outcome is already recorded and can't be changed again." },
        { status: 400 }
      );
    }

    // Marking a trial "Converted" also creates its Admission in one step —
    // the admin picks the class/batch in the same dialog, so there's no
    // separate manual re-entry of the same contact details under Admissions.
    let admission = null;
    if (data.status === "CONVERTED" && data.classId) {
      const danceClass = await prisma.danceClass.findUnique({ where: { id: data.classId } });
      if (!danceClass) {
        return Response.json({ error: "Selected class no longer exists." }, { status: 400 });
      }

      let batchId = null;
      let planName = null;
      if (data.batchId) {
        const batch = await prisma.batch.findUnique({ where: { id: data.batchId } });
        if (batch) {
          batchId = batch.id;
          planName = `${batch.day} • ${batch.startTime} — ₹${batch.price}/mo`;
        }
      }

      admission = await prisma.admission.create({
        data: {
          studentName: existing.name,
          phone: existing.phone,
          email: existing.email,
          classId: danceClass.id,
          classInterest: danceClass.name,
          batchId,
          planName,
          source: "Trial Booking",
          status: "PENDING",
        },
      });
    }

    const trialBooking = await prisma.trialBooking.update({
      where: { id },
      data: { status: data.status },
    });

    return Response.json({ trialBooking, admission });
  } catch (error) {
    console.error("Failed to update trial booking:", error);
    return Response.json({ error: "Failed to update trial booking" }, { status: 500 });
  }
}
