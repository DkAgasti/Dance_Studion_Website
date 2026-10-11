// POST /api/newsletter — footer email signup (public).
import { prisma } from "@/lib/db";
import { newsletterSchema } from "@/lib/validations/newsletter";

export async function POST(request) {
  const body = await request.json();
  const parsed = newsletterSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Enter a valid email address.", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    await prisma.newsletterSubscriber.upsert({
      where: { email: parsed.data.email },
      update: {},
      create: { email: parsed.data.email },
    });
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Failed to save newsletter subscriber:", error);
    return Response.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
