// Zod schema for admin content management — Media (reels/photos/certificates/
// testimonials all share this model, distinguished by `type`) and Trainers.
import { z } from "zod";

export const mediaSchema = z.object({
  type: z.enum(["REEL", "PHOTO", "CERTIFICATE", "REVIEW", "MILESTONE"]),
  url: z.string().trim().optional(),
  videoSource: z.enum(["UPLOAD", "YOUTUBE", "INSTAGRAM"]).optional(),
  imageUrl: z.string().trim().optional(),
  caption: z.string().trim().optional(),
  category: z.string().trim().optional(),
  body: z.string().trim().optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  authorName: z.string().trim().optional(),
  featured: z.boolean().optional(),
  order: z.coerce.number().int().optional(),
});

export const trainerSchema = z.object({
  name: z.string().trim().min(1, "Please enter the trainer's name."),
  specialty: z.string().trim().optional(),
  bio: z.string().trim().optional(),
  photoUrl: z.string().trim().optional(),
});
