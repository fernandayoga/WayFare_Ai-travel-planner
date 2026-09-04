import Link from "next/link";
import { auth } from "@/lib/auth";
import { listTripsForUser } from "@/lib/data/trips";
import { TripCard } from "@/components/trips/trip-card";
import { EmptyTrips } from "@/components/trips/empty-trips";
import { Button } from "@/components/ui/button";

export default async function TripsPage() {
  const session = await auth();
  const trips = await listTripsForUser(session!.user.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">My Trips</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {trips.length} trip{trips.length === 1 ? "" : "s"} planned so far
          </p>
        </div>
        <Button asChild variant="primary">
          <Link href="/trips/new">Plan a new trip</Link>
        </Button>
      </div>

      {trips.length === 0 ? (
        <EmptyTrips />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
}
