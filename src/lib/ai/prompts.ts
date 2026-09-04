import type { CreateTripInput } from "@/lib/validations";
import type { AiItinerary } from "@/lib/validations";

const JSON_SHAPE_INSTRUCTIONS = `
Return ONLY a single valid JSON object (no markdown fences, no commentary, no explanations before or after) matching exactly this shape:

{
  "title": string,                     // short, appealing trip title, e.g. "5 Days of Culture & Coastline in Lisbon"
  "summary": string,                   // 2-4 sentence overview of the trip and how it fits the traveler's style/interests
  "days": [
    {
      "day": number,                   // 1-indexed day number
      "date": "YYYY-MM-DD",
      "theme": string,                 // short theme for the day, e.g. "Old Town & Local Markets"
      "activities": [
        {
          "time": "HH:MM",             // 24h local time
          "title": string,
          "description": string,       // 1-2 sentences, concrete and specific to the destination
          "location": string,          // specific place/area name
          "durationMinutes": number,
          "estimatedCost": number,     // total cost for ALL travelers, in the requested currency, 0 if free
          "category": "food" | "sightseeing" | "transport" | "accommodation" | "activity" | "shopping" | "relaxation" | "other"
        }
      ]
    }
  ],
  "budgetBreakdown": {
    "currency": string,
    "total": number,                   // should be close to (not exceeding) the traveler's stated budget
    "categories": [
      { "category": string, "amount": number, "percentage": number }
    ]
  }
}

Rules:
- IMPORTANT: All generated text content (title, summary, theme, activity title, description) MUST be written in Indonesian language (Bahasa Indonesia).
- DO NOT translate JSON keys or enum values. The "category" field MUST be one of the exact English strings provided above (e.g. "food").
- Every day in the date range must appear, in order, with 3-6 activities each, roughly chronological by time.
- "budgetBreakdown.categories" percentages must sum to ~100.
- "budgetBreakdown.total" must be the sum of all activity estimatedCost across all days (approximately), and should respect the traveler's budget as an upper guide - do not wildly exceed it.
- Be realistic and specific to the destination (real neighborhoods, real types of food, real landmarks) rather than generic placeholders.
- Do not include any keys other than the ones specified above.
`.trim();

export function buildItineraryPrompt(input: CreateTripInput, tripDays: number) {
  const interestsText = input.interests.join(", ");

  const system = `You are an expert local-savvy travel planner who builds realistic, well-paced day-by-day itineraries and clear budget breakdowns. You always respond with strictly valid JSON and nothing else.`;

  const user = `
Plan a trip with the following details:
- Destination: ${input.destination}
- Dates: ${input.startDate} to ${input.endDate} (${tripDays} day${tripDays > 1 ? "s" : ""})
- Number of travelers: ${input.travelers}
- Total budget: ${input.budget} ${input.currency} (for the whole trip, all travelers combined)
- Travel style/pace: ${input.travelStyle}
- Interests: ${interestsText}

Guidance based on travel style:
- "relaxed": fewer activities per day, more downtime, later starts.
- "balanced": moderate number of activities, mix of sightseeing and rest.
- "adventurous": packed days, active/outdoor activities, earlier starts.
- "luxury": higher-end dining/experiences, private transport, comfortable pacing.

${JSON_SHAPE_INSTRUCTIONS}
`.trim();

  return { system, user };
}

export function buildAssistantPrompt(
  currentItinerary: AiItinerary,
  instruction: string,
  context: { destination: string; budget: number; currency: string; travelers: number }
) {
  const system = `You are an expert travel planner helping a traveler revise an existing itinerary. You always respond with strictly valid JSON and nothing else, using the exact same shape as the itinerary you were given.`;

  const user = `
Here is the traveler's current itinerary for a trip to ${context.destination} (budget: ${context.budget} ${context.currency}, ${context.travelers} traveler(s)):

${JSON.stringify(currentItinerary)}

The traveler wants this change:
"${instruction}"

Apply the requested change while keeping everything else sensible and consistent (dates, day count, realistic pacing). Recalculate "budgetBreakdown" so it stays accurate after your edits.

${JSON_SHAPE_INSTRUCTIONS}
`.trim();

  return { system, user };
}
