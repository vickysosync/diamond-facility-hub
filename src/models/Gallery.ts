import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGallery extends Document {
  title: string;
  description?: string;
  image: string;
  category: string;
  altText?: string;
  sortOrder: number;
  status: "Active" | "Inactive";
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema = new Schema<IGallery>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      default: "General",
      trim: true,
    },
    altText: {
      type: String,
      default: "",
      trim: true,
    },
    sortOrder: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

GallerySchema.index({ status: 1 });
GallerySchema.index({ category: 1 });
GallerySchema.index({ sortOrder: 1 });
GallerySchema.index({ createdAt: -1 });

export const Gallery: Model<IGallery> =
  mongoose.models.Gallery || mongoose.model<IGallery>("Gallery", GallerySchema);

export default Gallery;
