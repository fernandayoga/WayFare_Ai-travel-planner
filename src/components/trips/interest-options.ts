import type { Interest, TravelStyle } from "@/models/Trip";
import {
  Utensils,
  Landmark,
  Trees,
  BookOpen,
  Moon,
  ShoppingBag,
  Waves,
  Mountain,
  Palette,
  Camera,
} from "lucide-react";

export const INTEREST_OPTIONS: { value: Interest; label: string; icon: typeof Utensils }[] = [
  { value: "food", label: "Food & drink", icon: Utensils },
  { value: "culture", label: "Culture", icon: Landmark },
  { value: "nature", label: "Nature", icon: Trees },
  { value: "history", label: "History", icon: BookOpen },
  { value: "nightlife", label: "Nightlife", icon: Moon },
  { value: "shopping", label: "Shopping", icon: ShoppingBag },
  { value: "relaxation", label: "Relaxation", icon: Waves },
  { value: "adventure", label: "Adventure", icon: Mountain },
  { value: "art", label: "Art", icon: Palette },
  { value: "photography", label: "Photography", icon: Camera },
];

export const TRAVEL_STYLE_OPTIONS: { value: TravelStyle; label: string; body: string }[] = [
  { value: "relaxed", label: "Relaxed", body: "Few activities, plenty of downtime, later starts." },
  { value: "balanced", label: "Balanced", body: "A steady mix of sights, food, and rest." },
  { value: "adventurous", label: "Adventurous", body: "Packed days, active and outdoor-heavy." },
  { value: "luxury", label: "Luxury", body: "Higher-end dining, private transport, comfortable pace." },
];

export const CURRENCY_OPTIONS = ["USD", "IDR", "EUR", "SGD"] as const;
