// Zod schema for the admissions/enrollment form.
import { z } from "zod";

export const admissionSchema = z.object({
  // Student Details
  firstName: z.string().trim().min(1, "Please enter the student's first name."),
  lastName: z.string().trim().min(1, "Please enter the student's last name."),
  dob: z
    .string()
    .min(1, "Please enter a date of birth.")
    .refine((val) => new Date(val) <= new Date(), "Date of birth can't be in the future."),
  gender: z.enum(["female", "male", "other", "prefer-not-to-say"], {
    error: "Please select a gender.",
  }),
  photoName: z.string().optional(),

  // Guardian Info (optional — relevant for minors, skippable for adult students)
  guardianName: z.string().trim().optional(),
  guardianRelationship: z.string().optional(),
  guardianPhone: z
    .union([z.string().trim().regex(/^[+]?[\d\s-]{7,15}$/), z.literal("")])
    .optional(),
  guardianEmail: z.union([z.email(), z.literal("")]).optional(),

  // Contact Details
  phone: z
    .string()
    .trim()
    .regex(/^[+]?[\d\s-]{7,15}$/, "Enter a valid phone number."),
  email: z.email("Enter a valid email address."),
  addressLine1: z.string().trim().min(3, "Please enter an address."),
  city: z.string().trim().min(1, "Please enter a city."),
  state: z.string().trim().min(1, "Please enter a state."),
  pincode: z.string().trim().regex(/^\d{4,6}$/, "Enter a valid postal code."),

  // Class Selection
  classInterest: z.string().min(1, "Please select a class."),
  preferredBatchNote: z.string().optional(),

  // Plan Selection
  plan: z.string().min(1, "Please select a plan."),

  // Medical Consent
  medicalNotes: z.string().optional(),
  medicalConsent: z
    .boolean()
    .refine((val) => val === true, "Please confirm to continue."),
});

export const admissionStepFields = {
  1: ["firstName", "lastName", "dob", "gender"],
  2: ["guardianName", "guardianRelationship", "guardianPhone", "guardianEmail"],
  3: ["phone", "email", "addressLine1", "city", "state", "pincode"],
  4: ["classInterest"],
  5: ["plan"],
  6: ["medicalConsent"],
};

// Admin status update (PATCH /api/admissions/[id]).
export const admissionStatusUpdateSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"], { error: "Invalid status." }),
});

export const admissionDefaultValues = {
  firstName: "",
  lastName: "",
  dob: "",
  gender: "",
  photoName: "",
  guardianName: "",
  guardianRelationship: "",
  guardianPhone: "",
  guardianEmail: "",
  phone: "",
  email: "",
  addressLine1: "",
  city: "",
  state: "",
  pincode: "",
  classInterest: "",
  preferredBatchNote: "",
  plan: "",
  medicalNotes: "",
  medicalConsent: false,
};
