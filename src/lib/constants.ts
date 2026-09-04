/**
 * Shared enum-like constants. Kept separate from the Mongoose models so
 * client components and edge middleware can import them without pulling
 * in mongoose (which only runs in the Node.js runtime).
 */
export const TRAVEL_STYLES = ["relaxed", "balanced", "adventurous", "luxury"] as const;
export type TravelStyle = (typeof TRAVEL_STYLES)[number];

export const INTERESTS = [
  "food",
  "culture",
  "nature",
  "history",
  "nightlife",
  "shopping",
  "relaxation",
  "adventure",
  "art",
  "photography",
] as const;
export type Interest = (typeof INTERESTS)[number];

export const ACTIVITY_CATEGORIES = [
  "food",
  "sightseeing",
  "transport",
  "accommodation",
  "activity",
  "shopping",
  "relaxation",
  "other",
] as const;
export type ActivityCategory = (typeof ACTIVITY_CATEGORIES)[number];
