import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITestimonial extends Document {
  name: string;
  company: string;
  industry: string;
  review: string;
  rating: number;
  image?: string;
  status: "Approved" | "Pending" | "Rejected";
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
      required: [true, "Company name is required"],
      trim: true,
    },
    industry: {
      type: String,
      default: "Commercial",
      trim: true,
    },
    review: {
      type: String,
      required: [true, "Review text is required"],
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
    status: {
      type: String,
      default: "Approved",
      enum: ["Approved", "Pending", "Rejected"],
    },
  },
  {
    timestamps: true,
  }
);

TestimonialSchema.index({ status: 1 });

export const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial ||
  mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);

export default Testimonial;
