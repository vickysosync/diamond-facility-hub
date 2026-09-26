import mongoose, { Schema, Document, Model } from "mongoose";

export interface IQuoteRequest extends Document {
  quoteId: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  facilityType?: string;
  facilitySize?: number;
  selectedServices: string[];
  frequency?: string;
  preferredDate?: string;
  city?: string;
  estimatedCost?: number;
  notes?: string;
  status: "New" | "Contacted" | "Quoted" | "Converted" | "Closed";
  createdAt: Date;
  updatedAt: Date;
}

const QuoteRequestSchema = new Schema<IQuoteRequest>(
  {
    quoteId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    contactPerson: {
      type: String,
      required: [true, "Contact person is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    facilityType: {
      type: String,
      default: "Corporate Office",
      trim: true,
    },
    facilitySize: {
      type: Number,
      default: 0,
    },
    selectedServices: {
      type: [String],
      required: [true, "At least one service is required"],
    },
    frequency: {
      type: String,
      default: "One Time",
      trim: true,
    },
    preferredDate: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "Pune",
      trim: true,
    },
    estimatedCost: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      default: "New",
      enum: ["New", "Contacted", "Quoted", "Converted", "Closed"],
    },
  },
  {
    timestamps: true,
  }
);

QuoteRequestSchema.index({ status: 1 });
QuoteRequestSchema.index({ createdAt: -1 });

export const QuoteRequest: Model<IQuoteRequest> =
  mongoose.models.QuoteRequest ||
  mongoose.model<IQuoteRequest>("QuoteRequest", QuoteRequestSchema);

export default QuoteRequest;
