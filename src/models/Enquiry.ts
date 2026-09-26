import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEnquiry extends Document {
  enquiryId: string;
  name: string;
  company?: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  status: "New" | "Read" | "Contacted" | "Replied" | "Closed";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    enquiryId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    company: {
      type: String,
      default: "",
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      trim: true,
      lowercase: true,
    },
    service: {
      type: String,
      required: [true, "Service is required"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },
    status: {
      type: String,
      default: "New",
      enum: ["New", "Read", "Contacted", "Replied", "Closed"],
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

EnquirySchema.index({ status: 1 });
EnquirySchema.index({ createdAt: -1 });

export const Enquiry: Model<IEnquiry> =
  mongoose.models.Enquiry || mongoose.model<IEnquiry>("Enquiry", EnquirySchema);

export default Enquiry;
