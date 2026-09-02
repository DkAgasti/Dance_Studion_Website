"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { useStudioSettings } from "@/lib/useStudioSettings";
import { InstagramIcon, FacebookIcon, YoutubeIcon, XIcon, PLATFORM_HOME } from "@/components/shared/SocialIcons";

// "Follow Our Moves" social icons row — Instagram/Facebook/YouTube open the
// admin's real account URL once set, otherwise the generic platform
// homepage (not a fabricated "asmdancestudio" guess). Twitter/X has no
// admin field at all, so it always comes from siteConfig.
export default function SocialRow() {
  const settings = useStudioSettings();

  const SOCIALS = [
    { key: "instagram", Icon: InstagramIcon, name: "Instagram", href: settings?.socials?.instagram || PLATFORM_HOME.instagram },
    { key: "facebook", Icon: FacebookIcon, name: "Facebook", href: settings?.socials?.facebook || PLATFORM_HOME.facebook },
    { key: "youtube", Icon: YoutubeIcon, name: "YouTube", href: settings?.socials?.youtube || PLATFORM_HOME.youtube },
    { key: "twitter", Icon: XIcon, name: "Twitter", href: siteConfig.socials.twitter },
  ];

  return (
    <section className="container-page pb-20 text-center md:pb-28">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="h3-display uppercase"
      >
        Follow Our Moves
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="mt-8 flex items-center justify-center gap-6"
      >
        {SOCIALS.map((social) => (
          <a
            key={social.key}
            href={social.href}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={social.name}
            className="flex flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="glass flex size-12 items-center justify-center rounded-full">
              <social.Icon className="size-5" />
            </span>
            <span className="text-[10px] font-bold tracking-wide uppercase">
              {social.name}
            </span>
          </a>
        ))}
      </motion.div>
    </section>
  );
}
