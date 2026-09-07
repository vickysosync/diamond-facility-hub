import security from "@/assets/security.jpg";
import pest from "@/assets/pest.jpg";
import tank from "@/assets/tank.jpg";
import painting from "@/assets/painting.jpg";
import facility from "@/assets/facility.jpg";

export const images = { security, pest, tank, painting, facility };

export const companyInfo = {
  name: "Diamond Integrated Facility Services LLP",
  shortName: "DIAMOND",
  tagline: "Integrated Facility Services LLP",
  address:
    "Sno 66 Sai Pritam, Nagaribl A Sh 4 Rahatni, Kalewadi, Pune City, Pune, Maharashtra, India, 411017",
  phone: "6598522321",
  email: "dimondinfra21@gmail.com",
  city: "Pune, Maharashtra",
  about:
    "Diamond Integrated Facility Services LLP delivers security, pest control, water tank cleaning and painting services for residential, commercial, industrial and institutional facilities through a single accountable service partner.",
  businessDescription:
    "Integrated facility management and property support services for B2B clients across Pune and Pimpri-Chinchwad, backed by trained personnel, safety-first operations and flexible service packages.",
  businessHours: [
    { day: "Monday – Saturday", hours: "9:00 AM – 6:00 PM" },
    { day: "Sunday", hours: "Closed" },
  ],
};

export const services = [
  {
    id: "security",
    slug: "security",
    name: "Security Services",
    category: "Security",
    icon: "shield",
    image: security,
    status: "Active",
    startingPrice: 18000,
    priceNote: "per deployment / month",
    short:
      "Trained security personnel, access control and monitoring support for commercial, residential and industrial premises.",
    description:
      "Deploy screened and trained security personnel supported by structured shift planning, entry-exit discipline and visitor records. Our supervisors coordinate directly with your facility team so accountability is never unclear.",
    cta: "Request Security Quote",
    features: [
      "Security Guard Deployment",
      "Commercial Security",
      "Residential Society Security",
      "Industrial Security",
      "Entry & Exit Management",
      "Visitor Management",
      "Security Monitoring Support",
    ],
  },
  {
    id: "pest",
    slug: "pest-control",
    name: "Pest Control",
    category: "Pest Control",
    icon: "bug",
    image: pest,
    status: "Active",
    startingPrice: 2500,
    priceNote: "per treatment",
    short:
      "Targeted treatment and preventive pest management programmes for offices, societies, kitchens and warehouses.",
    description:
      "Site-specific pest management using controlled application methods, low-disruption scheduling and documented service reports for every visit — suitable for occupied offices and food-handling areas.",
    cta: "Request Pest Control Quote",
    features: [
      "Commercial Pest Control",
      "Residential Pest Control",
      "Cockroach Control",
      "Rodent Control",
      "Termite Treatment",
      "Preventive Pest Management",
    ],
  },
  {
    id: "tank",
    slug: "tank-cleaning",
    name: "Water Tank Cleaning",
    category: "Tank Cleaning",
    icon: "droplet",
    image: tank,
    status: "Active",
    startingPrice: 1800,
    priceNote: "per tank",
    short:
      "Mechanised, hygiene-focused cleaning of overhead, underground and sectional water storage tanks.",
    description:
      "De-silting, high-pressure washing, vacuum extraction and sanitisation carried out by trained crews with confined-space precautions, followed by a completion report for your records.",
    cta: "Request Tank Cleaning Quote",
    features: [
      "Residential Tank Cleaning",
      "Commercial Tank Cleaning",
      "Underground Tank Cleaning",
      "Overhead Tank Cleaning",
      "Scheduled Cleaning",
      "Hygiene-focused Cleaning",
    ],
  },
  {
    id: "painting",
    slug: "painting",
    name: "Painting Services",
    category: "Painting",
    icon: "roller",
    image: painting,
    status: "Active",
    startingPrice: 12000,
    priceNote: "per project",
    short:
      "Interior, exterior and maintenance painting executed with minimal disruption to working facilities.",
    description:
      "Surface preparation, priming and finishing for offices, societies and industrial premises — planned around your occupancy hours with proper masking, protection and site clean-up.",
    cta: "Request Painting Quote",
    features: [
      "Interior Painting",
      "Exterior Painting",
      "Commercial Painting",
      "Residential Painting",
      "Office Painting",
      "Maintenance Painting",
    ],
  },
];

export const pricingRules = [
  {
    id: "security",
    name: "Security",
    base: 15000,
    perSqft: 0.8,
    minCharge: 15000,
    status: "Active",
  },
  { id: "pest", name: "Pest Control", base: 2500, perSqft: 0.4, minCharge: 2500, status: "Active" },
  { id: "tank", name: "Tank Cleaning", base: 1500, perSqft: 0.24, minCharge: 1800, status: "Active" },
  { id: "painting", name: "Painting", base: 5000, perSqft: 0.6, minCharge: 8000, status: "Active" },
];

