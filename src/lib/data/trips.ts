import "server-only";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import {
  Trip,
  type ITrip,
  type IDayPlan,
  type IBudgetBreakdown,
  type Interest,
  type TravelStyle,
} from "@/models/Trip";

export interface TripSummary {
  id: string;
  destination: string;
  title: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  currency: string;
  travelStyle: string;
  status: ITrip["status"];
  createdAt: string;
}

export interface TripDetail {
  id: string;
  destination: string;
  title: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  currency: string;
  travelStyle: TravelStyle;
  interests: Interest[];
  status: ITrip["status"];
  errorMessage?: string;
  summary?: string;
  days: IDayPlan[];
  budgetBreakdown?: IBudgetBreakdown;
  chatHistory: { role: "user" | "assistant"; content: string; createdAt: string }[];
  aiModel?: string;
  createdAt: string;
  updatedAt: string;
}

export async function listTripsForUser(userId: string): Promise<TripSummary[]> {
  await connectToDatabase();
  const trips = await Trip.find({ userId })
    .sort({ createdAt: -1 })
    .select("destination title startDate endDate travelers budget currency travelStyle status createdAt")
    .lean();

  return trips.map((t) => ({
    id: t._id.toString(),
    destination: t.destination,
    title: t.title,
    startDate: t.startDate,
    endDate: t.endDate,
    travelers: t.travelers,
    budget: t.budget,
    currency: t.currency,
    travelStyle: t.travelStyle,
    status: t.status,
    createdAt: t.createdAt.toISOString(),
  }));
}

export async function getTripForUser(id: string, userId: string): Promise<TripDetail | null> {
  if (!mongoose.isValidObjectId(id)) return null;
  await connectToDatabase();
  const trip = await Trip.findOne({ _id: id, userId }).lean();
  if (!trip) return null;

  return {
    id: trip._id.toString(),
    destination: trip.destination,
    title: trip.title,
    startDate: trip.startDate,
    endDate: trip.endDate,
    travelers: trip.travelers,
    budget: trip.budget,
    currency: trip.currency,
    travelStyle: trip.travelStyle,
    interests: trip.interests,
    status: trip.status,
    errorMessage: trip.errorMessage,
    summary: trip.summary,
    days: trip.days ?? [],
    budgetBreakdown: trip.budgetBreakdown,
    aiModel: trip.aiModel,
    createdAt: trip.createdAt.toISOString(),
    updatedAt: trip.updatedAt.toISOString(),
    chatHistory: (trip.chatHistory ?? []).map((m) => ({
      role: m.role,
      content: m.content,
      createdAt: m.createdAt.toISOString(),
    })),
  };
}
