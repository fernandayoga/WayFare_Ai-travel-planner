import { CreateTripForm } from "@/components/trips/create-trip-form";

export default function NewTripPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">Plan a new trip</h1>
        <p className="mt-1 text-sm text-ink-soft">
          A few details and Wayfare will draft your full itinerary.
        </p>
      </div>
      <CreateTripForm />
    </div>
  );
}
