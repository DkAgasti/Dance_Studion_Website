// POST /api/corporate — saves a corporate wellness session request and notifies the admin.
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { corporateSessionSchema } from "@/lib/validations/corporateSession";
import { adminNotificationEmail } from "@/emails/admin-notification";

export async function POST(request) {
  const body = await request.json();
  const parsed = corporateSessionSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid corporate request data", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const data = parsed.data;

  try {
    const corporateRequest = await prisma.corporateRequest.create({
      data: {
        name: data.name,
        company: data.company,
        phone: data.phone,
        email: data.email,
        message: data.message,
      },
    });

    if (process.env.ADMIN_NOTIFICATION_EMAIL) {
      try {
        await sendEmail({
          to: process.env.ADMIN_NOTIFICATION_EMAIL,
          subject: `New corporate session request from ${data.company}`,
          html: adminNotificationEmail({
            title: "New Corporate Session Request",
            rows: [
              { label: "Name", value: data.name },
              { label: "Company", value: data.company },
              { label: "Phone", value: data.phone },
              { label: "Email", value: data.email },
              { label: "Message", value: data.message },
            ],
          }),
        });
      } catch (emailError) {
        console.error("Failed to send corporate request notification email:", emailError);
      }
    }

    return Response.json({ corporateRequest }, { status: 201 });
  } catch (error) {
    console.error("Failed to save corporate request:", error);
    return Response.json({ error: "Failed to send request" }, { status: 500 });
  }
}
