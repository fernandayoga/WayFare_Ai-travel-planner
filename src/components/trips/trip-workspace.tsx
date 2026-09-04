"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ItineraryTimeline } from "@/components/trips/itinerary-timeline";
import { BudgetBreakdown } from "@/components/trips/budget-breakdown";
import { AssistantChat, type ChatMessage } from "@/components/trips/assistant-chat";
import type { IDayPlan, IBudgetBreakdown } from "@/models/Trip";

interface Itinerary {
  title: string;
  summary?: string;
  days: IDayPlan[];
  budgetBreakdown?: IBudgetBreakdown;
}

export function TripWorkspace({
  tripId,
  initial,
  currency,
  budget,
  chatHistory,
  ready,
}: {
  tripId: string;
  initial: Itinerary;
  currency: string;
  budget: number;
  chatHistory: ChatMessage[];
  ready: boolean;
}) {
  const [itinerary, setItinerary] = useState<Itinerary>(initial);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        {itinerary.summary && (
          <Card className="p-5">
            <p className="text-sm leading-relaxed text-ink-soft">{itinerary.summary}</p>
          </Card>
        )}

        <Tabs defaultValue="itinerary">
          <TabsList>
            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
          </TabsList>
          <TabsContent value="itinerary" className="mt-5">
            <Card className="p-5 sm:p-6">
              <ItineraryTimeline days={itinerary.days} currency={currency} />
            </Card>
          </TabsContent>
          <TabsContent value="budget" className="mt-5">
            <Card className="p-5 sm:p-6">
              {itinerary.budgetBreakdown ? (
                <BudgetBreakdown breakdown={itinerary.budgetBreakdown} plannedBudget={budget} />
              ) : (
                <p className="text-sm text-ink-soft">No budget breakdown yet.</p>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Card className="h-[560px] lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)]">
        <AssistantChat
          tripId={tripId}
          initialMessages={chatHistory}
          disabled={!ready}
          onUpdated={(trip) =>
            setItinerary({
              title: trip.title,
              summary: trip.summary,
              days: trip.days as IDayPlan[],
              budgetBreakdown: trip.budgetBreakdown as IBudgetBreakdown | undefined,
            })
          }
        />
      </Card>
    </div>
  );
}
