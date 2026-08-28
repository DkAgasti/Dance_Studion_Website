// GET/POST /api/plans — membership plans. GET is public (feeds /pricing);
// POST is admin only.
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { planSchema } from "@/lib/validations/settings";

export async function GET() {
  const plans = await prisma.plan.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  return Response.json({ plans });
}

export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = planSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid plan data", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    const plan = await prisma.plan.create({ data: parsed.data });
    return Response.json({ plan }, { status: 201 });
  } catch (error) {
    console.error("Failed to create plan:", error);
    return Response.json({ error: "Failed to create plan" }, { status: 500 });
  }
}
