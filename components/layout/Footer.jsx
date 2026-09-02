"use client";

import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cldOptimize } from "@/lib/utils";
import { useStudioSettings } from "@/lib/useStudioSettings";
import NewsletterForm from "@/components/layout/NewsletterForm";
import StudioLogo from "@/components/shared/StudioLogo";
import { InstagramIcon, FacebookIcon, YoutubeIcon, XIcon, PLATFORM_HOME } from "@/components/shared/SocialIcons";

export default function Footer() {
  const settings = useStudioSettings();
  // No siteConfig fallback for these — an empty admin field means "don't
  // show it," not "show the old static placeholder."
  const address = settings?.address || null;
  const phone = settings?.phone || null;
  const email = settings?.email || null;
  const mapSrc = settings?.mapEmbed || (address ? `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed` : null);

  // Twitter/X has no admin field at all, so it always comes from siteConfig.
  const socialIcons = [
    { key: "instagram", Icon: InstagramIcon, href: settings?.socials?.instagram || PLATFORM_HOME.instagram },
    { key: "facebook", Icon: FacebookIcon, href: settings?.socials?.facebook || PLATFORM_HOME.facebook },
    { key: "youtube", Icon: YoutubeIcon, href: settings?.socials?.youtube || PLATFORM_HOME.youtube },
    { key: "twitter", Icon: XIcon, href: siteConfig.socials.twitter },
  ];

  return (
    <footer className="border-t border-border bg-white/[0.02]">
      <div className="container-page grid grid-cols-1 gap-16 py-24 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/">
            <StudioLogo
              className="font-display text-2xl font-bold text-gradient-brand"
              imgClassName="h-16 w-auto object-contain"
            />
          </Link>
          {settings?.tagline ? (
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {settings.tagline}
            </p>
          ) : null}
          <div className="mt-8 flex items-center gap-3">
            {socialIcons.map(({ key, Icon, href }) => (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={key}
                className="glass flex size-12 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
              >
                <Icon className="size-5" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="h4-display">Quick Links</h4>
          <ul className="mt-8 flex flex-col gap-4">
            {siteConfig.footerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="h4-display">Visit Us</h4>
          <div className="mt-8 flex flex-col gap-5">
            {address ? (
              <div className="flex gap-3 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                <span>{address}</span>
              </div>
            ) : null}
            {phone ? (
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Phone className="size-4 shrink-0" />
                {phone}
              </a>
            ) : null}
            {email ? (
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Mail className="size-4 shrink-0" />
                {email}
              </a>
            ) : null}
          </div>
          {mapSrc ? (
            <iframe
              src={mapSrc}
              title="Studio location"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="mt-6 h-[168px] w-full rounded-lg border border-border"
            />
          ) : null}
        </div>

        <div>
          <h4 className="h4-display">Stay in the Loop</h4>
          <p className="mt-8 text-sm text-muted-foreground">
            Subscribe to get updates on workshops and performances.
          </p>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col items-center justify-center gap-2 py-8 text-xs tracking-wide text-muted-foreground uppercase sm:flex-row sm:justify-between">
          <p>© 2026 ASM Dance Studio. All rights reserved.</p>
          {/* TODO: swap href="#" for the real portfolio/contact link */}
          <a
            href="#"
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cldOptimize("https://res.cloudinary.com/fexwwils/image/upload/v1788169092/white_text_logo.png")}
              alt="CodePro"
              className="size-6 rounded-full object-contain"
            />
            Built by 5yearCodePro
          </a>
        </div>
      </div>
    </footer>
  );
}
