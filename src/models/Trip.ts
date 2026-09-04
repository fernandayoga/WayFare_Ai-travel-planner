import { Schema, model, models, type Document, type Model, Types } from "mongoose";
import { TRAVEL_STYLES, INTERESTS, ACTIVITY_CATEGORIES } from "@/lib/constants";
import type { TravelStyle, Interest, ActivityCategory } from "@/lib/constants";

export { TRAVEL_STYLES, INTERESTS, ACTIVITY_CATEGORIES };
export type { TravelStyle, Interest, ActivityCategory };

export interface IActivity {
  time: string;
  title: string;
  description: string;
  location: string;
  durationMinutes: number;
  estimatedCost: number;
  category: ActivityCategory;
}

export interface IDayPlan {
  day: number;
  date: string;
  theme?: string;
  activities: IActivity[];
}

export interface IBudgetCategory {
  category: string;
  amount: number;
  percentage: number;
}

export interface IBudgetBreakdown {
  currency: string;
  total: number;
  categories: IBudgetCategory[];
}

export interface IChatMessage {
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

export interface ITrip extends Document {
  userId: Types.ObjectId;
  destination: string;
  title: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  currency: string;
  travelStyle: TravelStyle;
  interests: Interest[];
  status: "generating" | "ready" | "error";
  errorMessage?: string;
  summary?: string;
  days: IDayPlan[];
  budgetBreakdown?: IBudgetBreakdown;
  chatHistory: IChatMessage[];
  aiModel?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema = new Schema<IActivity>(
  {
    time: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    durationMinutes: { type: Number, required: true, min: 0 },
    estimatedCost: { type: Number, required: true, min: 0 },
    category: { type: String, enum: ACTIVITY_CATEGORIES, required: true },
  },
  { _id: false }
);

const DayPlanSchema = new Schema<IDayPlan>(
  {
    day: { type: Number, required: true },
    date: { type: String, required: true },
    theme: { type: String },
    activities: { type: [ActivitySchema], default: [] },
  },
  { _id: false }
);

const BudgetCategorySchema = new Schema<IBudgetCategory>(
  {
    category: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    percentage: { type: Number, required: true, min: 0, max: 100 },
  },
  { _id: false }
);

const BudgetBreakdownSchema = new Schema<IBudgetBreakdown>(
  {
    currency: { type: String, required: true },
    total: { type: Number, required: true, min: 0 },
    categories: { type: [BudgetCategorySchema], default: [] },
  },
  { _id: false }
);

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: () => new Date() },
  },
  { _id: false }
);

const TripSchema = new Schema<ITrip>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    destination: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    travelers: { type: Number, required: true, min: 1, max: 30 },
    budget: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: "USD" },
    travelStyle: { type: String, enum: TRAVEL_STYLES, required: true },
    interests: { type: [String], enum: INTERESTS, default: [] },
    status: {
      type: String,
      enum: ["generating", "ready", "error"],
      default: "generating",
    },
    errorMessage: { type: String },
    summary: { type: String },
    days: { type: [DayPlanSchema], default: [] },
    budgetBreakdown: { type: BudgetBreakdownSchema },
    chatHistory: { type: [ChatMessageSchema], default: [] },
    aiModel: { type: String },
  },
  { timestamps: true }
);

TripSchema.index({ userId: 1, createdAt: -1 });

export const Trip: Model<ITrip> =
  (models.Trip as Model<ITrip>) || model<ITrip>("Trip", TripSchema);
