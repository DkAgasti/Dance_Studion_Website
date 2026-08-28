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
      const className = interestName(data.interest);
      if (data.email) {
        await sendEmail({
          to: data.email,
          subject: "Your ASM Dance Studio trial class is booked!",
          html: trialConfirmationEmail({
            name: data.name,
            interest: className,
            date: data.date,
            timeLabel: TIME_LABEL[data.timeSlot],
          }),
        });
      }
      if (process.env.ADMIN_NOTIFICATION_EMAIL) {
        await sendEmail({
          to: process.env.ADMIN_NOTIFICATION_EMAIL,
          subject: `New trial booking from ${data.name}`,
          html: adminNotificationEmail({
            title: "New Trial Booking",
            rows: [
              { label: "Name", value: data.name },
              { label: "Phone", value: data.phone },
              { label: "Email", value: data.email || "—" },
              { label: "Class", value: className },
              { label: "Date", value: data.date },
              { label: "Time", value: TIME_LABEL[data.timeSlot] },
            ],
          }),
        });
      }
    } catch (emailError) {
      console.error("Failed to send trial booking emails:", emailError);
    }

    return Response.json({ trialBooking }, { status: 201 });
  } catch (error) {
    console.error("Failed to create trial booking:", error);
    return Response.json({ error: "Failed to save trial booking" }, { status: 500 });
  }
}
