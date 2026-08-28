// GET/POST /api/trainers — list/create trainer profiles.
// GET is public (the About page displays trainer profiles); POST is admin only.
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { trainerSchema } from "@/lib/validations/media";

export async function GET() {
  const trainers = await prisma.trainer.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  return Response.json({ trainers });
}

export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = trainerSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid trainer data", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    const trainer = await prisma.trainer.create({ data: parsed.data });
    return Response.json({ trainer }, { status: 201 });
  } catch (error) {
    console.error("Failed to create trainer:", error);
    return Response.json({ error: "Failed to create trainer" }, { status: 500 });
  }
}
