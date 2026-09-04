import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, CalendarDays, Users, Wallet, Loader2 } from "lucide-react";
import { auth } from "@/lib/auth";
import { getTripForUser } from "@/lib/data/trips";
import { StatusBadge } from "@/components/trips/status-badge";
import { TripActions } from "@/components/trips/trip-actions";
import { TripWorkspace } from "@/components/trips/trip-workspace";
import { DestinationArt } from "@/components/trips/destination-art";
import { Card } from "@/components/ui/card";
import { formatCurrency, formatDate, tripDurationDays } from "@/lib/utils";

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const trip = await getTripForUser(id, session!.user.id);

  if (!trip) notFound();

  const days = tripDurationDays(trip.startDate, trip.endDate);

  return (
    <div className="space-y-6">
      <Link
        href="/trips"
        className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Trip Saya
      </Link>

      <div className="overflow-hidden rounded-lg border border-line bg-card">
        <div className="h-32 w-full sm:h-40">
          <DestinationArt destination={trip.destination} />
        </div>
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">
                {trip.title}
              </h1>
              <StatusBadge status={trip.status} />
            </div>
            <p className="mt-1 text-sm text-ink-soft">{trip.destination}</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-soft">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                {formatDate(trip.startDate)} – {formatDate(trip.endDate)} ({days}d)
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                {trip.travelers} wisatawan
              </span>
              <span className="flex items-center gap-1.5">
                <Wallet className="h-4 w-4" />
                {formatCurrency(trip.budget, trip.currency)}
              </span>
            </div>
          </div>
          <TripActions
            tripId={trip.id}
            destination={trip.destination}
            travelers={trip.travelers}
            budget={trip.budget}
            currency={trip.currency}
            status={trip.status}
          />
        </div>
      </div>

      {trip.status === "generating" && (
        <Card className="flex flex-col items-center justify-center gap-3 px-8 py-20 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-moss" />
          <p className="font-display text-lg text-ink">Wayfare sedang merencanakan trip ini</p>
          <p className="text-sm text-ink-soft">Muat ulang dalam beberapa detik jika tidak ada pembaruan.</p>
        </Card>
      )}

      {trip.status === "error" && (
        <Card className="flex flex-col items-center justify-center gap-3 px-8 py-16 text-center">
          <AlertTriangle className="h-8 w-8 text-danger" />
          <p className="font-display text-lg text-ink">Itinerary ini tidak dapat dibuat</p>
          <p className="max-w-md text-sm text-ink-soft">
            {trip.errorMessage ?? "Terjadi kesalahan saat merencanakan trip ini."}
          </p>
          <p className="text-xs text-ink-soft/70">
            Gunakan &ldquo;Buat ulang Itinerary&rdquo; dari menu di atas untuk mencoba lagi.
          </p>
        </Card>
      )}

      {trip.status === "ready" && (
        <TripWorkspace
          tripId={trip.id}
          initial={{
            title: trip.title,
            summary: trip.summary,
            days: trip.days,
            budgetBreakdown: trip.budgetBreakdown,
          }}
          currency={trip.currency}
          budget={trip.budget}
          chatHistory={trip.chatHistory}
          ready
        />
      )}
    </div>
  );
}
