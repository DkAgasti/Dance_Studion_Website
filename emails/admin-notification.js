import { emailLayout } from "./layout";

// Generic internal notification email — `rows`: [{ label, value }].
export function adminNotificationEmail({ title, rows = [] }) {
  const rowsHtml = rows
    .map(
      (r) =>
        `<tr><td style="padding:6px 0;color:#71717a;">${r.label}</td><td style="padding:6px 0;text-align:right;font-weight:600;">${r.value ?? "—"}</td></tr>`
    )
    .join("");
  const body = `<table role="presentation" style="width:100%;border-collapse:collapse;">${rowsHtml}</table>`;
  return emailLayout(title, body);
}
