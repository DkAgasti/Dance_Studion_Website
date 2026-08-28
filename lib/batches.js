// Shared helpers for app/api/batches routes.
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";

export const BATCH_INCLUDE = {
  danceClass: true,
  trainer: true,
  students: { select: { id: true, name: true, joinDate: true } },
};

export function toBatchView(batch) {
  return {
    id: batch.id,
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

// Batches reference a DanceClass/Trainer by relation, but the admin UI only
// collects free-text names (no separate class/trainer management screens
// exist yet) — so we find-or-create those records by name/slug here.
export async function resolveClassId(name, level) {
  const slug = slugify(name);
  const existing = await prisma.danceClass.findUnique({ where: { slug } });
  if (existing) {
    if (level && level !== existing.level) {
      await prisma.danceClass.update({ where: { id: existing.id }, data: { level } });
    }
    return existing.id;
  }
  const created = await prisma.danceClass.create({ data: { name, slug, level } });
  return created.id;
}

export async function resolveTrainerId(name) {
  if (!name) return null;
  const existing = await prisma.trainer.findFirst({ where: { name } });
  if (existing) return existing.id;
  const created = await prisma.trainer.create({ data: { name } });
  return created.id;
}
