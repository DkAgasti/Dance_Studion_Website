import { siteConfig } from "@/config/site";
import { prisma } from "@/lib/db";

// Shared HTML wrapper for transactional emails (lib/email.js sendEmail()).
// Deliberately dark end-to-end (brand look), so every color is set via BOTH
// an inline style AND a bgcolor/color attribute, with color-scheme pinned —
// a template that mixes light and dark sections is what makes Gmail's dark
// mode invert things inconsistently; an all-dark template avoids that.
export async function emailLayout(title, bodyHtml) {
  const settings = await prisma.studioSettings.findUnique({
    where: { id: "main" },
    select: { name: true, logoUrl: true, phone: true, email: true, address: true, socials: true },
  });

  const name = settings?.name || siteConfig.name;
  // No siteConfig fallback for these — an empty admin field just leaves it
  // out of the email footer, rather than showing an old static placeholder.
  const phone = settings?.phone || null;
  const email = settings?.email || null;
  const address = settings?.address || null;
  const socials = [
    ["Instagram", settings?.socials?.instagram],
    ["Facebook", settings?.socials?.facebook],
    ["YouTube", settings?.socials?.youtube],
  ].filter(([, href]) => href);

  const contactLine = [phone && `📞 ${phone}`, email && `✉️ ${email}`].filter(Boolean).join(" &nbsp;·&nbsp; ");

  const contactHtml =
    contactLine || address
      ? `<tr>
          <td style="height:28px;line-height:28px;font-size:1px;">&nbsp;</td>
        </tr>
        <tr>
          <td align="center">
            ${contactLine ? `<p style="margin:0 0 6px;color:#a1a1aa;font-size:13px;font-family:Arial,Helvetica,sans-serif;">${contactLine}</p>` : ""}
            ${address ? `<p style="margin:0;color:#52525b;font-size:12px;font-family:Arial,Helvetica,sans-serif;">${address}</p>` : ""}
          </td>
        </tr>`
      : "";

  const socialsHtml = socials.length
    ? `<tr>
        <td style="height:24px;line-height:24px;font-size:1px;">&nbsp;</td>
      </tr>
      <tr>
        <td bgcolor="#c9ff3d" style="background-color:#c9ff3d;border-radius:14px;padding:16px;text-align:center;">
          ${socials
            .map(
              ([label, href]) =>
                `<a href="${href}" style="color:#0a0a0b;font-weight:700;font-size:12px;text-decoration:none;margin:0 10px;font-family:Arial,Helvetica,sans-serif;">${label}</a>`
            )
            .join("")}
        </td>
      </tr>`
    : "";

  const badgeHtml = settings?.logoUrl
    ? `<td style="width:64px;height:64px;border-radius:16px;overflow:hidden;">
        <img src="${settings.logoUrl}" width="64" height="64" style="display:block;width:64px;height:64px;object-fit:cover;border-radius:16px;" alt="${name}" />
      </td>`
    : `<td bgcolor="#c9ff3d" style="background-color:#c9ff3d;width:60px;height:60px;border-radius:50%;text-align:center;vertical-align:middle;font-size:26px;line-height:60px;">💃</td>`;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="dark light" />
    <meta name="supported-color-schemes" content="dark light" />
    <title>${title}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#0a0a0b;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#0a0a0b" style="background-color:#0a0a0b;padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">
            <tr>
              <td align="center" style="padding-bottom:24px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    ${badgeHtml}
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-bottom:24px;">
                <p style="margin:0;color:#84cc16;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;font-family:Arial,Helvetica,sans-serif;">${name}</p>
                <h1 style="margin:10px 0 0;color:#ffffff;font-size:24px;font-weight:800;font-family:Arial,Helvetica,sans-serif;">${title}</h1>
              </td>
            </tr>
            <tr>
              <td bgcolor="#18181b" style="background-color:#18181b;border:1px solid #2e2e33;border-radius:20px;padding:32px;">
                <div style="color:#d4d4d8;font-size:15px;line-height:1.7;font-family:Arial,Helvetica,sans-serif;">
                  ${bodyHtml}
                </div>
              </td>
            </tr>
            ${contactHtml}
            ${socialsHtml}
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
