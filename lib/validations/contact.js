// Zod schema for the contact page form.
import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name."),
  phone: z
    .string()
    .trim()
    .regex(/^[+]?[\d\s-]{7,15}$/, "Enter a valid phone number."),
  email: z.email("Enter a valid email address."),
  message: z.string().trim().min(10, "Tell us a little more (at least 10 characters)."),
});
