// Shared HTML wrapper for transactional emails (lib/email.js sendEmail()).
export function emailLayout(title, bodyHtml) {
  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;color:#18181b;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="background:#0f0f10;padding:24px 32px;">
                <p style="margin:0;color:#c9ff3d;font-weight:700;font-size:18px;">ASM Dance Studio</p>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <h1 style="margin:0 0 16px;font-size:20px;">${title}</h1>
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;background:#fafafa;color:#71717a;font-size:12px;">
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
