export const images = {
  security: "/images/security.jpg",
  pest: "/images/pest.jpg",
  tank: "/images/tank.jpg",
  painting: "/images/painting.jpg",
  facility: "/images/facility.jpg",
  hero: "/images/hero.jpg",
};

export interface CompanyInfo {
  name: string;
  shortName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  city: string;
  about: string;
  businessDescription: string;
  businessHours: { day: string; hours: string }[];
}

export const companyInfo: CompanyInfo = {
  name: "Diamond Integrated Facility Services LLP",
  shortName: "DIAMOND",
  tagline: "Integrated Facility Services LLP",
  address:
    "Office No-A2, Sai Pritam Nagari, Chhatrapati Chowk, Rahatani-Kalewadi Link Road, Rahatani, Pune, Maharashtra, India - 411017",
  phone: "+91 9689515295",
  email: "info@diamondifs.com",
  city: "Pune, Maharashtra",
  about:
    "Diamond Integrated Facility Services LLP provides full-spectrum facility management including 24/7 Security Guarding, Housekeeping, Property Management, Pest Control, Bouncer Security, Manpower Supply, Tank Cleaning & Gardening, CCTV Installation & Maintenance, Plumbing, Electrical, Painting, Waterproofing, and Repair & Maintenance Services.",
  businessDescription:
    "Integrated facility management and commercial property support services across Pune and PCMC, headed by Director Umesh Patil, backed by trained personnel, statutory compliance and flexible service packages.",
  businessHours: [
    { day: "Monday – Saturday", hours: "9:00 AM – 6:00 PM" },
    { day: "Sunday", hours: "Emergency Support Only" },
  ],
};

export interface ServiceItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  icon: string;
  image: string;
  status: string;
  startingPrice: number;
  priceNote: string;
  short: string;
  description: string;
  cta: string;
  features: string[];
}

