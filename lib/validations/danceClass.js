// Zod schema for admin class create/edit (Admin > Classes).
import { z } from "zod";

export const danceClassSchema = z.object({
  name: z.string().trim().min(1, "Please enter a class name."),
  description: z.string().trim().optional(),
  ageGroup: z.string().trim().optional(),
  level: z.string().trim().optional(),
  imageUrl: z.string().trim().optional(),
  featured: z.boolean().optional(),
});
