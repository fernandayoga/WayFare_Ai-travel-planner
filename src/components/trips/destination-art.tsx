"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

const PALETTES = [
  ["#2f5d48", "#bd8a2c"],
  ["#a8552f", "#2f5d48"],
  ["#223f32", "#bd8a2c"],
  ["#8a6420", "#2f5d48"],
];

function hashString(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Deterministic abstract "postcard" art generated from the destination
 * name - contour lines + a location pin, in the app's own palette. Stands
 * in for a real photo without relying on external images or generic stock
 * placeholders.
 */
export function DestinationArt({
  destination,
  className,
}: {
  destination: string;
  className?: string;
}) {
  const seed = useMemo(() => hashString(destination || "trip"), [destination]);
  const [primary, secondary] = PALETTES[seed % PALETTES.length];

  const lines = useMemo(() => {
    const count = 5;
    return Array.from({ length: count }).map((_, i) => {
      const base = 40 + i * 26 + (seed % 13);
      const wobble = ((seed >> i) % 20) - 10;
      return `M -20 ${base + wobble} C 60 ${base - 30 + wobble}, 140 ${base + 40 + wobble}, 260 ${base - 10 + wobble} S 380 ${base + 20 + wobble}, 420 ${base + wobble}`;
    });
  }, [seed]);

  const pinX = 60 + (seed % 240);
  const pinY = 50 + ((seed >> 3) % 100);

  return (
    <svg
      viewBox="0 0 360 200"
      className={cn("h-full w-full", className)}
      role="img"
      aria-label={`Abstract map illustration for ${destination}`}
    >
      <rect width="360" height="200" fill="var(--paper-dim)" />
      <g opacity="0.55" stroke={primary} strokeWidth="1.1" fill="none">
        {lines.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      <circle cx={pinX} cy={pinY} r="5" fill={secondary} />
      <circle cx={pinX} cy={pinY} r="10" fill="none" stroke={secondary} strokeWidth="1" opacity="0.5" />
      <path
        d={`M ${pinX} ${pinY - 22} c 9 0 16 7 16 16 c 0 11 -16 26 -16 26 s -16 -15 -16 -26 c 0 -9 7 -16 16 -16 z`}
        fill={primary}
      />
      <circle cx={pinX} cy={pinY - 6} r="5" fill="var(--paper)" />
    </svg>
  );
}
