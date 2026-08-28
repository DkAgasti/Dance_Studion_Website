// Zod schema for admin fee schedule creation.
import { z } from "zod";

export const feeSchema = z.object({
  studentId: z.string().min(1, "Please select a student."),
  amount: z.coerce.number().positive("Enter a valid amount."),
  dueDate: z.string().min(1, "Please enter a due date."),
  note: z.string().trim().optional(),
});