export const frequencies = [
  { id: "one-time", label: "One Time", multiplier: 1 },
  { id: "monthly", label: "Monthly", multiplier: 0.95 },
  { id: "quarterly", label: "Quarterly", multiplier: 0.9 },
  { id: "half-yearly", label: "Half-Yearly", multiplier: 0.86 },
  { id: "annual", label: "Annual Contract", multiplier: 0.82 },
];

export const sizePresets = [
  { label: "Small", value: 2500 },
  { label: "Medium", value: 15000 },
  { label: "Large", value: 45000 },
  { label: "Enterprise", value: 90000 },
];

export const industries = [
  { id: 1, name: "Corporate Offices", icon: "building", description: "Front-desk security, housekeeping support and scheduled maintenance for office campuses." },
  { id: 2, name: "Residential Societies", icon: "home", description: "Gate management, society pest control and periodic tank cleaning contracts." },
  { id: 3, name: "Commercial Buildings", icon: "store", description: "Multi-tenant facility coordination with common-area upkeep and access control." },
  { id: 4, name: "Industrial Facilities", icon: "factory", description: "Shift-based industrial security and plant maintenance painting programmes." },
  { id: 5, name: "Warehouses", icon: "box", description: "Perimeter security, rodent control and large-area maintenance support." },
  { id: 6, name: "Schools & Institutions", icon: "school", description: "Safe-campus security cover and hygiene-critical tank cleaning schedules." },
  { id: 7, name: "Hospitals & Healthcare", icon: "cross", description: "Hygiene-first pest management and disciplined visitor control." },
  { id: 8, name: "Retail Spaces", icon: "cart", description: "Customer-facing guards and after-hours cleaning and painting works." },
  { id: 9, name: "Hospitality", icon: "bed", description: "Guest-area presentation, preventive pest cover and water hygiene." },
  { id: 10, name: "Construction & Property Sites", icon: "cone", description: "Site security deployment and handover painting for new properties." },
];

export const portfolio = [
  { id: 1, title: "Corporate Office Security Management", category: "Security", client: "IT Services Company", location: "Hinjawadi, Pune", serviceType: "Security Guard Deployment", year: "2025", status: "Completed", image: security, description: "Round-the-clock manned guarding with entry-exit registers and visitor management across a 3-floor corporate office." },
  { id: 2, title: "Residential Society Pest Control", category: "Pest Control", client: "Residential Society", location: "Rahatni, Pune", serviceType: "Preventive Pest Management", year: "2025", status: "Ongoing", image: pest, description: "Quarterly cockroach and rodent management across 168 flats, clubhouse and basement parking areas." },
  { id: 3, title: "Commercial Water Tank Cleaning", category: "Tank Cleaning", client: "Business Park", location: "Kalewadi, Pune", serviceType: "Overhead & Underground Cleaning", year: "2024", status: "Completed", image: tank, description: "Mechanised cleaning and sanitisation of 6 storage tanks with pre and post service documentation." },
  { id: 4, title: "Office Interior Painting", category: "Painting", client: "Consulting Firm", location: "Baner, Pune", serviceType: "Interior Painting", year: "2025", status: "Completed", image: painting, description: "Weekend-phased interior repainting of 9,000 sq.ft workspace with zero working-day disruption." },
  { id: 5, title: "Industrial Facility Security", category: "Security", client: "Manufacturing Unit", location: "Chakan, Pune", serviceType: "Industrial Security", year: "2024", status: "Ongoing", image: facility, description: "Three-shift gate and material-movement security with supervisor-led daily reporting." },
  { id: 6, title: "Warehouse Maintenance Support", category: "Facility Management", client: "Logistics Operator", location: "Talegaon, Pune", serviceType: "Integrated Facility Support", year: "2025", status: "Ongoing", image: facility, description: "Combined security, rodent control and periodic maintenance under a single service contract." },
  { id: 7, title: "Residential Complex Painting", category: "Painting", client: "Housing Society", location: "Pimpri, Pune", serviceType: "Exterior Painting", year: "2024", status: "Completed", image: painting, description: "External repainting of four towers including surface repair and waterproof coating." },
  { id: 8, title: "Commercial Property Facility Support", category: "Facility Management", client: "Retail Property", location: "Wakad, Pune", serviceType: "Integrated Facility Services", year: "2026", status: "In Progress", image: facility, description: "Day-and-night facility cover combining guarding, hygiene services and scheduled upkeep." },
];