export const services: ServiceItem[] = [
  {
    id: "security-guard-services",
    slug: "security-guard-services",
    name: "Security Guard Services",
    category: "Security Guard Services",
    icon: "shield",
    image: "/images/security.jpg",
    status: "Active",
    startingPrice: 18000,
    priceNote: "per deployment / month",
    short: "Screened and trained security personnel, access control and monitoring support.",
    description: "Deploy screened and trained security personnel supported by structured shift planning, entry-exit discipline and visitor records.",
    cta: "Request Security Quote",
    features: [
      "Security Guard Deployment",
      "Commercial Security",
      "Residential Society Security",
      "Industrial Security",
      "Entry & Exit Management",
      "Visitor Management",
      "Security Monitoring",
    ],
  },
  {
    id: "housekeeping-services",
    slug: "housekeeping-services",
    name: "Housekeeping Services",
    category: "Housekeeping Services",
    icon: "sparkles",
    image: "/images/facility.jpg",
    status: "Active",
    startingPrice: 12000,
    priceNote: "per month / premise",
    short: "Daily, periodic and deep cleaning solutions for offices, societies and commercial spaces.",
    description: "Mechanized cleaning, surface sanitization, and hygiene management carried out by trained housekeeping attendants.",
    cta: "Request Housekeeping Quote",
    features: [
      "Office Housekeeping",
      "Commercial Housekeeping",
      "Society Housekeeping",
      "Common Area Cleaning",
      "Washroom Cleaning",
      "Daily & Deep Cleaning",
    ],
  },
  {
    id: "property-management",
    slug: "property-management",
    name: "Property Management",
    category: "Property Management",
    icon: "building",
    image: "/images/facility.jpg",
    status: "Active",
    startingPrice: 25000,
    priceNote: "per property contract",
    short: "End-to-end property operations, vendor management, and routine maintenance oversight.",
    description: "Complete on-ground property supervision, statutory vendor coordination, and periodic condition reporting.",
    cta: "Request Property Management Quote",
    features: [
      "Property Operations",
      "Society Management Support",
      "Vendor Coordination",
      "Maintenance Oversight",
      "Property Supervision",
    ],
  },
  {
    id: "pest-control-services",
    slug: "pest-control-services",
    name: "Pest Control Services",
    category: "Pest Control Services",
    icon: "bug",
    image: "/images/pest.jpg",
    status: "Active",
    startingPrice: 2500,
    priceNote: "per treatment / site",
    short: "Targeted treatment and preventive pest management programmes for offices, societies and kitchens.",
    description: "Site-specific pest management using controlled application methods, low-disruption scheduling and documented service reports.",
    cta: "Request Pest Control Quote",
    features: [
      "General Pest Control",
      "Cockroach Control",
      "Rodent Control",
      "Termite Treatment",
      "Preventive Pest Management",
    ],
  },
  {
    id: "bouncer-services",
    slug: "bouncer-services",
    name: "Bouncer Services",
    category: "Bouncer Services",
    icon: "users",
    image: "/images/security.jpg",
    status: "Active",
    startingPrice: 3500,
    priceNote: "per bouncer / shift",
    short: "Physically trained bouncers and crowd management teams for corporate events, VIPs and venues.",
    description: "Experienced crowd control officers, entry management personnel, and private security escorts.",
    cta: "Request Bouncer Quote",
    features: [
      "Event Bouncer Services",
      "Venue Security",
      "Crowd Management",
      "Entry Management",
      "VIP Security Support",
    ],
  },
  {
    id: "man-power-supply",
    slug: "man-power-supply",
    name: "Man Power Supply",
    category: "Man Power Supply",
    icon: "briefcase",
    image: "/images/hero.jpg",
    status: "Active",
    startingPrice: 15000,
    priceNote: "per resource / month",
    short: "Skilled, semi-skilled and general support personnel deployment tailored to your facility operations.",
    description: "Verified technical, administrative, and facility support staff provided with statutory compliance.",
    cta: "Request Manpower Quote",
    features: [
      "Skilled Manpower",
      "Semi-Skilled Manpower",
      "General Support Staff",
      "Facility Staff",
      "Maintenance Personnel",
    ],
  },
  {
    id: "tank-cleaning-gardening-landscaping",
    slug: "tank-cleaning-gardening-landscaping",
    name: "Tank Cleaning, Gardening and Landscaping etc.",
    category: "Tank Cleaning, Gardening and Landscaping etc.",
    icon: "droplet",
    image: "/images/tank.jpg",
    status: "Active",
    startingPrice: 1800,
    priceNote: "per tank / site visit",
    short: "Mechanized water tank cleaning, sanitization, garden upkeep, lawn mowing and landscape care.",
    description: "High-pressure water tank de-silting, antibacterial sanitization, structured garden care, lawn trimming and plant upkeep.",
    cta: "Request Tank & Garden Quote",
    features: [
      "Overhead & Underground Tank Cleaning",
      "Mechanized Tank Sanitization",
      "Garden Maintenance",
      "Lawn Trimming & Mowing",
      "Plant Care & Landscaping",
    ],
  },
  {
    id: "facility-management-solutions",
    slug: "facility-management-solutions",
    name: "Facility Management Solutions",
    category: "Facility Management Solutions",
    icon: "layers",
    image: "/images/facility.jpg",
    status: "Active",
    startingPrice: 35000,
    priceNote: "integrated monthly contract",
    short: "Integrated multi-service contracts combining security, cleaning, technical upkeep and property coordination.",
    description: "Comprehensive facility management that streamlines all vendor operations, maintenance schedules, and SLA monitoring.",
    cta: "Request Facility Quote",
    features: [
      "Integrated Facility Management",
      "Facility Operations",
      "Maintenance Coordination",
      "Security & Housekeeping Coordination",
      "Preventive Maintenance",
    ],
  },
  {
    id: "cctv-installation-maintenance",
    slug: "cctv-installation-maintenance",
    name: "CCTV Installation and Maintenance",
    category: "CCTV Installation and Maintenance",
    icon: "video",
    image: "/images/security.jpg",
    status: "Active",
    startingPrice: 4500,
    priceNote: "installation / AMC starting",
    short: "HD/IP surveillance camera installation, NVR/DVR setup, periodic maintenance and troubleshooting.",
    description: "Turnkey security camera solutions for offices, gated societies, factories, and retail stores with AMC options.",
    cta: "Request CCTV Quote",
    features: [
      "CCTV Installation",
      "CCTV Maintenance & AMC",
      "Camera Setup & Alignment",
      "NVR / DVR Configuration",
      "Surveillance Inspection",
    ],
  },
  {
    id: "plumbing-electrical-painting-waterproofing",
    slug: "plumbing-electrical-painting-waterproofing",
    name: "Plumbing, Electrical, Painting, Waterproofing",
    category: "Plumbing, Electrical, Painting, Waterproofing",
    icon: "roller",
    image: "/images/painting.jpg",
    status: "Active",
    startingPrice: 5000,
    priceNote: "per job / inspection",
    short: "Comprehensive civil and technical maintenance covering plumbing, electrical works, painting and leakage waterproofing.",
    description: "Skilled technicians and master painters for pipeline leak repairs, wiring maintenance, repainting, and roof/terrace waterproofing.",
    cta: "Request Technical Quote",
    features: [
      "Plumbing Leakage & Pipe Repairs",
      "Electrical Wiring & Lighting Maintenance",
      "Interior & Exterior Painting",
      "Terrace & Wall Waterproofing",
      "Civil Technical Upkeep",
    ],
  },
  {
    id: "repair-maintenance-services",
    slug: "repair-maintenance-services",
    name: "Repair and Maintenance Services",
    category: "Repair and Maintenance Services",
    icon: "gear",
    image: "/images/hero.jpg",
    status: "Active",
    startingPrice: 3000,
    priceNote: "per maintenance visit",
    short: "General building repair, structural upkeep, preventive asset maintenance and on-call technicians.",
    description: "Routine and emergency repair services for commercial campuses, societies, and industrial premises.",
    cta: "Request Maintenance Quote",
    features: [
      "General Facility Repairs",
      "Building Upkeep",
      "Preventive Asset Maintenance",
      "On-Call Technical Support",
    ],
  },
];

