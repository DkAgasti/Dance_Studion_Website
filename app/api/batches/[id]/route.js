// PATCH/DELETE /api/batches/[id] — edit/remove a batch (admin only).
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { batchSchema } from "@/lib/validations/batch";
import { BATCH_INCLUDE, toBatchView, syncClassLevel, resolveTrainerId } from "@/lib/batches";

export async function PATCH(request, { params }) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = batchSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid batch data", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const data = parsed.data;

  try {
    const [, trainerId] = await Promise.all([
      syncClassLevel(data.classId, data.level),
      resolveTrainerId(data.trainer),
    ]);

    const batch = await prisma.batch.update({
      where: { id },
      data: {
        classId: data.classId,
        trainerId,
        day: data.days,
        startTime: data.time,
        studio: data.studio || null,
        capacity: data.capacity,
        price: data.price,
      },
      include: BATCH_INCLUDE,
    });

    return Response.json({ batch: toBatchView(batch) });
  } catch (error) {
    console.error("Failed to update batch:", error);
    return Response.json({ error: "Failed to update batch" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.batch.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete batch:", error);
    return Response.json({ error: "Failed to delete batch" }, { status: 500 });
  }
}