export const testimonials = [
  { id: 1, name: "Rohit Deshmukh", company: "Vertex Business Park", industry: "Commercial Property", rating: 5, status: "Published", review: "Diamond provided a professional and responsive facility service experience. Their team understood our requirements and coordinated the work efficiently." },
  { id: 2, name: "Sneha Kulkarni", company: "Sai Pritam Residency", industry: "Residential Society", rating: 5, status: "Published", review: "Pest control and tank cleaning are now handled on a fixed schedule. Residents get prior notice and the reporting after each visit is clear." },
  { id: 3, name: "Amit Rane", company: "Nexa Manufacturing", industry: "Industrial", rating: 4, status: "Published", review: "Guard deployment was arranged quickly and their supervisors stay in touch. Shift discipline has been consistent since day one." },
  { id: 4, name: "Priya Menon", company: "Brightpath Institute", industry: "Education", rating: 5, status: "Published", review: "Having security, cleaning and painting under one partner removed a lot of coordination work for our admin team." },
];

export const quoteRequests = [
  { id: "QR-1041", company: "Vertex Business Park", contact: "Rohit Deshmukh", phone: "9822012345", email: "rohit@vertexpark.in", services: ["Security", "Tank Cleaning"], facilitySize: 45000, estimatedCost: 62400, date: "2026-08-28", status: "New" },
  { id: "QR-1040", company: "Nexa Manufacturing", contact: "Amit Rane", phone: "9765432109", email: "amit@nexamfg.in", services: ["Security"], facilitySize: 90000, estimatedCost: 87000, date: "2026-08-24", status: "Contacted" },
  { id: "QR-1039", company: "Sai Pritam Residency", contact: "Sneha Kulkarni", phone: "9890011223", email: "sneha@saipritam.org", services: ["Pest Control", "Tank Cleaning"], facilitySize: 25000, estimatedCost: 18700, date: "2026-08-19", status: "Quoted" },
  { id: "QR-1038", company: "Brightpath Institute", contact: "Priya Menon", phone: "9011223344", email: "priya@brightpath.edu.in", services: ["Painting", "Pest Control"], facilitySize: 15000, estimatedCost: 27500, date: "2026-08-12", status: "Converted" },
  { id: "QR-1037", company: "Urban Retail Hub", contact: "Kunal Shah", phone: "9922334455", email: "kunal@urbanretail.in", services: ["Security", "Painting"], facilitySize: 8000, estimatedCost: 33600, date: "2026-08-05", status: "Closed" },
];

export const contactMessages = [
  { id: "CM-318", name: "Anita Joshi", company: "Greenfield Society", email: "anita@greenfield.in", phone: "9823456781", service: "Tank Cleaning", message: "We need quarterly cleaning for 3 overhead tanks. Please share a schedule and rates.", date: "2026-08-29", status: "New" },
  { id: "CM-317", name: "Vikram Patil", company: "Patil Warehousing", email: "vikram@patilware.in", phone: "9765001122", service: "Security", message: "Looking for 4 guards on a two-shift pattern starting next month.", date: "2026-08-26", status: "Read" },
  { id: "CM-316", name: "Meera Nair", company: "Cura Clinic", email: "meera@curaclinic.in", phone: "9700112233", service: "Pest Control", message: "Need a hygiene-safe pest programme for a clinic with evening OPD hours.", date: "2026-08-21", status: "Replied" },
  { id: "CM-315", name: "Sameer Kale", company: "Kale Interiors", email: "sameer@kaleint.in", phone: "9011667788", service: "Painting", message: "Interior repainting for a 6,000 sq.ft office. Site visit possible this week?", date: "2026-08-14", status: "Closed" },
];

export const whyChooseUs = [
  { title: "Reliable Workforce", text: "Professional personnel for recurring and one-time facility requirements.", icon: "users" },
  { title: "Integrated Services", text: "Multiple facility services managed through one service partner.", icon: "layers" },
  { title: "Flexible Packages", text: "Solutions can be customized according to facility size and requirements.", icon: "sliders" },
  { title: "Safety First", text: "Operations designed around safety, hygiene and responsible service practices.", icon: "shield" },
  { title: "Responsive Support", text: "Clear communication and service coordination.", icon: "headset" },
  { title: "B2B Focus", text: "Solutions designed for commercial and institutional requirements.", icon: "briefcase" },
];

export const processSteps = [
  { no: "01", title: "Tell Us Your Requirement", text: "Share your facility type, size and the services you need cover for." },
  { no: "02", title: "Site & Requirement Assessment", text: "Our coordinator reviews the site, scope and access conditions." },
  { no: "03", title: "Customized Service Plan", text: "You receive a written scope, deployment plan and transparent pricing." },
  { no: "04", title: "Service Execution & Support", text: "Trained teams execute on schedule with supervision and reporting." },
];

export const facilityTypes = [
  "Corporate Office",
  "Residential Society",
  "Commercial Building",
  "Industrial Facility",
  "Warehouse",
  "School / Institution",
  "Hospital / Healthcare",
  "Retail Space",
  "Hospitality",
  "Construction Site",
];

export const portfolioCategories = [
  "All",
  "Security",
  "Pest Control",
  "Tank Cleaning",
  "Painting",
  "Facility Management",
];

export const formatINR = (value) =>
  "₹" + Math.round(value).toLocaleString("en-IN", { maximumFractionDigits: 0 });
