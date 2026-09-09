import { CreateTripForm } from "@/components/trips/create-trip-form";

export default function NewTripPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">Rencanakan perjalanan baru</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Berikan beberapa detail dan Wayfare akan menyusun itinerary lengkap Anda.
        </p>
      </div>
      <CreateTripForm />
    </div>
  );
}
