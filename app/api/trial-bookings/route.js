// GET/POST /api/trial-bookings — list (admin) and save trial bookings.
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { trialSchema } from "@/lib/validations/trial";
import { interestName } from "@/config/classes";
import { trialConfirmationEmail } from "@/emails/trial-confirmation";
import { adminNotificationEmail } from "@/emails/admin-notification";

const FOR_WHOM = { myself: "MYSELF", "someone-else": "MY_CHILD" };
const TIME_SLOT_HOUR = { morning: 9, afternoon: 12, evening: 16, night: 19 };
const TIME_LABEL = {
  morning: "Morning (9 - 11 AM)",
  afternoon: "Afternoon (12 - 3 PM)",
  evening: "Evening (4 - 7 PM)",
  night: "Night (7 - 9 PM)",
};

// `interest` may be a static config slug (dance styles) or a real DB
// Service slug (fitness) — the two live in separate id spaces, so fall back
// to a Service lookup when the config catalog doesn't recognize it.
async function resolveInterestName(slug) {
  const configName = interestName(slug);
  if (configName !== slug) return configName;
  const service = await prisma.service.findUnique({ where: { slug } });
  return service?.name ?? slug;
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const trialBookings = await prisma.trialBooking.findMany({
    orderBy: { createdAt: "desc" },
  });

  return Response.json({ trialBookings });
}

export async function POST(request) {
  const body = await request.json();
  const parsed = trialSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid trial booking data", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const hour = TIME_SLOT_HOUR[data.timeSlot] ?? 9;
  const preferredDateTime = new Date(data.date);
  preferredDateTime.setHours(hour, 0, 0, 0);

  try {
    const trialBooking = await prisma.trialBooking.create({
      data: {
        forWhom: FOR_WHOM[data.bookingFor],
        interests: [data.interest],
        experienceLevel: data.experienceLevel,
        ageGroup: data.ageGroup,
        preferredDateTime,
        name: data.name,
        phone: data.phone,
        email: data.email || null,
      },
    });

    try {
      const className = await resolveInterestName(data.interest);
      const timeLabel = TIME_LABEL[data.timeSlot] ?? data.timeSlot;
      await Promise.all([
        data.email
          ? sendEmail({
              to: data.email,
              subject: "Your ASM Dance Studio trial class is booked!",
              html: await trialConfirmationEmail({
                name: data.name,
                interest: className,
                date: data.date,
                timeLabel,
              }),
            })
          : Promise.resolve(),
        process.env.ADMIN_NOTIFICATION_EMAIL
          ? sendEmail({
              to: process.env.ADMIN_NOTIFICATION_EMAIL,
              subject: `New trial booking from ${data.name}`,
              html: await adminNotificationEmail({
                title: "New Trial Booking",
                rows: [
                  { label: "Name", value: data.name },
                  { label: "Phone", value: data.phone },
                  { label: "Email", value: data.email || "—" },
                  { label: "Class", value: className },
                  { label: "Date", value: data.date },
                  { label: "Time", value: timeLabel },
                ],
              }),
            })
          : Promise.resolve(),
      ]);
    } catch (emailError) {
      console.error("Failed to send trial booking emails:", emailError);
    }

    return Response.json({ trialBooking }, { status: 201 });
  } catch (error) {
    console.error("Failed to create trial booking:", error);
    return Response.json({ error: "Failed to save trial booking" }, { status: 500 });
  }
}
