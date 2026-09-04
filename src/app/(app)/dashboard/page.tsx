import Link from "next/link";
import { ArrowRight, MapPin, Wallet, CalendarClock } from "lucide-react";
import { auth } from "@/lib/auth";
import { listTripsForUser } from "@/lib/data/trips";
import { TripCard } from "@/components/trips/trip-card";
import { EmptyTrips } from "@/components/trips/empty-trips";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency, tripDurationDays } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await auth();
  const trips = await listTripsForUser(session!.user.id);

  const firstName = (session!.user.name ?? "there").split(" ")[0];
  const readyTrips = trips.filter((t) => t.status === "ready");
  // eslint-disable-next-line react-hooks/purity -- server component, evaluated once per request
  const now = Date.now();
  const upcoming = readyTrips
    .filter((t) => new Date(t.startDate).getTime() >= now - 1000 * 60 * 60 * 24)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0];

  const totalBudget = readyTrips.reduce((sum, t) => sum + t.budget, 0);
  const totalDays = readyTrips.reduce(
    (sum, t) => sum + tripDurationDays(t.startDate, t.endDate),
    0
  );

  const recent = trips.slice(0, 6);

  return (
    <div className="space-y-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-ink-soft">Welcome back</p>
          <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">
            {firstName}&rsquo;s trips
          </h1>
        </div>
        <Button asChild variant="primary">
          <Link href="/trips/new">Plan a new trip</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center gap-2 text-ink-soft">
            <MapPin className="h-4 w-4" />
            <p className="text-xs font-medium uppercase tracking-wide">Trips planned</p>
          </div>
          <p className="mt-2 font-display text-3xl text-ink">{trips.length}</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-ink-soft">
            <CalendarClock className="h-4 w-4" />
            <p className="text-xs font-medium uppercase tracking-wide">Days itinerary-ready</p>
          </div>
          <p className="mt-2 font-display text-3xl text-ink">{totalDays}</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-ink-soft">
            <Wallet className="h-4 w-4" />
            <p className="text-xs font-medium uppercase tracking-wide">Combined budget</p>
          </div>
          <p className="mt-2 font-display text-3xl text-ink">
            {totalBudget > 0 ? formatCurrency(totalBudget, readyTrips[0]?.currency ?? "USD") : "—"}
          </p>
        </Card>
      </div>

      {upcoming && (
        <Card className="flex flex-col justify-between gap-4 border-moss/30 bg-moss-tint/40 p-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-moss-dark">
              Next up
            </p>
            <p className="mt-1 font-display text-xl text-ink">{upcoming.title}</p>
            <p className="text-sm text-ink-soft">{upcoming.destination}</p>
          </div>
          <Button asChild variant="primary">
            <Link href={`/trips/${upcoming.id}`}>
              View itinerary <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </Card>
      )}

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl text-ink">Recent trips</h2>
          {trips.length > 0 && (
            <Link href="/trips" className="text-sm font-medium text-moss hover:underline">
              View all
            </Link>
          )}
        </div>
        {recent.length === 0 ? (
          <EmptyTrips />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
