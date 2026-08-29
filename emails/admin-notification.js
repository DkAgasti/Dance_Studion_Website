import { emailLayout } from "./layout";

// Generic internal notification email.
// `rows`: [{ label, value }]. `intro` (optional) is a lead paragraph above the
// rows table. `cta` (optional): { label, href } renders a link below the rows.
export function adminNotificationEmail({ title, intro, rows = [], cta }) {
  const rowsHtml = rows
    .map(
      (r) =>
        `<tr><td style="padding:6px 0;color:#71717a;">${r.label}</td><td style="padding:6px 0;text-align:right;font-weight:600;">${r.value ?? "—"}</td></tr>`
    )
    .join("");
  const body = `
    ${intro ? `<p>${intro}</p>` : ""}
    <table role="presentation" style="width:100%;margin:${intro ? "20px" : "0"} 0;border-collapse:collapse;">${rowsHtml}</table>
    ${cta ? `<p style="margin-top:20px;"><a href="${cta.href}" style="color:#65a30d;font-weight:600;text-decoration:underline;">${cta.label}</a></p>` : ""}
  `;
  return emailLayout(title, body);
}
