// Shared helpers for app/api/batches routes.
import { prisma } from "@/lib/db";

export const BATCH_INCLUDE = {
  danceClass: true,
  trainer: true,
  students: { select: { id: true, name: true, joinDate: true } },
};

export function toBatchView(batch) {
  return {
    id: batch.id,
    classId: batch.classId,
    name: batch.danceClass.name,
    level: batch.danceClass.level,
    studio: batch.studio,
    days: batch.day,
    time: batch.startTime,
    trainer: batch.trainer?.name ?? null,
    capacity: batch.capacity,
    price: batch.price,
    enrolled: batch.students.length,
    students: batch.students.map((s) => ({
      id: s.id,
      name: s.name,
      joinDate: s.joinDate,
      present: true,
    })),
  };
}

// Keeps the linked DanceClass's displayed level in sync with whatever level
// was set on the batch being saved (the class page shows a single level
// badge, sourced from its most-recently-edited batch).
export async function syncClassLevel(classId, level) {
  if (!level) return;
  const danceClass = await prisma.danceClass.findUnique({ where: { id: classId } });
  if (danceClass && level !== danceClass.level) {
    await prisma.danceClass.update({ where: { id: classId }, data: { level } });
  }
}

// The admin UI still only collects a free-text trainer name (no separate
// trainer management screen exists yet) — find-or-create by name.
export async function resolveTrainerId(name) {
  if (!name) return null;
  const existing = await prisma.trainer.findFirst({ where: { name } });
  if (existing) return existing.id;
  const created = await prisma.trainer.create({ data: { name } });
  return created.id;
}