export interface PricingRule {
  id: string;
  name: string;
  base: number;
  perSqft: number;
  minCharge: number;
  status: string;
}

export const pricingRules: PricingRule[] = [
  {
    id: "security",
    name: "Security Guard Services",
    base: 15000,
    perSqft: 0.8,
    minCharge: 15000,
    status: "Active",
  },
  { id: "housekeeping", name: "Housekeeping Services", base: 10000, perSqft: 0.6, minCharge: 10000, status: "Active" },
  { id: "pest", name: "Pest Control Services", base: 2500, perSqft: 0.4, minCharge: 2500, status: "Active" },
  { id: "tank", name: "Tank Cleaning & Gardening", base: 1800, perSqft: 0.25, minCharge: 1800, status: "Active" },
  { id: "technical", name: "Plumbing, Electrical & Painting", base: 5000, perSqft: 0.7, minCharge: 5000, status: "Active" },
  { id: "facility-management", name: "Facility Management Solutions", base: 25000, perSqft: 1.2, minCharge: 25000, status: "Active" },
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

export interface IndustryItem {
  id: number;
  name: string;
  icon: string;
  image?: string;
  description: string;
}

export const industries: IndustryItem[] = [
  { id: 1, name: "Corporate Offices", icon: "building", image: "/images/industries/corporate-offices.jpg", description: "Front-desk security, housekeeping support and scheduled maintenance for office campuses." },
  { id: 2, name: "Residential Societies", icon: "home", image: "/images/industries/residential-societies.jpg", description: "Gate management, society pest control and periodic tank cleaning contracts." },
  { id: 3, name: "Commercial Buildings", icon: "store", image: "/images/industries/commercial-buildings.jpg", description: "Multi-tenant facility coordination with common-area upkeep and access control." },
  { id: 4, name: "Industrial Facilities", icon: "factory", image: "/images/industries/industrial-facilities.jpg", description: "Shift-based industrial security and plant maintenance painting programmes." },
  { id: 5, name: "Warehouses", icon: "box", image: "/images/industries/warehouses.jpg", description: "Perimeter security, rodent control and large-area maintenance support." },
  { id: 6, name: "Schools & Institutions", icon: "school", image: "/images/industries/schools-institutions.jpg", description: "Safe-campus security cover and hygiene-critical tank cleaning schedules." },
  { id: 7, name: "Hospitals & Healthcare", icon: "cross", image: "/images/industries/hospitals-healthcare.jpg", description: "Hygiene-first pest management and disciplined visitor control." },
  { id: 8, name: "Retail Spaces", icon: "cart", image: "/images/industries/retail-spaces.jpg", description: "Customer-facing guards and after-hours cleaning and painting works." },
  { id: 9, name: "Hospitality", icon: "bed", image: "/images/industries/hospitality.jpg", description: "Guest-area presentation, preventive pest cover and water hygiene." },
  { id: 10, name: "Construction & Property Sites", icon: "cone", image: "/images/industries/construction-sites.jpg", description: "Site security deployment and handover painting for new properties." },
];

export interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  client: string;
  location: string;
  serviceType: string;
  year: string;
  status: string;
  image: string;
  description: string;
}

