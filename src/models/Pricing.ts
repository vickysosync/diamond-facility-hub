import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPricing extends Document {
  serviceId: string;
  name: string;
  base: number;
  perSqft: number;
  perVisit?: number;
  monthly?: number;
  minCharge: number;
  pricingType: "Fixed" | "Per Sq.Ft" | "Per Visit" | "Monthly" | "Annual Contract" | "Custom Quote";
  isCustomQuote?: boolean;
  status: "Active" | "Inactive";
  createdAt: Date;
  updatedAt: Date;
}

const PricingSchema = new Schema<IPricing>(
  {
    serviceId: {
      type: String,
      required: [true, "Service ID is required"],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
    },
    base: {
      type: Number,
      default: 0,
    },
    perSqft: {
      type: Number,
      default: 0,
    },
    perVisit: {
      type: Number,
      default: 0,
    },
    monthly: {
      type: Number,
      default: 0,
    },
    minCharge: {
      type: Number,
      default: 0,
    },
    pricingType: {
      type: String,
      default: "Per Sq.Ft",
      enum: ["Fixed", "Per Sq.Ft", "Per Visit", "Monthly", "Annual Contract", "Custom Quote"],
    },
    isCustomQuote: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "Active",
      enum: ["Active", "Inactive"],
    },
  },
  {
    timestamps: true,
  }
);

export const Pricing: Model<IPricing> =
  mongoose.models.Pricing || mongoose.model<IPricing>("Pricing", PricingSchema);

export default Pricing;
