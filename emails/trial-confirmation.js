import { emailLayout } from "./layout";

// Confirmation email sent to the customer after a trial booking is saved.
export async function trialConfirmationEmail({ name, interest, date, timeLabel }) {
  const body = `
    <p>Hi ${name},</p>
    <p>Your free trial class request has been received. Our team will call you shortly to confirm your slot.</p>
    <table role="presentation" style="width:100%;margin:20px 0;border-collapse:collapse;">
      <tr><td style="padding:6px 0;color:#71717a;">Class</td><td style="padding:6px 0;text-align:right;font-weight:600;">${interest}</td></tr>
      <tr><td style="padding:6px 0;color:#71717a;">Date</td><td style="padding:6px 0;text-align:right;font-weight:600;">${date}</td></tr>
      <tr><td style="padding:6px 0;color:#71717a;">Time</td><td style="padding:6px 0;text-align:right;font-weight:600;">${timeLabel}</td></tr>
    </table>
    <p>See you on the floor!</p>
  `;
  return emailLayout("Trial Class Confirmed", body);
}
