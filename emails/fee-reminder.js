import { emailLayout } from "./layout";

function formatAmount(amount) {
  return `₹${amount}`;
}

const REMINDER_INTRO = {
  T5: (studentName, dueDate) =>
    `Just a friendly reminder — the fee for <strong>${studentName}</strong> is due on ${dueDate}, which is 5 days from now.`,
  T3: (studentName, dueDate) =>
    `Just a friendly reminder — the fee for <strong>${studentName}</strong> is due on ${dueDate}, which is 3 days from now.`,
  T1: (studentName, dueDate) =>
    `Just a friendly reminder — the fee for <strong>${studentName}</strong> is due <strong>tomorrow</strong> (${dueDate}).`,
};

// Fee due/overdue reminder email, sent by the daily fee-reminders cron.
export async function feeReminderEmail({ studentName, guardianName, amount, dueDate, type }) {
  const greetingName = guardianName || studentName;

  if (type === "OVERDUE") {
    const body = `
      <p>Hi ${greetingName},</p>
      <p>The fee for <strong>${studentName}</strong> was due on ${dueDate} and is now overdue. Please clear it at your earliest convenience to avoid any interruption to classes.</p>
      <table role="presentation" style="width:100%;margin:20px 0;border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#71717a;">Amount</td><td style="padding:6px 0;text-align:right;font-weight:600;">${formatAmount(amount)}</td></tr>
        <tr><td style="padding:6px 0;color:#71717a;">Original due date</td><td style="padding:6px 0;text-align:right;font-weight:600;">${dueDate}</td></tr>
      </table>
      <p>If there's any issue, please let us know — we're happy to help.</p>
      <p>Thank you,<br/>Team ASM</p>
    `;
    return emailLayout("Fee Overdue", body);
  }

  const body = `
    <p>Hi ${greetingName},</p>
    <p>${REMINDER_INTRO[type](studentName, dueDate)}</p>
    <table role="presentation" style="width:100%;margin:20px 0;border-collapse:collapse;">
      <tr><td style="padding:6px 0;color:#71717a;">Amount</td><td style="padding:6px 0;text-align:right;font-weight:600;">${formatAmount(amount)}</td></tr>
      <tr><td style="padding:6px 0;color:#71717a;">Due date</td><td style="padding:6px 0;text-align:right;font-weight:600;">${dueDate}</td></tr>
    </table>
    <p>If you've already paid, please ignore this email.</p>
    <p>Thank you,<br/>Team ASM</p>
  `;
  return emailLayout("Fee Payment Reminder", body);
}
