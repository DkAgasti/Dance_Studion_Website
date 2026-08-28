// Zod schema for the trial booking form (book-trial page + TrialWizard).
import { z } from "zod";

export const trialSchema = z.object({
  bookingFor: z.enum(["myself", "someone-else"], {
    error: "Please choose who this trial is for.",
  }),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"], {
    error: "Please select an experience level.",
  }),
  ageGroup: z.enum(["kids", "teens", "adults"], {
    error: "Please select an age group.",
  }),
  interest: z.string().min(1, "Please pick a class you're interested in."),
  date: z
    .string()
    .min(1, "Please pick a date.")
    .refine((val) => new Date(val) >= new Date(new Date().toDateString()), {
      message: "Please pick a date from today onward.",
    }),
  timeSlot: z.enum(["morning", "afternoon", "evening", "night"], {
    error: "Please select a time slot.",
  }),
  name: z.string().trim().min(2, "Please enter your full name."),
  phone: z
    .string()
    .trim()
    .regex(/^[+]?[\d\s-]{7,15}$/, "Enter a valid phone number."),
  email: z.union([z.email("Enter a valid email address."), z.literal("")]),
});

export const trialStepFields = {
  1: ["bookingFor"],
  2: ["experienceLevel", "ageGroup"],
  3: ["interest"],
  4: ["date", "timeSlot"],
  5: ["name", "phone", "email"],
  6: [],
};

export const trialDefaultValues = {
  bookingFor: "",
  experienceLevel: "",
  ageGroup: "",
  interest: "",
  date: "",
  timeSlot: "",
  name: "",
  phone: "",
  email: "",
};

// Admin status update (PATCH /api/trial-bookings/[id]).
export const trialStatusUpdateSchema = z.object({
  status: z.enum(["NEW", "ATTENDED", "CONVERTED", "NO_SHOW"], {
    error: "Invalid status.",
  }),
});
