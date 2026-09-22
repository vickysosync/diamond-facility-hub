import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPortfolioProject extends Document {
  title: string;
  slug: string;
  category: string;
  client: string;
  location: string;
  serviceType: string;
  year: string;
  description: string;
  status: "Completed" | "Ongoing";
  image?: {
    secure_url: string;
    public_id: string;
  } | string;
  gallery?: Array<{
    secure_url: string;
    public_id: string;
  } | string>;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const PortfolioProjectSchema = new Schema<IPortfolioProject>(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      trim: true,
      unique: true,
      lowercase: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    client: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    serviceType: {
      type: String,
      trim: true,
    },
    year: {
      type: String,
      default: "2026",
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
    },
    status: {
      type: String,
      default: "Completed",
      enum: ["Completed", "Ongoing"],
    },
    image: {
      type: Schema.Types.Mixed,
      default: "/images/hero.jpg",
    },
    gallery: {
      type: [Schema.Types.Mixed],
      default: [],
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

PortfolioProjectSchema.index({ slug: 1 });
PortfolioProjectSchema.index({ category: 1 });
PortfolioProjectSchema.index({ status: 1 });

export const PortfolioProject: Model<IPortfolioProject> =
  mongoose.models.PortfolioProject ||
  mongoose.model<IPortfolioProject>("PortfolioProject", PortfolioProjectSchema);

export default PortfolioProject;
