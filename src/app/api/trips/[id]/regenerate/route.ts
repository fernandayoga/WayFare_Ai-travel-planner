import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Trip } from "@/models/Trip";
import { generateItinerary } from "@/lib/ai/itinerary";
import type { CreateTripInput } from "@/lib/validations";

export async function POST(
  _req: Request,
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

  await connectToDatabase();
  const trip = await Trip.findOne({ _id: id, userId: session.user.id });

  if (!trip) {
    return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  }

  trip.status = "generating";
  trip.errorMessage = undefined;
  await trip.save();

  const input: CreateTripInput = {
    destination: trip.destination,
    startDate: trip.startDate,
    endDate: trip.endDate,
    travelers: trip.travelers,
    budget: trip.budget,
    currency: trip.currency as CreateTripInput["currency"],
    travelStyle: trip.travelStyle,
    interests: trip.interests,
  };

  try {
    const { itinerary, model } = await generateItinerary(input);
    trip.title = itinerary.title;
    trip.summary = itinerary.summary;
    trip.days = itinerary.days;
    trip.budgetBreakdown = itinerary.budgetBreakdown;
    trip.status = "ready";
    trip.aiModel = model;
    await trip.save();
  } catch (err) {
    trip.status = "error";
    trip.errorMessage = err instanceof Error ? err.message : "Failed to generate itinerary";
    await trip.save();
  }

  return NextResponse.json({ trip });
}
