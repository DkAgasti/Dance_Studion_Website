// Shared HTML wrapper for transactional emails (lib/email.js sendEmail()).
// Every color is set via both an inline style AND a bgcolor/color attribute,
// and color-scheme is pinned to "light" — otherwise Gmail's dark mode
// re-colors parts of the email inconsistently (e.g. a white header box with
// unreadable text) since it only partially honors inline styles.
export function emailLayout(title, bodyHtml) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>${title}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#f4f4f5" style="background-color:#f4f4f5;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="max-width:520px;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e4e4e7;">
            <tr>
              <td bgcolor="#0f0f10" style="background-color:#0f0f10;padding:24px 32px;">
                <p style="margin:0;color:#c9ff3d;font-weight:700;font-size:18px;font-family:Arial,Helvetica,sans-serif;">ASM Dance Studio</p>
              </td>
            </tr>
            <tr>
              <td bgcolor="#ffffff" style="background-color:#ffffff;padding:32px;">
                <h1 style="margin:0 0 16px;font-size:20px;color:#18181b;font-family:Arial,Helvetica,sans-serif;">${title}</h1>
                <div style="color:#3f3f46;font-size:15px;line-height:1.7;font-family:Arial,Helvetica,sans-serif;">
                  ${bodyHtml}
                </div>
              </td>
            </tr>
            <tr>
              <td bgcolor="#fafafa" style="background-color:#fafafa;padding:20px 32px;color:#71717a;font-size:12px;font-family:Arial,Helvetica,sans-serif;">
                Room-6, 2nd Floor, BMC Panchadeep Complex, Bhauma Nagara, Unit-4, Bhubaneswar, Odisha 751001
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
