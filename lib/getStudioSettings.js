import { prisma } from "@/lib/db";

// Server-side equivalent of the public GET /api/settings — same singleton
// upsert, but a direct Prisma read so Server Components can use it without
// a network round trip.
export async function getStudioSettings() {
  return prisma.studioSettings.upsert({
    where: { id: "main" },
    update: {},
    create: { id: "main" },
  });
}
