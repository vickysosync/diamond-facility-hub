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
    youtube?: string;
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
      default: "Excellence in Every Service.",
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
        "Diamond Integrated Facility Services LLP is a professional facility management company committed to delivering reliable, efficient, and high-quality integrated facility solutions to Businesses, Commercial Establishments, Residential Communities, Industrial Facilities, Healthcare and Educational Institutes.",
      trim: true,
    },
    businessDescription: {
      type: String,
      default:
        "Delivering reliable, efficient, and high-quality integrated facility solutions across India, guided by our commitment: Your Facility, Our Responsibility & Your Satisfaction, Our Priority.",
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
      youtube: { type: String, default: "" },
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
