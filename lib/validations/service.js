// Zod schema for admin-managed Services (the "/services" page blocks).
import { z } from "zod";

export const serviceSchema = z.object({
  name: z.string().trim().min(1, "Please enter a service name."),
  eyebrow: z.string().trim().optional(),
  description: z.string().trim().optional(),
  longDescription: z.string().trim().optional(),
  imageUrl: z.string().trim().optional(),
  accent: z.enum(["brand-start", "brand-mid", "brand-end", "brand-lime"]).optional(),
  iconName: z.string().trim().optional(),
  gradient: z.string().trim().optional(),
  benefits: z.array(z.string().trim()).optional(),
  timeSlots: z.array(z.string().trim()).optional(),
  ctaLabel: z.string().trim().optional(),
  ctaHref: z.string().trim().optional(),
  order: z.coerce.number().int().optional(),
});
