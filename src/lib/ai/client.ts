import { getAIConfig } from "@/lib/env";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Calls the generic OpenAI-compatible chat completions endpoint and returns the raw text
 * content of the model's reply.
 */
export async function callAI(messages: ChatMessage[]): Promise<string> {
  const { baseUrl, apiKey, model } = getAIConfig();
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

  const res = await fetch(`${cleanBaseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 8000,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(
      `AI API request failed (${res.status}): ${errText || res.statusText}`
    );
  }

  const data = await res.json();
  const content: string | undefined = data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("AI API returned an empty response");
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
