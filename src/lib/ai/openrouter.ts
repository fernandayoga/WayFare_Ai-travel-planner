import { getOpenRouterConfig } from "@/lib/env";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Calls the OpenRouter chat completions endpoint and returns the raw text
 * content of the model's reply. This is server-only - it reads the API key
 * from process.env and must never be imported from client components.
 */
export async function callOpenRouter(messages: ChatMessage[]): Promise<string> {
  const { apiKey, model } = getOpenRouterConfig();

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      // Optional but recommended by OpenRouter for attribution/rate-limit context.
      "X-Title": "AI Travel Planner",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(
      `OpenRouter request failed (${res.status}): ${errText || res.statusText}`
    );
  }

  const data = await res.json();
  const content: string | undefined = data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("OpenRouter returned an empty response");
  }

  return content;
}

/**
 * Strips markdown code fences if the model ignored instructions and wrapped
 * the JSON in ```json ... ``` anyway, then parses it.
 */
export function parseJsonResponse(raw: string): unknown {
  const cleaned = raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  return JSON.parse(cleaned);
}
