import mongoose, { Schema, Document, Model } from "mongoose";

export interface IService extends Document {
  name: string;
  slug: string;
  categoryId?: mongoose.Types.ObjectId;
  categoryName: string;
  shortDescription?: string;
  description?: string;
  features: string[];
  icon?: string;
  image?: {
    secure_url: string;
    public_id: string;
  } | string;
  gallery?: Array<{
    secure_url: string;
    public_id: string;
  } | string>;
  startingPrice?: number;
  priceNote?: string;
  pricingType: "Fixed" | "Per Sq.Ft" | "Per Visit" | "Monthly" | "Annual Contract" | "Custom Quote";
  ctaText?: string;
  status: "Active" | "Inactive";
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      trim: true,
      unique: true,
      lowercase: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "ServiceCategory",
    },
    categoryName: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
    },
    shortDescription: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    features: {
      type: [String],
      default: [],
    },
    icon: {
      type: String,
      default: "shield",
      trim: true,
    },
    image: {
      type: Schema.Types.Mixed,
      default: "/images/hero.jpg",
    },
    gallery: {
      type: [Schema.Types.Mixed],
      default: [],
    },
    startingPrice: {
      type: Number,
      default: 0,
    },
    priceNote: {
      type: String,
      default: "per service",
      trim: true,
    },
    pricingType: {
      type: String,
      default: "Custom Quote",
      enum: ["Fixed", "Per Sq.Ft", "Per Visit", "Monthly", "Annual Contract", "Custom Quote"],
    },
    ctaText: {
      type: String,
      default: "Request Quote",
      trim: true,
    },
    status: {
      type: String,
      default: "Active",
      enum: ["Active", "Inactive"],
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

ServiceSchema.index({ categoryName: 1 });
ServiceSchema.index({ status: 1 });

export const Service: Model<IService> =
  mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);

export default Service;