export const portfolio: PortfolioItem[] = [
  { id: 1, title: "Corporate Office Security Management", category: "Security", client: "IT Services Company", location: "Hinjawadi, Pune", serviceType: "Security Guard Deployment", year: "2025", status: "Completed", image: "/images/security.jpg", description: "Round-the-clock manned guarding with entry-exit registers and visitor management across a 3-floor corporate office." },
  { id: 2, title: "Residential Society Pest Control", category: "Pest Control", client: "Residential Society", location: "Rahatni, Pune", serviceType: "Preventive Pest Management", year: "2025", status: "Ongoing", image: "/images/pest.jpg", description: "Quarterly cockroach and rodent management across 168 flats, clubhouse and basement parking areas." },
  { id: 3, title: "Commercial Water Tank Cleaning", category: "Tank Cleaning", client: "Business Park", location: "Kalewadi, Pune", serviceType: "Overhead & Underground Cleaning", year: "2024", status: "Completed", image: "/images/tank.jpg", description: "Mechanised cleaning and sanitisation of 6 storage tanks with pre and post service documentation." },
  { id: 4, title: "Office Interior Painting", category: "Painting", client: "Consulting Firm", location: "Baner, Pune", serviceType: "Interior Painting", year: "2025", status: "Completed", image: "/images/painting.jpg", description: "Weekend-phased interior repainting of 9,000 sq.ft workspace with zero working-day disruption." },
  { id: 5, title: "Industrial Facility Security", category: "Security", client: "Manufacturing Unit", location: "Chakan, Pune", serviceType: "Industrial Security", year: "2024", status: "Ongoing", image: "/images/facility.jpg", description: "Three-shift gate and material-movement security with supervisor-led daily reporting." },
  { id: 6, title: "Warehouse Maintenance Support", category: "Facility Management", client: "Logistics Operator", location: "Talegaon, Pune", serviceType: "Integrated Facility Support", year: "2025", status: "Ongoing", image: "/images/facility.jpg", description: "Combined security, rodent control and periodic maintenance under a single service contract." },
  { id: 7, title: "Residential Complex Painting", category: "Painting", client: "Housing Society", location: "Pimpri, Pune", serviceType: "Exterior Painting", year: "2024", status: "Completed", image: "/images/painting.jpg", description: "External repainting of four towers including surface repair and waterproof coating." },
  { id: 8, title: "Commercial Property Facility Support", category: "Facility Management", client: "Retail Property", location: "Wakad, Pune", serviceType: "Integrated Facility Services", year: "2026", status: "In Progress", image: "/images/facility.jpg", description: "Day-and-night facility cover combining guarding, hygiene services and scheduled upkeep." },
];

