import { emailLayout } from "./layout";

// Fee due/overdue reminder email, sent by the daily cron job.
export function feeReminderEmail({ studentName, amount, dueDate, status }) {
  const label = status === "OVERDUE" ? "overdue" : "due soon";
  const body = `
    <p>Hi ${studentName},</p>
    <p>This is a reminder that your fee payment of <strong>₹${amount}</strong> is ${label} (due ${dueDate}).</p>
    <p>Please clear the payment at the studio, or reach out if you've already paid.</p>
  `;
  return emailLayout("Fee Payment Reminder", body);
}
