// Zod schema for admin student create/edit (StudentFormDialog).
import { z } from "zod";

export const studentSchema = z.object({
  name: z.string().trim().min(2, "Please enter the student's full name."),
  email: z.email("Enter a valid email address."),
  phone: z
    .string()
    .trim()
    .regex(/^[+]?[\d\s-]{7,15}$/, "Enter a valid phone number."),
  batchId: z.string().min(1, "Please select a batch."),
  plan: z.string().trim().min(1, "Please select a plan."),
  guardianName: z.string().trim().optional(),
  guardianPhone: z.string().trim().optional(),
  guardianRelation: z.string().trim().optional(),
});
