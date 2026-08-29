import { emailLayout } from "./layout";

const MESSAGE_BY_TYPE = {
  T5: ({ amount, dueDate }) => `Your fee of ₹${amount} is due in 5 days on ${dueDate}.`,
  T3: ({ amount, dueDate }) => `Reminder: your fee of ₹${amount} is due in 3 days on ${dueDate}.`,
  T1: ({ amount, dueDate }) => `Your fee of ₹${amount} is due TOMORROW (${dueDate}). Please pay soon.`,
  OVERDUE: ({ amount, dueDate }) =>
    `Your fee of ₹${amount} was due on ${dueDate} and is now overdue. Please pay at the studio as soon as possible.`,
};

// Fee due/overdue reminder email, sent by the daily fee-reminders cron.
export function feeReminderEmail({ studentName, amount, dueDate, type }) {
  const message = MESSAGE_BY_TYPE[type]({ amount, dueDate });
  const body = `
    <p>Hi ${studentName},</p>
    <p>${message}</p>
  `;
  return emailLayout("Fee Payment Reminder", body);
}
