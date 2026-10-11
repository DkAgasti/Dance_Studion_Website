// Zod schema for the "Request a Corporate Session" form on the fitness page.
import { z } from "zod";

export const corporateSessionSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name."),
  company: z.string().trim().min(2, "Please enter your company name."),
  phone: z
    .string()
    .trim()
    .regex(/^[+]?[\d\s-]{7,15}$/, "Enter a valid phone number."),
  email: z.email("Enter a valid email address."),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more (at least 10 characters)."),
});
