import { emailLayout } from "./layout";

// Confirmation email sent to the applicant after an admission is submitted.
export function admissionReceivedEmail({ name, classInterest, plan }) {
  const body = `
    <p>Hi ${name},</p>
    <p>Thanks for applying to ASM Dance Studio! We've received your admission request for <strong>${classInterest}</strong> on the <strong>${plan}</strong> plan.</p>
    <p>Our team will review your application and reach out within 1-2 business days to complete enrollment.</p>
  `;
  return emailLayout("Admission Request Received", body);
}
