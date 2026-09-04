import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Trip } from "@/models/Trip";
import { createTripSchema } from "@/lib/validations";
import { generateItinerary } from "@/lib/ai/itinerary";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();
  const trips = await Trip.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .select("destination title startDate endDate travelers budget currency travelStyle status createdAt")
    .lean();

  return NextResponse.json({ trips });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = createTripSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid trip details" },
      { status: 400 }
    );
  }

  const input = parsed.data;
  await connectToDatabase();

  // Create a placeholder trip first so we have a stable id, then fill it in
  // once the AI responds (or mark it as errored so the user can retry).
  const trip = await Trip.create({
    userId: session.user.id,
    destination: input.destination,
    title: input.destination,
    startDate: input.startDate,
    endDate: input.endDate,
    travelers: input.travelers,
    budget: input.budget,
    currency: input.currency,
    travelStyle: input.travelStyle,
    interests: input.interests,
    status: "generating",
    days: [],
    chatHistory: [],
  });

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
    trip.errorMessage =
      err instanceof Error ? err.message : "Failed to generate itinerary";
    await trip.save();
  }

  return NextResponse.json(
    { id: trip._id.toString(), status: trip.status },
    { status: 201 }
  );
}