export interface TestimonialItem {
  id: number;
  name: string;
  company: string;
  industry: string;
  rating: number;
  status: string;
  review: string;
}

export const testimonials: TestimonialItem[] = [
  { id: 1, name: "Rohit Deshmukh", company: "Vertex Business Park", industry: "Commercial Property", rating: 5, status: "Published", review: "Diamond provided a professional and responsive facility service experience. Their team understood our requirements and coordinated the work efficiently." },
  { id: 2, name: "Sneha Kulkarni", company: "Sai Pritam Residency", industry: "Residential Society", rating: 5, status: "Published", review: "Pest control and tank cleaning are now handled on a fixed schedule. Residents get prior notice and the reporting after each visit is clear." },
  { id: 3, name: "Amit Rane", company: "Nexa Manufacturing", industry: "Industrial", rating: 4, status: "Published", review: "Guard deployment was arranged quickly and their supervisors stay in touch. Shift discipline has been consistent since day one." },
  { id: 4, name: "Priya Menon", company: "Brightpath Institute", industry: "Education", rating: 5, status: "Published", review: "Having security, cleaning and painting under one partner removed a lot of coordination work for our admin team." },
];

export interface QuoteRequestItem {
  id: string;
  company: string;
  contact: string;
  phone: string;
  email: string;
  services: string[];
  facilitySize: number;
  estimatedCost: number;
  date: string;
  status: string;
  facilityType?: string;
  frequency?: string;
  preferredDate?: string;
  city?: string;
  notes?: string;
}

export const quoteRequests: QuoteRequestItem[] = [
  { id: "QR-1041", company: "Vertex Business Park", contact: "Rohit Deshmukh", phone: "9822012345", email: "rohit@vertexpark.in", services: ["Security", "Tank Cleaning"], facilitySize: 45000, estimatedCost: 62400, date: "2026-08-28", status: "New" },
  { id: "QR-1040", company: "Nexa Manufacturing", contact: "Amit Rane", phone: "9765432109", email: "amit@nexamfg.in", services: ["Security"], facilitySize: 90000, estimatedCost: 87000, date: "2026-08-24", status: "Contacted" },
  { id: "QR-1039", company: "Sai Pritam Residency", contact: "Sneha Kulkarni", phone: "9890011223", email: "sneha@saipritam.org", services: ["Pest Control", "Tank Cleaning"], facilitySize: 25000, estimatedCost: 18700, date: "2026-08-19", status: "Quoted" },
  { id: "QR-1038", company: "Brightpath Institute", contact: "Priya Menon", phone: "9011223344", email: "priya@brightpath.edu.in", services: ["Painting", "Pest Control"], facilitySize: 15000, estimatedCost: 27500, date: "2026-08-12", status: "Converted" },
  { id: "QR-1037", company: "Urban Retail Hub", contact: "Kunal Shah", phone: "9922334455", email: "kunal@urbanretail.in", services: ["Security", "Painting"], facilitySize: 8000, estimatedCost: 33600, date: "2026-08-05", status: "Closed" },
];

export interface ContactMessageItem {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  date: string;
  status: string;
}

export const contactMessages: ContactMessageItem[] = [
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
  "Security Guard Services",
  "Housekeeping Services",
  "Pest Control Services",
  "Tank Cleaning, Gardening and Landscaping etc.",
  "Plumbing, Electrical, Painting, Waterproofing",
  "Facility Management Solutions",
];

export const formatINR = (value: number) =>
  "₹" + Math.round(value).toLocaleString("en-IN", { maximumFractionDigits: 0 });
