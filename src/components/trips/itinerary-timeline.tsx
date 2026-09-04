"use client";

import { useState } from "react";
import {
  UtensilsCrossed,
  Landmark,
  Car,
  BedDouble,
  Sparkle,
  ShoppingBag,
  Waves,
  CircleDot,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, durationLabel, formatCurrency, formatDateShort } from "@/lib/utils";
import type { IDayPlan, ActivityCategory } from "@/models/Trip";

const CATEGORY_META: Record<ActivityCategory, { icon: typeof UtensilsCrossed; label: string }> = {
  food: { icon: UtensilsCrossed, label: "Kuliner" },
  sightseeing: { icon: Landmark, label: "Wisata" },
  transport: { icon: Car, label: "Transportasi" },
  accommodation: { icon: BedDouble, label: "Penginapan" },
  activity: { icon: Sparkle, label: "Aktivitas" },
  shopping: { icon: ShoppingBag, label: "Belanja" },
  relaxation: { icon: Waves, label: "Relaksasi" },
  other: { icon: CircleDot, label: "Lainnya" },
};

export function ItineraryTimeline({
  days,
  currency,
}: {
  days: IDayPlan[];
  currency: string;
}) {
  const [activeDay, setActiveDay] = useState(0);

  if (days.length === 0) return null;
  const day = days[activeDay];

  return (
    <div>
      <div className="thin-scroll -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {days.map((d, i) => (
          <button
            key={d.day}
            onClick={() => setActiveDay(i)}
            className={cn(
              "flex shrink-0 flex-col items-center rounded-md border px-4 py-2 text-left transition-colors",
              i === activeDay ? "border-moss bg-moss-tint" : "border-line hover:bg-paper-dim"
            )}
          >
            <span className={cn("text-xs font-medium", i === activeDay ? "text-moss-dark" : "text-ink-soft")}>
              Hari {d.day}
            </span>
            <span className="text-[11px] text-ink-soft/70">{formatDateShort(d.date)}</span>
          </button>
        ))}
      </div>

      <div className="mt-6">
        {day.theme && (
          <p className="mb-4 font-display text-lg text-ink">{day.theme}</p>
        )}
        <ol className="space-y-0">
          {day.activities.map((activity, i) => {
            const meta = CATEGORY_META[activity.category] ?? CATEGORY_META.other;
            const Icon = meta.icon;
            const isLast = i === day.activities.length - 1;
            return (
              <li key={i} className="relative flex gap-4 pb-7 last:pb-0">
                {!isLast && (
                  <span className="absolute left-[15px] top-9 h-[calc(100%-2rem)] w-px bg-line" />
                )}
                <div className="flex w-14 shrink-0 flex-col items-center pt-0.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-moss/40 bg-moss-tint text-moss-dark">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="mt-1.5 text-[11px] font-medium text-ink-soft">{activity.time}</span>
                </div>
                <div className="flex-1 rounded-md border border-line bg-card p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h4 className="font-medium text-ink">{activity.title}</h4>
                    <span className="whitespace-nowrap text-sm font-medium text-ink">
                      {activity.estimatedCost > 0
                        ? formatCurrency(activity.estimatedCost, currency)
                        : "Gratis"}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{activity.description}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{activity.location}</Badge>
                    <Badge variant="outline">{durationLabel(activity.durationMinutes)}</Badge>
                    <Badge>{meta.label}</Badge>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
