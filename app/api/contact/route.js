// POST /api/contact — saves a contact message and notifies the admin by email.
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { contactSchema } from "@/lib/validations/contact";
import { adminNotificationEmail } from "@/emails/admin-notification";

export async function POST(request) {
  const body = await request.json();
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid contact form data", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const data = parsed.data;

  try {
    const message = await prisma.contactMessage.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        message: data.message,
      },
    });

    if (process.env.ADMIN_NOTIFICATION_EMAIL) {
      try {
        await sendEmail({
          to: process.env.ADMIN_NOTIFICATION_EMAIL,
          subject: `New contact message from ${data.name}`,
          html: adminNotificationEmail({
            title: "New Contact Message",
            rows: [
              { label: "Name", value: data.name },
              { label: "Phone", value: data.phone },
              { label: "Email", value: data.email },
              { label: "Message", value: data.message },
            ],
          }),
        });
      } catch (emailError) {
        console.error("Failed to send contact notification email:", emailError);
      }
    }

    return Response.json({ message }, { status: 201 });
  } catch (error) {
    console.error("Failed to save contact message:", error);
    return Response.json({ error: "Failed to send message" }, { status: 500 });
  }
}
