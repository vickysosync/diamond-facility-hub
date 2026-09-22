import mongoose, { Schema, Document, Model } from "mongoose";

export interface IIndustry extends Document {
  name: string;
  slug: string;
  description: string;
  icon: string;
  image?: {
    secure_url: string;
    public_id: string;
  } | string;
  services: mongoose.Types.ObjectId[];
  serviceNames: string[];
  status: "Active" | "Inactive";
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const IndustrySchema = new Schema<IIndustry>(
  {
    name: {
      type: String,
      required: [true, "Industry name is required"],
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
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    icon: {
      type: String,
      default: "building",
      trim: true,
    },
    image: {
      type: Schema.Types.Mixed,
      default: "/images/facility.jpg",
    },
    services: [
      {
        type: Schema.Types.ObjectId,
        ref: "ServiceCategory",
      },
    ],
    serviceNames: {
      type: [String],
      default: [],
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

IndustrySchema.index({ slug: 1 });
IndustrySchema.index({ status: 1 });

export const Industry: Model<IIndustry> =
  mongoose.models.Industry || mongoose.model<IIndustry>("Industry", IndustrySchema);

export default Industry;
