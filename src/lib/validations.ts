import { z } from "zod";
import { ACTIVITY_CATEGORIES, INTERESTS, TRAVEL_STYLES } from "@/lib/constants";

// ---------- Auth ----------
export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;

// ---------- Trip creation ----------
export const createTripSchema = z
  .object({
    destination: z.string().trim().min(2, "Tell us where you're headed").max(120),
    startDate: z.string().min(1, "Pick a start date"),
    endDate: z.string().min(1, "Pick an end date"),
    travelers: z.coerce.number().int().min(1, "At least 1 traveler").max(30),
    budget: z.coerce.number().min(1, "Budget must be greater than 0"),
    currency: z.enum(["USD", "IDR", "EUR", "SGD"]).default("USD"),
    travelStyle: z.enum(TRAVEL_STYLES),
    interests: z.array(z.enum(INTERESTS)).min(1, "Pick at least one interest"),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "End date must be on or after the start date",
    path: ["endDate"],
  })
  .refine(
    (data) => {
      const days =
        Math.round(
          (new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1;
      return days <= 30;
    },
    { message: "Trips longer than 30 days aren't supported yet", path: ["endDate"] }
  );
export type CreateTripInput = z.infer<typeof createTripSchema>;

// ---------- AI structured itinerary output ----------
export const aiActivitySchema = z.object({
  time: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),
  durationMinutes: z.number().int().positive(),
  estimatedCost: z.number().min(0),
  category: z.enum(ACTIVITY_CATEGORIES),
});

export const aiDayPlanSchema = z.object({
  day: z.number().int().positive(),
  date: z.string().min(1),
  theme: z.string().optional(),
  activities: z.array(aiActivitySchema).min(1),
});

export const aiBudgetCategorySchema = z.object({
  category: z.string().min(1),
  amount: z.number().min(0),
  percentage: z.number().min(0).max(100),
});

export const aiBudgetBreakdownSchema = z.object({
  currency: z.string().min(1),
  total: z.number().min(0),
  categories: z.array(aiBudgetCategorySchema).min(1),
});

export const aiItinerarySchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  days: z.array(aiDayPlanSchema).min(1),
  budgetBreakdown: aiBudgetBreakdownSchema,
});
export type AiItinerary = z.infer<typeof aiItinerarySchema>;

// ---------- AI assistant follow-up ----------
export const assistantRequestSchema = z.object({
  message: z.string().trim().min(2, "Tell the assistant what to change").max(1000),
});
export type AssistantRequestInput = z.infer<typeof assistantRequestSchema>;
