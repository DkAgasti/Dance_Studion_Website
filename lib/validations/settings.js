// Zod schemas for admin settings — StudioSettings (partial patches), Plans,
// and Announcements.
import { z } from "zod";
import { extractMapEmbedUrl } from "@/lib/utils";

export const settingsSchema = z
  .object({
    name: z.string().trim().optional(),
    tagline: z.string().trim().optional(),
    logoUrl: z.string().trim().optional(),
    address: z.string().trim().optional(),
    phone: z.string().trim().optional(),
    whatsapp: z.string().trim().optional(),
    email: z.string().trim().optional(),
    hours: z.any().optional(),
    socials: z.any().optional(),
    // Accepts a full pasted <iframe> snippet too — pulls out just the src URL
    // so a stray copy-paste from Google's "Embed a map" panel doesn't get
    // saved as unusable HTML (see extractMapEmbedUrl).
    mapEmbed: z.string().trim().optional().transform((v) => extractMapEmbedUrl(v)),
    heroHeading: z.string().trim().optional(),
    heroSubtext: z.string().trim().optional(),
    heroImageUrl: z.string().trim().optional(),
    heroVideoUrl: z.string().trim().optional(),
    stats: z.any().optional(),
    reminderConfig: z.any().optional(),
  })
  .partial();

export const planSchema = z.object({
  name: z.string().trim().min(1, "Please enter a plan name."),
  tagline: z.string().trim().optional(),
  monthlyPrice: z.coerce.number().nonnegative(),
  quarterlyPrice: z.coerce.number().nonnegative(),
  features: z.array(z.string()).optional(),
  ctaLabel: z.string().trim().optional(),
  highlighted: z.boolean().optional(),
});

export const announcementSchema = z.object({
  title: z.string().trim().optional(),
  text: z.string().trim().optional(),
  link: z.string().trim().optional(),
  active: z.boolean().optional(),
  startsAt: z.string().trim().optional(),
  endsAt: z.string().trim().optional(),
});
