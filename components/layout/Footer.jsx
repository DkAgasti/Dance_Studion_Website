import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageWithFallback from "@/components/media/ImageWithFallback";
import { siteConfig } from "@/config/site";

// lucide-react dropped brand/logo marks, so socials render as short labels
// inside the glass badge rather than invented icon glyphs.
const socialIcons = [
  { key: "instagram", label: "IG", href: siteConfig.socials.instagram },
  { key: "facebook", label: "FB", href: siteConfig.socials.facebook },
  { key: "youtube", label: "YT", href: siteConfig.socials.youtube },
  { key: "twitter", label: "X", href: siteConfig.socials.twitter },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-white/[0.02]">
      <div className="container-page grid grid-cols-1 gap-16 py-24 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link
            href="/"
            className="font-display text-2xl font-bold text-gradient-brand"
          >
            ASM
          </Link>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {siteConfig.fullName} — {siteConfig.tagline} {siteConfig.description}
          </p>
          <div className="mt-8 flex items-center gap-3">
            {socialIcons.map(({ key, label, href }) => (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={key}
                className="glass flex size-12 items-center justify-center rounded-full text-xs font-bold text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
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
            <div className="flex gap-3 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              <span>{siteConfig.address.full}</span>
            </div>
            <a
              href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Phone className="size-4 shrink-0" />
              {siteConfig.phone}
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Mail className="size-4 shrink-0" />
              {siteConfig.email}
            </a>
          </div>
          <ImageWithFallback
            icon={MapPin}
            gradient="from-surface to-background"
            className="mt-6 h-[168px] w-full rounded-lg border border-border"
          />
        </div>

        <div>
          <h4 className="h4-display">Stay in the Loop</h4>
          <p className="mt-8 text-sm text-muted-foreground">
            Subscribe to get updates on workshops and performances.
          </p>
          <form className="mt-8 flex flex-col gap-3">
            <input
              type="email"
              required
              placeholder="Email Address"
              className="h-[57px] rounded-full border border-border bg-white/[0.05] px-6 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/50 focus:outline-none"
            />
            <Button className="h-14 rounded-full font-bold">
              Subscribe Now
            </Button>
          </form>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-8 text-xs tracking-wide text-muted-foreground uppercase sm:flex-row">
          <p>© 2026 ASM Dance Studio. All rights reserved.</p>
          <div className="flex gap-8">
            {siteConfig.legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
