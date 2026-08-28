// Nodemailer Gmail SMTP transporter — sends transactional emails for bookings, admissions, and reminders.
// TODO: Wire up call sites (trial-bookings, admissions, fee-reminders) using templates from /emails.
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendEmail({ to, subject, html }) {
  return transporter.sendMail({
    from: process.env.GMAIL_USER,
    to,
    subject,
    html,
  });
}
