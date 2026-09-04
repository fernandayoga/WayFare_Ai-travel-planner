import Link from "next/link";
import { Compass } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-2 font-display text-lg font-medium text-ink", className)}
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-moss text-paper">
        <Compass className="h-4 w-4" />
      </span>
      Wayfare
    </Link>
  );
}
