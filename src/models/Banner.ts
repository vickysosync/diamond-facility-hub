import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBanner extends Document {
  title: string;
  highlightedTitle?: string;
  badge?: string;
  subtitle?: string;
  description?: string;
  image?: {
    secure_url: string;
    public_id: string;
  } | string;
  placement?: string;
  serviceCategory?: string;
  ctaText?: string;
  ctaLink?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
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
    highlightedTitle: {
      type: String,
      trim: true,
      default: "",
    },
    badge: {
      type: String,
      trim: true,
      default: "",
    },
    subtitle: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
      type: Schema.Types.Mixed,
      default: "/images/hero.jpg",
    },
    placement: {
      type: String,
      default: "home_hero",
      trim: true,
    },
    serviceCategory: {
      type: String,
      trim: true,
      default: "",
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
    primaryCtaText: {
      type: String,
      default: "Get Free Instant Quote",
      trim: true,
    },
    primaryCtaLink: {
      type: String,
      default: "/pricing-estimator",
      trim: true,
    },
    secondaryCtaText: {
      type: String,
      default: "Explore Services",
      trim: true,
    },
    secondaryCtaLink: {
      type: String,
      default: "/services",
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

BannerSchema.index({ placement: 1, status: 1 });
BannerSchema.index({ sortOrder: 1 });

export const Banner: Model<IBanner> =
  mongoose.models.Banner || mongoose.model<IBanner>("Banner", BannerSchema);

export default Banner;
