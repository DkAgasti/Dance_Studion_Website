import { emailLayout } from "./layout";

// Confirmation email sent to the applicant/guardian after an admission is submitted.
export async function admissionReceivedEmail({ guardianName, studentName, phone, id }) {
  const body = `
    <p>Hi ${guardianName},</p>
    <p>Thank you for submitting an admission request for <strong>${studentName}</strong> at ASM Dance Studio. We've received your details and our team will reach out shortly.</p>
    <table role="presentation" style="width:100%;margin:20px 0;border-collapse:collapse;">
      <tr><td style="padding:6px 0;color:#71717a;">Student</td><td style="padding:6px 0;text-align:right;font-weight:600;">${studentName}</td></tr>
      <tr><td style="padding:6px 0;color:#71717a;">Phone</td><td style="padding:6px 0;text-align:right;font-weight:600;">${phone}</td></tr>
      <tr><td style="padding:6px 0;color:#71717a;">Reference ID</td><td style="padding:6px 0;text-align:right;font-weight:600;">${id}</td></tr>
    </table>
    <p>We'll contact you on ${phone} to confirm the batch and next steps. If anything above looks incorrect, just reply to this email.</p>
    <p>See you on the dance floor!<br/>— Team ASM</p>
  `;
  return emailLayout("Admission Request Received", body);
}
