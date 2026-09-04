import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyTrips({
  title = "No trips yet",
  body = "Create your first trip and Wayfare will put together a full itinerary and budget for you.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-line px-6 py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-moss-tint text-moss-dark">
        <Compass className="h-6 w-6" />
      </div>
      <h3 className="font-display text-lg text-ink">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-ink-soft">{body}</p>
      <Button asChild variant="primary" className="mt-5">
        <Link href="/trips/new">Plan a trip</Link>
      </Button>
    </div>
  );
}
