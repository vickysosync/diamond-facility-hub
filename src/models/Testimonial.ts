import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITestimonial extends Document {
  name: string;
  company: string;
  role?: string;
  industry: string;
  review: string;
  content?: string;
  rating: number;
  image?: string;
  avatar?: string;
  status: "Approved" | "Pending" | "Rejected";
  featured?: boolean;
  sortOrder?: number;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
    },
    company: {
      type: String,
      default: "Client",
      trim: true,
    },
    role: {
      type: String,
      default: "Facility Client",
      trim: true,
    },
    industry: {
      type: String,
      default: "Commercial",
      trim: true,
    },
    review: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
    image: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      default: "Approved",
      enum: ["Approved", "Pending", "Rejected"],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    sortOrder: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

TestimonialSchema.index({ status: 1 });

export const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial ||
  mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);

export default Testimonial;
