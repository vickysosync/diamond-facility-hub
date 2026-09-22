import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBanner extends Document {
  title: string;
  subtitle?: string;
  description?: string;
  image?: {
    secure_url: string;
    public_id: string;
  } | string;
  ctaText?: string;
  ctaLink?: string;
  status: "Active" | "Inactive";
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema = new Schema<IBanner>(
  {
    title: {
      type: String,
      required: [true, "Banner title is required"],
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: Schema.Types.Mixed,
      default: "/images/hero.jpg",
    },
    ctaText: {
      type: String,
      default: "Get Free Quote",
      trim: true,
    },
    ctaLink: {
      type: String,
      default: "/pricing-estimator",
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

BannerSchema.index({ status: 1 });
BannerSchema.index({ sortOrder: 1 });

export const Banner: Model<IBanner> =
  mongoose.models.Banner || mongoose.model<IBanner>("Banner", BannerSchema);

export default Banner;
