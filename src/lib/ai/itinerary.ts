import { callAI, parseJsonResponse } from "@/lib/ai/client";
import { buildAssistantPrompt, buildItineraryPrompt } from "@/lib/ai/prompts";
import { aiItinerarySchema, type AiItinerary, type CreateTripInput } from "@/lib/validations";
import { getAIConfig } from "@/lib/env";

async function requestValidatedItinerary(
  system: string,
  user: string
): Promise<{ itinerary: AiItinerary; model: string }> {
  const { model } = getAIConfig();

  const messages = [
    { role: "system" as const, content: system },
    { role: "user" as const, content: user },
  ];

  let lastError: unknown = null;

  // Try twice: if the model returns malformed/invalid JSON the first time,
  // ask it again with a stricter reminder before giving up.
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const raw = await callAI(
        attempt === 0
          ? messages
          : [
              ...messages,
              {
                role: "user" as const,
                content:
                  "Your previous response was not valid JSON matching the required shape. Respond again with ONLY the valid JSON object, nothing else.",
              },
            ]
      );
      const parsed = parseJsonResponse(raw);
      const result = aiItinerarySchema.safeParse(parsed);

      if (result.success) {
        return { itinerary: result.data, model };
      }
      lastError = result.error;
    } catch (err) {
      lastError = err;
    }
  }

  console.error("AI itinerary generation failed after retries:", lastError);
  throw new Error(
    "The AI planner couldn't generate a valid itinerary. Please try again."
  );
}

export function tripDurationDays(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return (
    Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
  );
}

export async function generateItinerary(input: CreateTripInput) {
  const days = tripDurationDays(input.startDate, input.endDate);
  const { system, user } = buildItineraryPrompt(input, days);
  return requestValidatedItinerary(system, user);
}

export async function reviseItinerary(
  currentItinerary: AiItinerary,
  instruction: string,
  context: { destination: string; budget: number; currency: string; travelers: number }
) {
  const { system, user } = buildAssistantPrompt(currentItinerary, instruction, context);
  return requestValidatedItinerary(system, user);
}
