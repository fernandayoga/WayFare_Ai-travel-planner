import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Trip } from "@/models/Trip";

async function getOwnedTrip(id: string, userId: string) {
  if (!mongoose.isValidObjectId(id)) return null;
  return Trip.findOne({ _id: id, userId });
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await connectToDatabase();
  const trip = await getOwnedTrip(id, session.user.id);

  if (!trip) {
    return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  }

  return NextResponse.json({ trip });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await connectToDatabase();
  const trip = await getOwnedTrip(id, session.user.id);

  if (!trip) {
    return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Only allow editing a small, safe set of fields directly (not the AI
  // generated itinerary content - that goes through the assistant route).
  const allowedFields = ["destination", "title", "travelers", "budget"] as const;
  for (const field of allowedFields) {
    if (field in body) {
      // @ts-expect-error - dynamic assignment across a known safe field set
      trip[field] = body[field];
    }
  }

  await trip.save();
  return NextResponse.json({ trip });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await connectToDatabase();
  const trip = await getOwnedTrip(id, session.user.id);

  if (!trip) {
    return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  }

  await trip.deleteOne();
  return NextResponse.json({ success: true });
}
