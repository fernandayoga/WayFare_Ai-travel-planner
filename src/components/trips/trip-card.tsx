import Link from "next/link";
import { CalendarDays, Users, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/trips/status-badge";
import { DestinationArt } from "@/components/trips/destination-art";
import { formatCurrency, formatDate, tripDurationDays } from "@/lib/utils";
import type { TripSummary } from "@/lib/data/trips";

export function TripCard({ trip }: { trip: TripSummary }) {
  const days = tripDurationDays(trip.startDate, trip.endDate);

  return (
    <Link href={`/trips/${trip.id}`}>
      <Card className="group h-full overflow-hidden transition-shadow hover:shadow-[0_10px_30px_-15px_rgba(23,35,31,0.3)]">
        <div className="h-28 w-full overflow-hidden">
          <DestinationArt destination={trip.destination} />
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg leading-snug text-ink group-hover:text-moss-dark">
              {trip.title}
            </h3>
            <StatusBadge status={trip.status} />
          </div>
          <p className="mt-1 text-sm text-ink-soft">{trip.destination}</p>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ink-soft">
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDate(trip.startDate)} · {days}d
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {trip.travelers}
            </span>
            <span className="flex items-center gap-1">
              <Wallet className="h-3.5 w-3.5" />
              {formatCurrency(trip.budget, trip.currency)}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
