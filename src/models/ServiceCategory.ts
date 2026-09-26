import mongoose, { Schema, Document, Model } from "mongoose";

export interface IServiceCategory extends Document {
  name: string;
  slug: string;
  categoryNumber?: string;
  shortDescription?: string;
  description?: string;
  icon?: string;
  image?: {
    secure_url: string;
    public_id: string;
  } | string;
  features: string[];
  startingPrice?: number;
  priceNote?: string;
  pricingType?: string;
  status: "Active" | "Inactive";
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceCategorySchema = new Schema<IServiceCategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      trim: true,
      unique: true,
      lowercase: true,
    },
    categoryNumber: {
      type: String,
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
    icon: {
      type: String,
      default: "shield",
      trim: true,
    },
    image: {
      type: Schema.Types.Mixed,
      default: "/images/hero.jpg",
    },
    features: {
      type: [String],
      default: [],
    },
    startingPrice: {
      type: Number,
      default: 0,
    },
    priceNote: {
      type: String,
      default: "Custom Quote Available",
      trim: true,
    },
    pricingType: {
      type: String,
      default: "Custom Quote",
      enum: ["Fixed", "Per Sq.Ft", "Per Visit", "Monthly", "Annual Contract", "Custom Quote"],
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

ServiceCategorySchema.index({ sortOrder: 1 });

export const ServiceCategory: Model<IServiceCategory> =
  mongoose.models.ServiceCategory ||
  mongoose.model<IServiceCategory>("ServiceCategory", ServiceCategorySchema);

export default ServiceCategory;
