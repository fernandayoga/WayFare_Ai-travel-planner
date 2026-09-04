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
  { value: "food", label: "Kuliner", icon: Utensils },
  { value: "culture", label: "Budaya", icon: Landmark },
  { value: "nature", label: "Alam", icon: Trees },
  { value: "history", label: "Sejarah", icon: BookOpen },
  { value: "nightlife", label: "Hiburan Malam", icon: Moon },
  { value: "shopping", label: "Belanja", icon: ShoppingBag },
  { value: "relaxation", label: "Relaksasi", icon: Waves },
  { value: "adventure", label: "Petualangan", icon: Mountain },
  { value: "art", label: "Seni", icon: Palette },
  { value: "photography", label: "Fotografi", icon: Camera },
];

export const TRAVEL_STYLE_OPTIONS: { value: TravelStyle; label: string; body: string }[] = [
  { value: "relaxed", label: "Santai", body: "Sedikit aktivitas, banyak waktu luang, mulai agak siang." },
  { value: "balanced", label: "Seimbang", body: "Perpaduan pas antara wisata, kuliner, dan istirahat." },
  { value: "adventurous", label: "Petualang", body: "Jadwal padat, aktif, dan dominan aktivitas luar ruangan." },
  { value: "luxury", label: "Mewah", body: "Kuliner kelas atas, transportasi pribadi, tempo yang nyaman." },
];

export const CURRENCY_OPTIONS = ["USD", "IDR", "EUR", "SGD"] as const;
