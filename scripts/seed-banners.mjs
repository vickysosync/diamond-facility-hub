import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://dhoni07bdhdb_db_user:sNCeMWUOEr0hUbQS@cluster0.yoydddn.mongodb.net/?appName=Cluster0";
const MONGODB_DB_NAME = "diamond_facility";

const BannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    highlightedTitle: { type: String },
    badge: { type: String },
    description: { type: String },
    image: { type: mongoose.Schema.Types.Mixed },
    imageUrl: { type: String },
    link: { type: String },
    ctaText: { type: String },
    primaryCtaText: { type: String },
    primaryCtaLink: { type: String },
    secondaryCtaText: { type: String },
    secondaryCtaLink: { type: String },
    placement: {
      type: String,
      default: "home_hero",
    },
    serviceCategory: { type: String },
    sortOrder: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true }
);

const Banner = mongoose.models.Banner || mongoose.model("Banner", BannerSchema);

const banners = [
  // 5 Homepage Hero Slides
  {
    title: "Complete Facility Services.",
    highlightedTitle: "One Trusted Partner.",
    badge: "24/7 Manned Security • Police-Verified • 100% Compliant",
    description:
      "Official provider of Security Guarding, Housekeeping, Property Management, Pest Eradication, Tank Sanitization, Manpower, CCTV and Technical Civil Upkeep across Pune & PCMC.",
    image: "/images/hero/slide-security.webp",
    imageUrl: "/images/hero/slide-security.webp",
    placement: "home_hero",
    serviceCategory: "Security Guard Services",
    primaryCtaText: "Get Free Instant Quote",
    primaryCtaLink: "/contact",
    secondaryCtaText: "Explore All Services",
    secondaryCtaLink: "/services",
    sortOrder: 1,
    status: "Active",
  },
  {
    title: "Impeccable Facility Cleanliness.",
    highlightedTitle: "Zero Compromise.",
    badge: "Mechanized Housekeeping • Hygiene Standards • Eco-Safe",
    description:
      "Supervisor-monitored corporate housekeeping, daily office cleaning, mechanized floor scrubbing, and hospital-grade deep sanitization for IT parks and societies.",
    image: "/images/hero/slide-housekeeping.webp",
    imageUrl: "/images/hero/slide-housekeeping.webp",
    placement: "home_hero",
    serviceCategory: "Housekeeping Services",
    primaryCtaText: "Book Housekeeping Audit",
    primaryCtaLink: "/contact",
    secondaryCtaText: "View Housekeeping Scope",
    secondaryCtaLink: "/services/housekeeping-services",
    sortOrder: 2,
    status: "Active",
  },
  {
    title: "Seamless Property Operations.",
    highlightedTitle: "Built Around Your Campus.",
    badge: "Single Accountable Partner • B2B & Institutional • SLA-Backed",
    description:
      "End-to-end facility operations, multi-vendor coordination, residential society administration, and routine technical condition reporting.",
    image: "/images/hero/slide-facility.webp",
    imageUrl: "/images/hero/slide-facility.webp",
    placement: "home_hero",
    serviceCategory: "Facility Management Solutions",
    primaryCtaText: "Request Facility Proposal",
    primaryCtaLink: "/contact",
    secondaryCtaText: "Explore Property Scope",
    secondaryCtaLink: "/services/property-management",
    sortOrder: 3,
    status: "Active",
  },
  {
    title: "Certified Water Tank Cleaning.",
    highlightedTitle: "Pure Hygiene & Green Care.",
    badge: "High-Pressure De-Silting • Antibacterial Sanitization",
    description:
      "6-stage mechanized cleaning for overhead and underground water storage tanks, accompanied by structured garden upkeep and landscape preservation.",
    image: "/images/hero/slide-tank.webp",
    imageUrl: "/images/hero/slide-tank.webp",
    placement: "home_hero",
    serviceCategory: "Tank Cleaning, Gardening and Landscaping etc.",
    primaryCtaText: "Schedule Tank Cleaning",
    primaryCtaLink: "/contact",
    secondaryCtaText: "See Sanitization Process",
    secondaryCtaLink: "/services/tank-cleaning-gardening-landscaping",
    sortOrder: 4,
    status: "Active",
  },
  {
    title: "Advanced CCTV & Civil Upkeep.",
    highlightedTitle: "Always Protected.",
    badge: "HD/IP Surveillance • 24/7 Control Room • Licensed Technicians",
    description:
      "Turnkey HD surveillance installation, round-the-clock control room monitoring, certified electrical, plumbing, painting, and terrace waterproofing.",
    image: "/images/hero/slide-cctv.webp",
    imageUrl: "/images/hero/slide-cctv.webp",
    placement: "home_hero",
    serviceCategory: "CCTV Installation and Maintenance",
    primaryCtaText: "Get Technical Estimate",
    primaryCtaLink: "/contact",
    secondaryCtaText: "View Technical Services",
    secondaryCtaLink: "/services/cctv-installation-maintenance",
    sortOrder: 5,
    status: "Active",
  },

  // 5 Inner Page Headers
  {
    title: "Integrated Facility Services Built Around Your Needs",
    highlightedTitle: "Facility Services",
    badge: "About Diamond Integrated Services",
    description:
      "Integrated facility management and commercial property support services across Pune and PCMC, backed by verified personnel, statutory compliance and flexible service packages.",
    image: "/images/headers/about-header.webp",
    imageUrl: "/images/headers/about-header.webp",
    placement: "page_about",
    primaryCtaText: "Request Service Proposal",
    primaryCtaLink: "/contact",
    secondaryCtaText: "Explore Services",
    secondaryCtaLink: "/services",
    sortOrder: 1,
    status: "Active",
  },
  {
    title: "Comprehensive Facility Management Solutions",
    highlightedTitle: "Facility Management Solutions",
    badge: "Integrated Service Divisions",
    description:
      "From armed security & mechanized housekeeping to waterproofing, plumbing, CCTV surveillance and complete facility maintenance contracts — single-point accountability for Pune & PCMC.",
    image: "/images/headers/services-header.webp",
    imageUrl: "/images/headers/services-header.webp",
    placement: "page_services",
    primaryCtaText: "Instant Cost Estimator",
    primaryCtaLink: "/pricing-estimator",
    secondaryCtaText: "Request Custom Proposal",
    secondaryCtaLink: "/contact",
    sortOrder: 2,
    status: "Active",
  },
  {
    title: "Tailored Facility Support for Every Type of Property",
    highlightedTitle: "Every Type of Property",
    badge: "Specialized Sector Coverage",
    description:
      "Each sector operates under unique access protocols, hygiene mandates, and shift cycles. Our operational plans are custom-engineered for how your facility actually functions across Pune & PCMC.",
    image: "/images/headers/industries-header.webp",
    imageUrl: "/images/headers/industries-header.webp",
    placement: "page_industries",
    primaryCtaText: "Request Custom Scope",
    primaryCtaLink: "/contact",
    secondaryCtaText: "Explore Case Studies",
    secondaryCtaLink: "/portfolio",
    sortOrder: 3,
    status: "Active",
  },
  {
    title: "Facility Operations Delivered Across Pune & Maharashtra",
    highlightedTitle: "Facility Operations Delivered",
    badge: "Proven Deployments & Track Record",
    description:
      "Explore our verified facility management contracts, security deployments, mechanized cleaning turnarounds, and preventative upkeep case studies.",
    image: "/images/headers/portfolio-header.webp",
    imageUrl: "/images/headers/portfolio-header.webp",
    placement: "page_portfolio",
    primaryCtaText: "Discuss Your Facility",
    primaryCtaLink: "/contact",
    secondaryCtaText: "View Field Gallery",
    secondaryCtaLink: "/gallery",
    sortOrder: 4,
    status: "Active",
  },
  {
    title: "Field Operations & Service Delivery Gallery",
    highlightedTitle: "Service Delivery Gallery",
    badge: "Visual Field Documentation",
    description:
      "Explore high-resolution visual documentation of our on-site security deployments, mechanized cleaning, water tank sanitization, civil painting, and integrated facility operations across Pune & PCMC.",
    image: "/images/headers/gallery-header.webp",
    imageUrl: "/images/headers/gallery-header.webp",
    placement: "page_gallery",
    primaryCtaText: "Request Site Audit",
    primaryCtaLink: "/contact",
    secondaryCtaText: "Explore Case Studies",
    secondaryCtaLink: "/portfolio",
    sortOrder: 5,
    status: "Active",
  },
];

async function run() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB_NAME });
    console.log("Connected successfully.");

    // Delete existing old banners and replace with official structured banners
    await Banner.deleteMany({});
    console.log("Cleared existing banners.");

    const inserted = await Banner.insertMany(banners);
    console.log(`Successfully seeded ${inserted.length} banners:`);
    inserted.forEach((b) => console.log(`- [${b.placement}] ${b.title}`));

    await mongoose.disconnect();
    console.log("Done!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding banners:", err);
    process.exit(1);
  }
}

run();
