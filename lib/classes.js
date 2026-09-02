// Shared query for the public class listing — used by both the /classes
// page (server-rendered) and GET /api/classes (kept for any client that
// still calls it directly), so the two never drift in shape.
import { prisma } from "@/lib/db";

export async function getPublicClasses() {
  const classes = await prisma.danceClass.findMany({
    include: {
      batches: {
        include: { trainer: true, students: { select: { id: true } } },
      },
    },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  return classes.map(({ batches, ...c }) => ({
    ...c,
    batches: batches.map((b) => ({
      id: b.id,
      day: b.day,
      startTime: b.startTime,
      endTime: b.endTime,
      price: b.price,
      capacity: b.capacity,
      seatsLeft: Math.max(0, b.capacity - b.students.length),
      trainer: b.trainer?.name ?? null,
    })),
  }));
}
