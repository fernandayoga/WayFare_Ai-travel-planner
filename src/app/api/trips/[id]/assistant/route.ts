import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Trip } from "@/models/Trip";
import { assistantRequestSchema } from "@/lib/validations";
import { reviseItinerary } from "@/lib/ai/itinerary";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = assistantRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid message" },
      { status: 400 }
    );
  }

  await connectToDatabase();
  const trip = await Trip.findOne({ _id: id, userId: session.user.id });

  if (!trip) {
    return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  }

  if (trip.status !== "ready") {
    return NextResponse.json(
      { error: "This trip's itinerary isn't ready to edit yet" },
      { status: 409 }
    );
  }

  const { message } = parsed.data;
  trip.chatHistory.push({ role: "user", content: message, createdAt: new Date() });

  try {
    const { itinerary, model } = await reviseItinerary(
      {
        title: trip.title,
        summary: trip.summary ?? "",
        days: trip.days,
        budgetBreakdown: trip.budgetBreakdown ?? {
          currency: trip.currency,
          total: trip.budget,
          categories: [],
        },
      },
      message,
      {
        destination: trip.destination,
        budget: trip.budget,
        currency: trip.currency,
        travelers: trip.travelers,
      }
    );

    trip.title = itinerary.title;
    trip.summary = itinerary.summary;
    trip.days = itinerary.days;
    trip.budgetBreakdown = itinerary.budgetBreakdown;
    trip.aiModel = model;

    const assistantReply = `Updated the itinerary: ${itinerary.summary}`;
    trip.chatHistory.push({
      role: "assistant",
      content: assistantReply,
      createdAt: new Date(),
    });

    await trip.save();

    return NextResponse.json({ trip });
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to update the itinerary";
    trip.chatHistory.push({
      role: "assistant",
      content: `Sorry, I couldn't apply that change: ${errorMessage}`,
      createdAt: new Date(),
    });
    await trip.save();

    return NextResponse.json({ error: errorMessage, trip }, { status: 502 });
  }
}
