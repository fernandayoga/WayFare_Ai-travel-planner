import Link from "next/link";
import { ArrowRight, MapPin, Wallet, MessageSquareText, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DestinationArt } from "@/components/trips/destination-art";

const SAMPLE_DAY = {
  destination: "Kyoto, Japan",
  theme: "Temples & Tea Houses",
  activities: [
    { time: "08:30", title: "Fushimi Inari Torii Trail", cost: "Free", category: "Sightseeing" },
    { time: "11:00", title: "Nishiki Market food crawl", cost: "$28", category: "Food" },
    { time: "14:00", title: "Gion tea ceremony", cost: "$45", category: "Activity" },
    { time: "18:30", title: "Kaiseki dinner, Pontocho alley", cost: "$62", category: "Food" },
  ],
};

const STEPS = [
  {
    icon: MapPin,
    title: "Tell Wayfare the shape of your trip",
    body: "Destination, dates, traveler count, budget, pace, and what you're into — food, nature, nightlife, whatever.",
  },
  {
    icon: Clock3,
    title: "Get a day-by-day plan in minutes",
    body: "A full itinerary lands with timed activities, locations, durations, and a cost for each stop — not generic suggestions.",
  },
  {
    icon: MessageSquareText,
    title: "Reshape it by asking",
    body: '"Make day 3 more relaxed" or "cut the budget by 20%" — the assistant rewrites the plan and the numbers together.',
  },
];

const FEATURES = [
  {
    title: "Real day-by-day structure",
    body: "Every day gets timed activities with location, duration, and estimated cost, not a wall of paragraph text.",
  },
  {
    title: "Budget that adds up",
    body: "A category-by-category breakdown is generated alongside the itinerary, so you see where the money actually goes.",
  },
  {
    title: "An assistant that edits, not just chats",
    body: "Ask for a change in plain language and the itinerary and budget both update - no rebuilding from scratch.",
  },
  {
    title: "Your trips, privately yours",
    body: "Every trip is tied to your account. Only you can view, edit, or delete the trips you create.",
  },
];

export default function LandingPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-14 sm:pt-20">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <h1 className="font-display text-[2.6rem] font-medium leading-[1.08] text-ink sm:text-[3.4rem]">
              A full trip plan,
              <br />
              built while you make coffee.
            </h1>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink-soft">
              Wayfare turns a destination, a budget, and a few preferences into a
              day-by-day itinerary with real activities, locations, and costs —
              then lets you refine it just by asking.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" variant="primary">
                <Link href="/register">
                  Plan your first trip <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
             
            </div>
            <div className="mt-10 flex items-center gap-6 text-xs text-ink-soft">
              <span>No credit card</span>
              <span className="hairline w-6" />
              <span>Free to try</span>
              <span className="hairline w-6" />
              <span>Your data stays yours</span>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-xl border border-line bg-card shadow-[0_20px_50px_-25px_rgba(23,35,31,0.35)]">
              <div className="h-28 w-full">
                <DestinationArt destination={SAMPLE_DAY.destination} />
              </div>
              <div className="border-t border-line p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-ink-soft/70">Day 2</p>
                    <p className="font-display text-lg text-ink">{SAMPLE_DAY.theme}</p>
                  </div>
                  <Badge variant="gold">{SAMPLE_DAY.destination}</Badge>
                </div>
                <div className="mt-4 space-y-0">
                  {SAMPLE_DAY.activities.map((a, i) => (
                    <div key={a.title} className="relative flex gap-3 pb-4 pl-1 last:pb-0">
                      {i !== SAMPLE_DAY.activities.length - 1 && (
                        <span className="absolute left-[7px] top-4 h-full w-px bg-line" />
                      )}
                      <span className="relative z-10 mt-1.5 h-3 w-3 shrink-0 rounded-full border-2 border-moss bg-paper" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium text-ink">{a.title}</p>
                          <span className="whitespace-nowrap text-xs text-ink-soft">{a.cost}</span>
                        </div>
                        <p className="text-xs text-ink-soft">{a.time} · {a.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-t border-line bg-paper-dim/60">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="font-display text-2xl font-medium text-ink sm:text-3xl">How it works</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.title}>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-moss text-paper">
                  <step.icon className="h-5 w-5" />
                </div>
                <p className="text-xs font-medium text-gold">Step {i + 1}</p>
                <h3 className="mt-1 font-display text-lg text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-6 py-16">
        <div className="max-w-lg">
          <h2 className="font-display text-2xl font-medium text-ink sm:text-3xl">
            Built for planning trips, not chatting about them
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            Wayfare focuses on getting from an idea to a usable plan - clean itinerary
            structure, a budget you can trust, and quick edits when your plans change.
          </p>
        </div>
        <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-card p-6">
              <h3 className="font-display text-base text-ink">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-16 sm:flex-row sm:items-center">
          <div>
            <Wallet className="mb-3 h-6 w-6 text-gold" />
            <h2 className="font-display text-2xl font-medium text-ink">Ready to see your itinerary?</h2>
            <p className="mt-1 text-sm text-ink-soft">It takes about a minute to describe your trip.</p>
          </div>
          <Button asChild size="lg" variant="primary">
            <Link href="/register">
              Create your first trip <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
