// GET/POST /api/services — fitness/wellness services shown on the /services
// page. GET is public; POST is admin only.
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { serviceSchema } from "@/lib/validations/service";
import { slugify } from "@/lib/utils";

export async function GET() {
  const services = await prisma.service.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  return Response.json({ services });
}

export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = serviceSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid service data", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    const service = await prisma.service.create({
      data: { ...parsed.data, slug: slugify(parsed.data.name) },
    });
    return Response.json({ service }, { status: 201 });
  } catch (error) {
    if (error.code === "P2002") {
      return Response.json(
        { error: "A service with this name already exists." },
        { status: 409 }
      );
    }
    console.error("Failed to create service:", error);
    return Response.json({ error: "Failed to create service" }, { status: 500 });
  }
}
