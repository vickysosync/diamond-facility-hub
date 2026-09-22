import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICompanySettings extends Document {
  name: string;
  shortName: string;
  tagline: string;
  director: string;
  partners: string[];
  website: string;
  email: string;
  landline: string;
  mobileNumbers: string[];
  primaryPhone: string;
  address: string;
  city: string;
  pincode: string;
  about: string;
  businessDescription: string;
  businessHours: Array<{ day: string; hours: string }>;
  logo?: string;
  socialLinks?: {
    facebook?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const CompanySettingsSchema = new Schema<ICompanySettings>(
  {
    name: {
      type: String,
      default: "Diamond Integrated Facility Services LLP",
      trim: true,
    },
    shortName: {
      type: String,
      default: "DIAMOND",
      trim: true,
    },
    tagline: {
      type: String,
      default: "Integrated Facility Services LLP",
      trim: true,
    },
    director: {
      type: String,
      default: "UMESH PATIL",
      trim: true,
    },
    partners: {
      type: [String],
      default: ["UMESH PRATAP PATIL", "KAVITA UMESH PATIL"],
    },
    website: {
      type: String,
      default: "https://diamondifs.com",
      trim: true,
    },
    email: {
      type: String,
      default: "info@diamondifs.com",
      trim: true,
    },
    landline: {
      type: String,
      default: "020 45355544",
      trim: true,
    },
    mobileNumbers: {
      type: [String],
      default: ["+91 9689515295", "+91 9970046704"],
    },
    primaryPhone: {
      type: String,
      default: "+91 9689515295",
      trim: true,
    },
    address: {
      type: String,
      default:
        "Office No-A2, Sai Pritam Nagari, Chhatrapati Chowk, Rahatani-Kalewadi Link Road, Rahatani, Pune, Maharashtra, India - 411017",
      trim: true,
    },
    city: {
      type: String,
      default: "Pune, Maharashtra",
      trim: true,
    },
    pincode: {
      type: String,
      default: "411017",
      trim: true,
    },
    about: {
      type: String,
      default:
        "Diamond Integrated Facility Services LLP delivers security, housekeeping, property management, pest control, bouncer security, manpower supply, tank cleaning, gardening & landscaping, facility management, CCTV installation & maintenance, plumbing, electrical, painting, waterproofing, and repair & maintenance services for residential, commercial, industrial and institutional facilities through a single accountable service partner.",
      trim: true,
    },
    businessDescription: {
      type: String,
      default:
        "Integrated facility management and property support services for B2B clients across Pune and Pimpri-Chinchwad, backed by trained personnel, safety-first operations and flexible service packages.",
      trim: true,
    },
    businessHours: {
      type: [
        {
          day: String,
          hours: String,
        },
      ],
      default: [
        { day: "Monday – Saturday", hours: "9:00 AM – 6:00 PM" },
        { day: "Sunday", hours: "Emergency Support Only" },
      ],
    },
    logo: {
      type: String,
      default: "/images/logo.png",
    },
    socialLinks: {
      facebook: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
      instagram: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
  }
);

export const CompanySettings: Model<ICompanySettings> =
  mongoose.models.CompanySettings ||
  mongoose.model<ICompanySettings>("CompanySettings", CompanySettingsSchema);

export default CompanySettings;
