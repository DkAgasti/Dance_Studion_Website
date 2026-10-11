// Zod schema for the admin login form.
import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Please enter your password."),
});
