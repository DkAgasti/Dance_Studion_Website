// GET/POST /api/batches — list/create dance & fitness batches (admin only).
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { batchSchema } from "@/lib/validations/batch";
import { BATCH_INCLUDE, toBatchView, syncClassLevel, resolveTrainerId } from "@/lib/batches";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const batches = await prisma.batch.findMany({
    include: BATCH_INCLUDE,
    orderBy: { createdAt: "desc" },
  });

  return Response.json({ batches: batches.map(toBatchView) });
}

export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

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

    const batch = await prisma.batch.create({
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

    return Response.json({ batch: toBatchView(batch) }, { status: 201 });
  } catch (error) {
    console.error("Failed to create batch:", error);
    return Response.json({ error: "Failed to create batch" }, { status: 500 });
  }
}
