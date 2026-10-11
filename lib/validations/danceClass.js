// Zod schema for admin class create/edit (Admin > Classes).
import { z } from "zod";

const faqSchema = z.object({
  q: z.string().trim().min(1),
  a: z.string().trim().min(1),
});

export const danceClassSchema = z.object({
  name: z.string().trim().min(1, "Please enter a class name."),
  description: z.string().trim().optional(),
  ageGroup: z.string().trim().optional(),
  level: z.string().trim().optional(),
  imageUrl: z.string().trim().optional(),
  featured: z.boolean().optional(),
  longDescription: z.string().trim().optional(),
  whatYoullLearn: z.array(z.string().trim().min(1)).optional(),
  galleryImages: z.array(z.string().trim().min(1)).optional(),
  faqs: z.array(faqSchema).optional(),
});
