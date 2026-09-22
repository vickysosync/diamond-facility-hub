import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWebsiteContent extends Document {
  heroHeading: string;
  heroSubtitle: string;
  heroHighlightedWord: string;
  heroBadge: string;
  aboutHeading: string;
  aboutDescription: string;
  aboutHighlights: Array<{ value: string; label: string }>;
  whyChooseUs: Array<{ title: string; text: string; icon: string }>;
  ctaHeading: string;
  ctaText: string;
  footerText: string;
  createdAt: Date;
  updatedAt: Date;
}

const WebsiteContentSchema = new Schema<IWebsiteContent>(
  {
    heroHeading: {
      type: String,
      default: "Complete Facility Services.",
    },
    heroHighlightedWord: {
      type: String,
      default: "One Trusted Partner.",
    },
    heroSubtitle: {
      type: String,
      default:
        "Reliable security, housekeeping, property management, pest control, manpower, tank cleaning, gardening & landscaping, CCTV, and technical maintenance solutions across Pune.",
    },
    heroBadge: {
      type: String,
      default: "Professional • Reliable • Responsive",
    },
    aboutHeading: {
      type: String,
      default: "Integrated Facility Services Built Around Your Needs",
    },
    aboutDescription: {
      type: String,
      default:
        "Diamond Integrated Facility Services LLP delivers comprehensive security, housekeeping, pest control, water tank cleaning, CCTV, gardening, electrical, plumbing, painting, and maintenance services for residential, commercial, industrial and institutional facilities through a single accountable service partner.",
    },
    aboutHighlights: {
      type: [
        {
          value: String,
          label: String,
        },
      ],
      default: [
        { value: "11", label: "Core Services" },
        { value: "10+", label: "Industries Served" },
        { value: "Pune", label: "Headquarters & Operations" },
      ],
    },
    whyChooseUs: {
      type: [
        {
          title: String,
          text: String,
          icon: String,
        },
      ],
      default: [],
    },
    ctaHeading: {
      type: String,
      default: "Looking for a Reliable Facility Services Partner?",
    },
    ctaText: {
      type: String,
      default:
        "Tell us about your facility requirements and get a customized service estimate within minutes.",
    },
    footerText: {
      type: String,
      default:
        "Integrated facility management and property support services for B2B clients across Pune and Pimpri-Chinchwad, backed by trained personnel, safety-first operations and flexible service packages.",
    },
  },
  {
    timestamps: true,
  }
);

export const WebsiteContent: Model<IWebsiteContent> =
  mongoose.models.WebsiteContent ||
  mongoose.model<IWebsiteContent>("WebsiteContent", WebsiteContentSchema);

export default WebsiteContent;
