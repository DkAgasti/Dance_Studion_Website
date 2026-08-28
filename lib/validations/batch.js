// Zod schema for admin batch create/edit (BatchFormDialog).
import { z } from "zod";

export const batchSchema = z.object({
  name: z.string().trim().min(1, "Please enter a style/batch name."),
  level: z.string().trim().optional(),
  studio: z.string().trim().optional(),
  days: z.string().trim().min(1, "Please enter the days."),
  time: z.string().trim().min(1, "Please enter a time."),
  capacity: z.coerce.number().positive("Enter a valid capacity."),
  trainer: z.string().trim().optional(),
  price: z.coerce.number().nonnegative("Enter a valid price."),
});
