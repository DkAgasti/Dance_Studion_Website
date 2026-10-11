// GET/POST /api/admissions — list (admin) and save admissions.
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { admissionSchema } from "@/lib/validations/admission";
import { admissionReceivedEmail } from "@/emails/admission-received";
import { adminNotificationEmail } from "@/emails/admin-notification";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admissions = await prisma.admission.findMany({
    orderBy: { createdAt: "desc" },
  });

  return Response.json({ admissions });
}

export async function POST(request) {
  const body = await request.json();
  const { photoUrl, ...formData } = body;
  const parsed = admissionSchema.safeParse(formData);

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid admission data", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const studentName = `${data.firstName} ${data.lastName}`;
  const guardianName = data.guardianName || studentName;
  const address = `${data.addressLine1}, ${data.city}, ${data.state} ${data.pincode}`;

  const notes = [
    data.preferredBatchNote ? `Preferred batch/timing: ${data.preferredBatchNote}` : null,
    data.medicalNotes ? `Medical notes: ${data.medicalNotes}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const [danceClass, batch] = await Promise.all([
    prisma.danceClass.findUnique({ where: { id: data.classId } }),
    data.batchId ? prisma.batch.findUnique({ where: { id: data.batchId } }) : Promise.resolve(null),
  ]);
  if (!danceClass) {
    return Response.json({ error: "Selected class no longer exists." }, { status: 400 });
  }
  const className = danceClass.name;

  const planName = batch
    ? `${batch.day} • ${batch.startTime} — ₹${(batch.price ?? 0).toLocaleString("en-IN")}/mo`
    : null;

  try {
    const admission = await prisma.admission.create({
      data: {
        studentName,
        dob: new Date(data.dob),
        gender: data.gender,
        guardianName: data.guardianName || null,
        guardianRelationship: data.guardianRelationship || null,
        guardianPhone: data.guardianPhone || null,
        guardianEmail: data.guardianEmail || null,
        phone: data.phone,
        email: data.email,
        address,
        classId: danceClass.id,
        classInterest: className,
        batchId: batch?.id ?? null,
        planName,
        consent: data.medicalConsent,
        photoUrl: photoUrl || null,
        source: "website",
        notes,
      },
    });

    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
      await Promise.all([
        sendEmail({
          to: data.email,
          subject: "We've received your admission request — ASM Dance Studio",
          html: await admissionReceivedEmail({
            guardianName,
            studentName,
            phone: data.phone,
            id: admission.id,
          }),
        }),
        process.env.ADMIN_NOTIFICATION_EMAIL
          ? sendEmail({
              to: process.env.ADMIN_NOTIFICATION_EMAIL,
              subject: `New admission request from ${studentName}`,
              html: await adminNotificationEmail({
                title: "New Admission Request",
                intro: "New admission request received on the website.",
                rows: [
                  { label: "Student", value: studentName },
                  { label: "Guardian", value: guardianName },
                  { label: "Phone", value: data.phone },
                  { label: "Email", value: data.email },
                  { label: "Class", value: className },
                  { label: "Plan", value: planName },
                  { label: "Address", value: address },
                  { label: "Source", value: admission.source },
                  { label: "Submitted", value: admission.createdAt.toLocaleString("en-IN") },
                ],
                cta: { label: "Review and Approve/Reject from the admin dashboard", href: `${siteUrl}/admin/admissions` },
              }),
            })
          : Promise.resolve(),
      ]);
    } catch (emailError) {
      console.error("Failed to send admission emails:", emailError);
    }

    return Response.json({ admission }, { status: 201 });
  } catch (error) {
    console.error("Failed to create admission:", error);
    return Response.json({ error: "Failed to save admission" }, { status: 500 });
  }
}
