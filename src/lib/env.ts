/**
 * Central place for reading required environment variables with a clear
 * error message when something is missing, instead of failing deep inside
 * a third-party library.
 */
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable "${name}". Copy .env.example to .env.local and fill it in.`
    );
  }
  return value;
}

export function getAIConfig() {
  return {
    baseUrl: process.env.AI_BASE_URL || "https://openrouter.ai/api/v1",
    apiKey: requireEnv("AI_API_KEY"),
    model: process.env.AI_MODEL || "openai/gpt-4o-mini",
  };
}
