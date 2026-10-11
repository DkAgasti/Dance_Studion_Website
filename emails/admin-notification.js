import { emailLayout } from "./layout";

// Generic internal notification email.
// `rows`: [{ label, value }]. `intro` (optional) is a lead paragraph above the
// rows table. `cta` (optional): { label, href } renders a link below the rows.
export async function adminNotificationEmail({ title, intro, rows = [], cta }) {
  const rowsHtml = rows
    .map(
      (r) =>
        `<tr><td style="padding:6px 0;color:#71717a;">${r.label}</td><td style="padding:6px 0;text-align:right;font-weight:600;">${r.value ?? "—"}</td></tr>`
    )
    .join("");
  const body = `
    ${intro ? `<p>${intro}</p>` : ""}
    <table role="presentation" style="width:100%;margin:${intro ? "20px" : "0"} 0;border-collapse:collapse;">${rowsHtml}</table>
    ${
      cta
        ? `<table role="presentation" style="margin-top:24px;"><tr><td bgcolor="#c9ff3d" style="background-color:#c9ff3d;border-radius:999px;text-align:center;"><a href="${cta.href}" style="display:inline-block;padding:12px 24px;color:#0a0a0b;font-weight:700;font-size:14px;text-decoration:none;font-family:Arial,Helvetica,sans-serif;">${cta.label}</a></td></tr></table>`
        : ""
    }
  `;
  return emailLayout(title, body);
}
