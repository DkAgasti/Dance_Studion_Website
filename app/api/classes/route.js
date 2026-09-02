// GET/POST /api/classes — dance/fitness classes. GET is public (feeds the
// /classes listing + filters); POST is admin only.
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { danceClassSchema } from "@/lib/validations/danceClass";
import { slugify } from "@/lib/utils";
import { getPublicClasses } from "@/lib/classes";

export async function GET() {
  const classes = await getPublicClasses();
  return Response.json(
    { classes },
    { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } }
  );
}

export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = danceClassSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid class data", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const data = parsed.data;

  try {
    const danceClass = await prisma.danceClass.create({
      data: { ...data, slug: slugify(data.name) },
    });
    return Response.json({ danceClass }, { status: 201 });
  } catch (error) {
    if (error.code === "P2002") {
      return Response.json(
        { error: "A class with this name already exists." },
        { status: 409 }
      );
    }
    console.error("Failed to create class:", error);
    return Response.json({ error: "Failed to create class" }, { status: 500 });
  }
}
