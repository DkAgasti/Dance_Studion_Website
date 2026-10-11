// GET/PATCH /api/settings — the singleton StudioSettings record.
// GET is public (footer/contact/SEO can read it); PATCH is admin only.
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { settingsSchema } from "@/lib/validations/settings";

export async function GET() {
  const settings = await prisma.studioSettings.upsert({
    where: { id: "main" },
    update: {},
    create: { id: "main" },
  });

  return Response.json({ settings });
}

export async function PATCH(request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = settingsSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid settings data", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    const settings = await prisma.studioSettings.upsert({
      where: { id: "main" },
      update: parsed.data,
      create: { id: "main", ...parsed.data },
    });

    return Response.json({ settings });
  } catch (error) {
    console.error("Failed to update settings:", error);
    return Response.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
