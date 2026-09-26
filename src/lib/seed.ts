import connectToDatabase from "@/lib/mongodb";
import { hashPassword } from "@/lib/auth";
import {
  Admin,
  ServiceCategory,
  Industry,
  PortfolioProject,
  Pricing,
  Testimonial,
  Banner,
  WebsiteContent,
  CompanySettings,
  Gallery,
} from "@/models";

export async function seedDatabase() {
  await connectToDatabase();

  console.log("Seeding Diamond Integrated Facility Services database...");

  // 1. Seed & Sync Canonical Admin User (remove duplicate / deprecated accounts)
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@diamondifs.com").toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD || "Diamond@Admin#2026";
  const passwordHash = await hashPassword(adminPassword);

  // Remove any obsolete admin accounts like admin@diamondfacility.com
  await Admin.deleteMany({ email: { $ne: adminEmail } });

  const existingAdmin = await Admin.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await Admin.create({
      email: adminEmail,
      passwordHash,
      name: "Director Umesh Patil",
      role: "superadmin",
    });
    console.log(`Created canonical admin user: ${adminEmail}`);
  } else {
    existingAdmin.passwordHash = passwordHash;
    existingAdmin.name = "Director Umesh Patil";
    existingAdmin.role = "superadmin";
    await existingAdmin.save();
    console.log(`Synchronized canonical admin user: ${adminEmail}`);
  }

  // 2. Seed EXACT 11 Main Service Categories
  const official11Categories: Array<{
    categoryNumber: string;
    name: string;
    slug: string;
    icon: string;
    image: string;
    startingPrice: number;
    priceNote: string;
    pricingType: "Fixed" | "Per Sq.Ft" | "Per Visit" | "Monthly" | "Annual Contract" | "Custom Quote";
    shortDescription: string;
    description: string;
    features: string[];
    sortOrder: number;
    status: "Active" | "Inactive";
  }> = [
    {
      categoryNumber: "01",
      name: "Security Guard Services",
      slug: "security-guard-services",
      icon: "shield",
      image: "/images/security.jpg",
      startingPrice: 18000,
      priceNote: "per deployment / month",
      pricingType: "Monthly",
      shortDescription:
        "Screened and trained security personnel, access control and monitoring support for commercial, residential, corporate and industrial premises.",
      description:
        "Diamond Integrated Facility Services LLP provides disciplined and verified security personnel backed by structured shift planning, digital visitor logs, and round-the-clock supervisor coordination across Pune and Pimpri-Chinchwad.",
      features: [
        "Security Guard Deployment",
        "Residential Security",
        "Commercial Security",
        "Corporate Office Security",
        "Industrial Security",
        "Gate Security",
        "Entry & Exit Management",
        "Visitor Management",
        "Security Monitoring",
      ],
      sortOrder: 1,
      status: "Active",
    },
    {
      categoryNumber: "02",
      name: "Housekeeping Services",
      slug: "housekeeping-services",
      icon: "sparkles",
      image: "/images/facility.jpg",
      startingPrice: 12000,
      priceNote: "per month / premise",
      pricingType: "Monthly",
      shortDescription:
        "Daily, periodic and deep cleaning solutions for corporate offices, residential societies, commercial facilities and common areas.",
      description:
        "Mechanized cleaning, surface sanitization, and waste management carried out by trained housekeeping attendants with eco-friendly consumables and supervisor checklists.",
      features: [
        "Office Housekeeping",
        "Commercial Housekeeping",
        "Society Housekeeping",
        "Common Area Cleaning",
        "Washroom Cleaning",
        "Daily Cleaning",
        "Deep Cleaning Support",
        "Facility Hygiene",
      ],
      sortOrder: 2,
      status: "Active",
    },
    {
      categoryNumber: "03",
      name: "Property Management",
      slug: "property-management",
      icon: "building",
      image: "/images/facility.jpg",
      startingPrice: 25000,
      priceNote: "per property contract",
      pricingType: "Monthly",
      shortDescription:
        "End-to-end property operations, vendor management, society coordination and routine maintenance management.",
      description:
        "Complete on-ground property supervision, statutory vendor coordination, and periodic condition reporting for commercial buildings and residential housing complexes.",
      features: [
        "Property Operations",
        "Society Management Support",
        "Commercial Property Management",
        "Vendor Coordination",
        "Maintenance Coordination",
        "Property Supervision",
        "Property Upkeep",
      ],
      sortOrder: 3,
      status: "Active",
    },
    {
      categoryNumber: "04",
      name: "Pest Control Services",
      slug: "pest-control-services",
      icon: "bug",
      image: "/images/pest.jpg",
      startingPrice: 2500,
      priceNote: "per treatment / site",
      pricingType: "Per Visit",
      shortDescription:
        "Targeted pest eradication and preventive pest management programmes for offices, societies, kitchens and warehouses.",
      description:
        "Eco-conscious and government-approved chemical formulations targeting cockroaches, rodents, termites, mosquitoes, and bed bugs with zero disruption to working operations.",
      features: [
        "General Pest Control",
        "Cockroach Control",
        "Rodent Control",
        "Termite Treatment",
        "Mosquito Control",
        "Preventive Pest Control",
        "Commercial Pest Control",
        "Residential Pest Control",
      ],
      sortOrder: 4,
      status: "Active",
    },
    {
      categoryNumber: "05",
      name: "Bouncer Services",
      slug: "bouncer-services",
      icon: "users",
      image: "/images/security.jpg",
      startingPrice: 3500,
      priceNote: "per bouncer / shift",
      pricingType: "Per Visit",
      shortDescription:
        "Physically trained, professional bouncers and crowd management teams for corporate events, VIPs, venues and private functions.",
      description:
        "Experienced crowd control officers, entry management personnel, and private security escorts with clear communication and de-escalation training.",
      features: [
        "Event Bouncer Services",
        "Venue Security",
        "Crowd Management",
        "Entry Management",
        "Corporate Event Security",
        "VIP Event Security Support",
      ],
      sortOrder: 5,
      status: "Active",
    },
    {
      categoryNumber: "06",
      name: "Man Power Supply",
      slug: "man-power-supply",
      icon: "briefcase",
      image: "/images/hero.jpg",
      startingPrice: 15000,
      priceNote: "per resource / month",
      pricingType: "Monthly",
      shortDescription:
        "Skilled, semi-skilled and general support personnel deployment tailored to your facility operations and workflow.",
      description:
        "Verified technical, administrative, and facility support staff provided with statutory compliance, payroll handling, and flexible deployment models.",
      features: [
        "Skilled Manpower",
        "Semi-Skilled Manpower",
        "General Support Staff",
        "Facility Staff",
        "Housekeeping Staff",
        "Maintenance Personnel",
        "Event Support Staff",
      ],
      sortOrder: 6,
      status: "Active",
    },
    {
      categoryNumber: "07",
      name: "Tank Cleaning, Gardening and Landscaping etc.",
      slug: "tank-cleaning-gardening-landscaping",
      icon: "droplet",
      image: "/images/tank.jpg",
      startingPrice: 1800,
      priceNote: "per tank / site visit",
      pricingType: "Per Visit",
      shortDescription:
        "Mechanized water tank cleaning, sanitization, garden upkeep, lawn mowing and landscape beautification.",
      description:
        "High-pressure water tank de-silting, antibacterial UV/chemical sanitization, along with structured garden care, lawn trimming, plant health maintenance, and landscape preservation.",
      features: [
        "Tank Cleaning",
        "Overhead Tank Cleaning",
        "Underground Tank Cleaning",
        "Society Tank Cleaning",
        "Garden Maintenance",
        "Lawn Maintenance",
        "Plant Care",
        "Trimming",
        "Pruning",
        "Landscaping",
        "Green Area Maintenance",
      ],
      sortOrder: 7,
      status: "Active",
    },
    {
      categoryNumber: "08",
      name: "Facility Management Solutions",
      slug: "facility-management-solutions",
      icon: "layers",
      image: "/images/facility.jpg",
      startingPrice: 35000,
      priceNote: "integrated monthly contract",
      pricingType: "Monthly",
      shortDescription:
        "Integrated multi-service contracts combining security, cleaning, technical upkeep and property coordination under a single accountable partner.",
      description:
        "Comprehensive facility management that streamlines all vendor operations, maintenance schedules, SLA monitoring, and customer reporting under single-point accountability.",
      features: [
        "Integrated Facility Management",
        "Facility Operations",
        "Maintenance Coordination",
        "Security Coordination",
        "Housekeeping Coordination",
        "Vendor Management",
        "Facility Inspection",
        "Preventive Maintenance",
      ],
      sortOrder: 8,
      status: "Active",
    },
    {
      categoryNumber: "09",
      name: "CCTV Installation and Maintenance",
      slug: "cctv-installation-maintenance",
      icon: "video",
      image: "/images/security.jpg",
      startingPrice: 4500,
      priceNote: "installation / AMC starting",
      pricingType: "Custom Quote",
      shortDescription:
        "HD/IP surveillance camera installation, NVR/DVR configuration, periodic maintenance and CCTV system troubleshooting.",
      description:
        "Turnkey security camera solutions for offices, gated societies, factories, and retail stores, backed by annual maintenance contracts and fast camera replacements.",
      features: [
        "CCTV Installation",
        "CCTV Maintenance",
        "Camera Setup",
        "Surveillance System Support",
        "CCTV Inspection",
        "Camera Replacement",
        "Surveillance Maintenance",
      ],
      sortOrder: 9,
      status: "Active",
    },
    {
      categoryNumber: "10",
      name: "Plumbing, Electrical, Painting, Waterproofing",
      slug: "plumbing-electrical-painting-waterproofing",
      icon: "roller",
      image: "/images/painting.jpg",
      startingPrice: 5000,
      priceNote: "per job / inspection",
      pricingType: "Custom Quote",
      shortDescription:
        "Comprehensive civil and technical maintenance covering plumbing, electrical works, interior/exterior painting and leakage waterproofing.",
      description:
        "Skilled technicians and master painters for pipeline leak repairs, commercial wiring maintenance, society repainting, and specialized roof/terrace waterproofing.",
      features: [
        "Plumbing Repair",
        "Water Leakage Repair",
        "Pipeline Maintenance",
        "Drainage Maintenance",
        "Electrical Maintenance",
        "Wiring Support",
        "Lighting Maintenance",
        "Interior Painting",
        "Exterior Painting",
        "Terrace Waterproofing",
        "Roof Waterproofing",
        "Wall Waterproofing",
        "Leakage Treatment",
      ],
      sortOrder: 10,
      status: "Active",
    },
    {
      categoryNumber: "11",
      name: "Repair and Maintenance Services",
      slug: "repair-maintenance-services",
      icon: "gear",
      image: "/images/hero.jpg",
      startingPrice: 3000,
      priceNote: "per maintenance visit",
      pricingType: "Custom Quote",
      shortDescription:
        "General building repair, structural upkeep, preventive asset maintenance and on-call facility technician services.",
      description:
        "Routine and emergency repair services for commercial campuses, societies, and industrial premises to maintain operational safety and asset longevity.",
      features: [
        "General Repairs",
        "Building Maintenance",
        "Facility Repairs",
        "Preventive Maintenance",
        "Property Maintenance",
        "Plumbing Repairs",
        "Electrical Repairs",
        "Painting Maintenance",
      ],
      sortOrder: 11,
      status: "Active",
    },
  ];

  for (const catData of official11Categories) {
    const existing = await ServiceCategory.findOne({ slug: catData.slug });
    if (!existing) {
      await ServiceCategory.create(catData);
      console.log(`Seeded category: ${catData.name}`);
    } else {
      await ServiceCategory.updateOne({ slug: catData.slug }, { $set: catData });
    }
  }

  // 3. Seed Industries
  const industriesSeed = [
    {
      name: "Corporate Offices",
      slug: "corporate-offices",
      icon: "building",
      image: "/images/industries/corporate-offices.jpg",
      description:
        "Front-desk security, daily housekeeping, CCTV monitoring, and scheduled electrical & painting upkeep for IT parks and corporate campuses.",
      serviceNames: [
        "Security Guard Services",
        "Housekeeping Services",
        "Pest Control Services",
        "Facility Management Solutions",
        "CCTV Installation and Maintenance",
        "Plumbing, Electrical, Painting, Waterproofing",
      ],
      sortOrder: 1,
      status: "Active" as const,
    },
    {
      name: "Residential Societies",
      slug: "residential-societies",
      icon: "home",
      image: "/images/industries/residential-societies.jpg",
      description:
        "Gate security, common-area housekeeping, periodic water tank cleaning, garden landscaping, pest control, and terrace waterproofing.",
      serviceNames: [
        "Security Guard Services",
        "Housekeeping Services",
        "Property Management",
        "Pest Control Services",
        "Tank Cleaning, Gardening and Landscaping etc.",
        "Plumbing, Electrical, Painting, Waterproofing",
      ],
      sortOrder: 2,
      status: "Active" as const,
    },
    {
      name: "Commercial Buildings",
      slug: "commercial-buildings",
      icon: "store",
      image: "/images/industries/commercial-buildings.jpg",
      description:
        "Multi-tenant facility coordination, visitor entry registers, washroom hygiene, CCTV maintenance, and common-area painting.",
      serviceNames: [
        "Security Guard Services",
        "Housekeeping Services",
        "Property Management",
        "CCTV Installation and Maintenance",
        "Repair and Maintenance Services",
      ],
      sortOrder: 3,
      status: "Active" as const,
    },
    {
      name: "Industrial Facilities & Manufacturing",
      slug: "industrial-facilities",
      icon: "factory",
      image: "/images/industries/industrial-facilities.jpg",
      description:
        "Three-shift gate guarding, skilled manpower supply, industrial pest management, and plant maintenance painting programmes.",
      serviceNames: [
        "Security Guard Services",
        "Man Power Supply",
        "Pest Control Services",
        "Facility Management Solutions",
        "Repair and Maintenance Services",
      ],
      sortOrder: 4,
      status: "Active" as const,
    },
    {
      name: "Warehouses & Logistics Hubs",
      slug: "warehouses",
      icon: "box",
      image: "/images/industries/warehouses.jpg",
      description:
        "Perimeter security, material in/out documentation, comprehensive rodent control, and large-area maintenance support.",
      serviceNames: [
        "Security Guard Services",
        "Pest Control Services",
        "Man Power Supply",
        "CCTV Installation and Maintenance",
      ],
      sortOrder: 5,
      status: "Active" as const,
    },
    {
      name: "Schools, Colleges & Institutions",
      slug: "schools-institutions",
      icon: "school",
      image: "/images/industries/schools-institutions.jpg",
      description:
        "Safe-campus security, student-safe washroom sanitization, drinking water tank cleaning schedules, and vacation repainting.",
      serviceNames: [
        "Security Guard Services",
        "Housekeeping Services",
        "Tank Cleaning, Gardening and Landscaping etc.",
        "Pest Control Services",
        "Plumbing, Electrical, Painting, Waterproofing",
      ],
      sortOrder: 6,
      status: "Active" as const,
    },
    {
      name: "Hospitals & Healthcare Facilities",
      slug: "hospitals-healthcare",
      icon: "cross",
      image: "/images/industries/hospitals-healthcare.jpg",
      description:
        "Hygiene-critical deep cleaning, sterile pest management, 24/7 entry crowd management, and emergency technical support.",
      serviceNames: [
        "Housekeeping Services",
        "Security Guard Services",
        "Bouncer Services",
        "Pest Control Services",
        "Facility Management Solutions",
      ],
      sortOrder: 7,
      status: "Active" as const,
    },
    {
      name: "Retail Spaces & Showrooms",
      slug: "retail-spaces",
      icon: "cart",
      image: "/images/industries/retail-spaces.jpg",
      description:
        "Customer-facing guards, after-hours floor polishing, CCTV surveillance coverage, and prompt electrical/lighting repairs.",
      serviceNames: [
        "Security Guard Services",
        "Housekeeping Services",
        "CCTV Installation and Maintenance",
        "Plumbing, Electrical, Painting, Waterproofing",
      ],
      sortOrder: 8,
      status: "Active" as const,
    },
    {
      name: "Hospitality & Hotels",
      slug: "hospitality",
      icon: "bed",
      image: "/images/industries/hospitality.jpg",
      description:
        "Guest-area presentation, preventive pest cover, water hygiene tank cleaning, and event bouncers for private functions.",
      serviceNames: [
        "Housekeeping Services",
        "Bouncer Services",
        "Pest Control Services",
        "Tank Cleaning, Gardening and Landscaping etc.",
      ],
      sortOrder: 9,
      status: "Active" as const,
    },
    {
      name: "Construction & Handover Property Sites",
      slug: "construction-sites",
      icon: "cone",
      image: "/images/industries/construction-sites.jpg",
      description:
        "Material yard security, site bouncers, post-construction deep cleaning, and pre-handover painting and waterproofing.",
      serviceNames: [
        "Security Guard Services",
        "Bouncer Services",
        "Man Power Supply",
        "Plumbing, Electrical, Painting, Waterproofing",
      ],
      sortOrder: 10,
      status: "Active" as const,
    },
  ];

  for (const ind of industriesSeed) {
    const existing = await Industry.findOne({ slug: ind.slug });
    if (!existing) {
      await Industry.create(ind);
      console.log(`Seeded industry: ${ind.name}`);
    } else {
      await Industry.updateOne({ slug: ind.slug }, { $set: ind });
    }
  }

  // 4. Seed Portfolio Projects
  const portfolioSeed: Array<{
    title: string;
    slug: string;
    category: string;
    client: string;
    location: string;
    serviceType: string;
    year: string;
    status: "Completed" | "Ongoing";
    image: string;
    description: string;
    sortOrder: number;
  }> = [
    {
      title: "Corporate Campus Security & Access Management",
      slug: "corporate-campus-security",
      category: "Security Guard Services",
      client: "IT Services Campus",
      location: "Hinjawadi, Pune",
      serviceType: "Security Guard Deployment",
      year: "2025",
      status: "Ongoing",
      image: "/images/security.jpg",
      description:
        "Round-the-clock manned guarding with digital visitor registration, material pass tracking, and 3-shift supervisor coverage across a 4-acre IT park.",
      sortOrder: 1,
    },
    {
      title: "Residential Society Integrated Upkeep & Pest Control",
      slug: "residential-society-pest-tank",
      category: "Pest Control Services",
      client: "Sai Pritam Residency",
      location: "Rahatani, Pune",
      serviceType: "Society Upkeep & Pest Control",
      year: "2025",
      status: "Ongoing",
      image: "/images/pest.jpg",
      description:
        "Quarterly cockroach and rodent management along with scheduled underground and overhead water tank sanitization for 180 apartments.",
      sortOrder: 2,
    },
    {
      title: "Commercial Business Park Water Tank Sanitization",
      slug: "commercial-water-tank-cleaning",
      category: "Tank Cleaning, Gardening and Landscaping etc.",
      client: "Vertex Commercial Hub",
      location: "Kalewadi, Pune",
      serviceType: "Mechanized Tank Cleaning",
      year: "2024",
      status: "Completed",
      image: "/images/tank.jpg",
      description:
        "High-pressure de-silting, vacuum extraction, and antibacterial treatment across 8 large commercial storage tanks with documented quality reports.",
      sortOrder: 3,
    },
    {
      title: "Office Interior Repainting & Surface Finish",
      slug: "office-interior-painting",
      category: "Plumbing, Electrical, Painting, Waterproofing",
      client: "Corporate Consulting Office",
      location: "Baner, Pune",
      serviceType: "Interior Painting & Waterproofing",
      year: "2025",
      status: "Completed",
      image: "/images/painting.jpg",
      description:
        "Weekend-phased interior repainting of 12,000 sq.ft workspace with zero disruption to regular weekday business hours.",
      sortOrder: 4,
    },
    {
      title: "Manufacturing Plant Gate & Shift Security",
      slug: "manufacturing-plant-security",
      category: "Security Guard Services",
      client: "Industrial Engineering Unit",
      location: "Chakan, Pune",
      serviceType: "Industrial Security",
      year: "2024",
      status: "Ongoing",
      image: "/images/facility.jpg",
      description:
        "Three-shift gate security, material weight-bridge monitoring, and daily supervisor inspection reports.",
      sortOrder: 5,
    },
    {
      title: "Logistics Warehouse Integrated Facility Cover",
      slug: "warehouse-facility-management",
      category: "Facility Management Solutions",
      client: "Logistics Operator",
      location: "Talegaon, Pune",
      serviceType: "Integrated Facility Management",
      year: "2025",
      status: "Ongoing",
      image: "/images/hero.jpg",
      description:
        "Combined security, manpower, rodent control, and technical upkeep under a unified single-point SLA contract.",
      sortOrder: 6,
    },
  ];

  for (const proj of portfolioSeed) {
    const existing = await PortfolioProject.findOne({ slug: proj.slug });
    if (!existing) {
      await PortfolioProject.create(proj);
      console.log(`Seeded portfolio project: ${proj.title}`);
    } else {
      await PortfolioProject.updateOne({ slug: proj.slug }, { $set: proj });
    }
  }

  // 5. Seed Dynamic Pricing Rules for Estimator
  const pricingRulesSeed: Array<{
    serviceId: string;
    name: string;
    base: number;
    perSqft: number;
    minCharge: number;
    pricingType: "Fixed" | "Per Sq.Ft" | "Per Visit" | "Monthly" | "Annual Contract" | "Custom Quote";
    status: "Active" | "Inactive";
  }> = [
    {
      serviceId: "security",
      name: "Security Guard Services",
      base: 15000,
      perSqft: 0.8,
      minCharge: 15000,
      pricingType: "Per Sq.Ft",
      status: "Active",
    },
    {
      serviceId: "housekeeping",
      name: "Housekeeping Services",
      base: 10000,
      perSqft: 0.6,
      minCharge: 10000,
      pricingType: "Per Sq.Ft",
      status: "Active",
    },
    {
      serviceId: "pest",
      name: "Pest Control Services",
      base: 2500,
      perSqft: 0.4,
      minCharge: 2500,
      pricingType: "Per Sq.Ft",
      status: "Active",
    },
    {
      serviceId: "tank",
      name: "Tank Cleaning & Gardening",
      base: 1800,
      perSqft: 0.25,
      minCharge: 1800,
      pricingType: "Per Sq.Ft",
      status: "Active",
    },
    {
      serviceId: "technical",
      name: "Plumbing, Electrical & Painting",
      base: 5000,
      perSqft: 0.7,
      minCharge: 5000,
      pricingType: "Per Sq.Ft",
      status: "Active",
    },
    {
      serviceId: "facility-management",
      name: "Facility Management Solutions",
      base: 25000,
      perSqft: 1.2,
      minCharge: 25000,
      pricingType: "Per Sq.Ft",
      status: "Active",
    },
  ];

  for (const pr of pricingRulesSeed) {
    const existing = await Pricing.findOne({ serviceId: pr.serviceId });
    if (!existing) {
      await Pricing.create(pr);
      console.log(`Seeded pricing rule: ${pr.name}`);
    } else {
      await Pricing.updateOne({ serviceId: pr.serviceId }, { $set: pr });
    }
  }

  // 6. Seed Approved Testimonials
  const testimonialsSeed: Array<{
    name: string;
    company: string;
    industry: string;
    rating: number;
    status: "Approved" | "Pending" | "Rejected";
    review: string;
  }> = [
    {
      name: "Rohit Deshmukh",
      company: "Vertex Business Park",
      industry: "Commercial Property",
      rating: 5,
      status: "Approved",
      review:
        "Diamond Integrated Facility Services has been an accountable, highly dependable partner for our commercial facility. Their security team and housekeeping supervision are seamless.",
    },
    {
      name: "Sneha Kulkarni",
      company: "Sai Pritam Residency",
      industry: "Residential Society",
      rating: 5,
      status: "Approved",
      review:
        "Water tank cleaning, garden maintenance, and quarterly pest control are executed on fixed schedules. Residents get clear advance notice and thorough service reports.",
    },
    {
      name: "Amit Rane",
      company: "Nexa Engineering",
      industry: "Industrial Manufacturing",
      rating: 5,
      status: "Approved",
      review:
        "Security guard deployment and technical maintenance personnel were provided swiftly. Umesh Patil and his team maintain proactive communication at all times.",
    },
    {
      name: "Priya Menon",
      company: "Brightpath Educational Institute",
      industry: "Education",
      rating: 5,
      status: "Approved",
      review:
        "Having security, hygiene cleaning, and repair maintenance handled by one trusted partner has eliminated administrative headaches for our management team.",
    },
  ];

  for (const t of testimonialsSeed) {
    const existing = await Testimonial.findOne({ name: t.name, company: t.company });
    if (!existing) {
      await Testimonial.create(t);
      console.log(`Seeded testimonial: ${t.name}`);
    }
  }

  // 7. Seed Hero Banners (All 5 Divisions)
  const heroBannersSeed = [
    {
      title: "Complete Facility Services.",
      subtitle: "One Trusted Partner.",
      description:
        "Official provider of Security Guarding, Housekeeping, Property Management, Pest Eradication, Tank Sanitization, Manpower, CCTV and Technical Civil Upkeep across Pune & PCMC.",
      image: "/images/hero/slide-security.png",
      ctaText: "Get Free Instant Quote",
      ctaLink: "/contact",
      status: "Active" as const,
      sortOrder: 1,
    },
    {
      title: "Impeccable Facility Cleanliness.",
      subtitle: "Zero Compromise.",
      description:
        "Supervisor-monitored corporate housekeeping, daily office cleaning, mechanized floor scrubbing, and hospital-grade deep sanitization for IT parks and societies.",
      image: "/images/hero/slide-housekeeping.png",
      ctaText: "Book Housekeeping Audit",
      ctaLink: "/services/housekeeping-services",
      status: "Active" as const,
      sortOrder: 2,
    },
    {
      title: "Seamless Property Operations.",
      subtitle: "Built Around Your Campus.",
      description:
        "End-to-end facility operations, multi-vendor coordination, residential society administration, and routine technical condition reporting.",
      image: "/images/hero/slide-facility.png",
      ctaText: "Request Facility Proposal",
      ctaLink: "/services/property-management",
      status: "Active" as const,
      sortOrder: 3,
    },
    {
      title: "Certified Water Tank Cleaning.",
      subtitle: "Pure Hygiene & Green Care.",
      description:
        "6-stage mechanized cleaning for overhead and underground water storage tanks, accompanied by structured garden upkeep and landscape preservation.",
      image: "/images/hero/slide-tank.png",
      ctaText: "Schedule Tank Cleaning",
      ctaLink: "/services/tank-cleaning-gardening-landscaping",
      status: "Active" as const,
      sortOrder: 4,
    },
    {
      title: "Advanced CCTV & Civil Upkeep.",
      subtitle: "Always Protected.",
      description:
        "Turnkey HD surveillance installation, round-the-clock control room monitoring, certified electrical, plumbing, painting, and terrace waterproofing.",
      image: "/images/hero/slide-cctv.png",
      ctaText: "Get Technical Estimate",
      ctaLink: "/services/cctv-installation-maintenance",
      status: "Active" as const,
      sortOrder: 5,
    },
  ];

  for (const b of heroBannersSeed) {
    const existing = await Banner.findOne({ sortOrder: b.sortOrder });
    if (!existing) {
      await Banner.create(b);
      console.log(`Seeded hero banner #${b.sortOrder}: ${b.title}`);
    } else {
      await Banner.updateOne({ sortOrder: b.sortOrder }, { $set: b });
    }
  }

  // 8. Seed Website Content
  const existingContent = await WebsiteContent.findOne();
  if (!existingContent) {
    await WebsiteContent.create({
      heroHeading: "Complete Facility Services.",
      heroHighlightedWord: "One Trusted Partner.",
      heroSubtitle:
        "Reliable security, housekeeping, property management, pest control, manpower, tank cleaning, gardening & landscaping, CCTV, and technical maintenance solutions across Pune.",
      heroBadge: "Professional • Reliable • Responsive",
      aboutHeading: "Integrated Facility Services Built Around Your Needs",
      aboutDescription:
        "Diamond Integrated Facility Services LLP delivers comprehensive security, housekeeping, pest control, water tank cleaning, CCTV, gardening, electrical, plumbing, painting, and maintenance services for residential, commercial, industrial and institutional facilities through a single accountable service partner.",
      aboutHighlights: [
        { value: "11", label: "Core Services" },
        { value: "10+", label: "Industries Served" },
        { value: "Pune", label: "Headquarters & Operations" },
      ],
      whyChooseUs: [
        {
          title: "Reliable Workforce",
          text: "Screened, verified, and trained personnel for recurring and on-demand facility requirements.",
          icon: "users",
        },
        {
          title: "11 Integrated Services",
          text: "Security, cleaning, technical upkeep, and property operations managed through one partner.",
          icon: "layers",
        },
        {
          title: "Flexible B2B Packages",
          text: "Customized service contracts tailored to facility size, operational shifts, and specific scope.",
          icon: "sliders",
        },
        {
          title: "Safety & Quality First",
          text: "Operations designed around workplace safety, hygiene standards, and responsible practices.",
          icon: "shield",
        },
        {
          title: "Responsive Management",
          text: "Direct coordinator oversight, daily activity logs, and rapid incident resolution.",
          icon: "headset",
        },
        {
          title: "B2B & Institutional Focus",
          text: "Specialized service delivery for corporate campuses, housing societies, factories, and institutions.",
          icon: "briefcase",
        },
      ],
      ctaHeading: "Looking for a Reliable Facility Services Partner?",
      ctaText:
        "Tell us about your facility requirements and get a customized service estimate within minutes.",
      footerText:
        "Integrated facility management and property support services for B2B clients across Pune and Pimpri-Chinchwad, backed by trained personnel, safety-first operations and flexible service packages.",
    });
    console.log("Seeded website content");
  }

  // 9. Seed Official Company Settings
  const existingCompany = await CompanySettings.findOne();
  const officialCompanyData = {
    name: "Diamond Integrated Facility Services LLP",
    shortName: "DIAMOND",
    tagline: "Integrated Facility Services LLP",
    director: "UMESH PATIL",
    partners: ["UMESH PRATAP PATIL", "KAVITA UMESH PATIL"],
    website: "https://diamondifs.com",
    email: "info@diamondifs.com",
    landline: "020 45355544",
    mobileNumbers: ["+91 9689515295", "+91 9970046704"],
    primaryPhone: "+91 9689515295",
    address:
      "Office No-A2, Sai Pritam Nagari, Chhatrapati Chowk, Rahatani-Kalewadi Link Road, Rahatani, Pune, Maharashtra, India - 411017",
    city: "Pune, Maharashtra",
    pincode: "411017",
    about:
      "Diamond Integrated Facility Services LLP delivers security, housekeeping, property management, pest control, bouncer security, manpower supply, tank cleaning, gardening & landscaping, facility management, CCTV installation & maintenance, plumbing, electrical, painting, waterproofing, and repair & maintenance services for residential, commercial, industrial and institutional facilities through a single accountable service partner.",
    businessDescription:
      "Integrated facility management and property support services for B2B clients across Pune and Pimpri-Chinchwad, backed by trained personnel, safety-first operations and flexible service packages.",
    businessHours: [
      { day: "Monday – Saturday", hours: "9:00 AM – 6:00 PM" },
      { day: "Sunday", hours: "Emergency Support Only" },
    ],
    logo: "/images/logo.png",
    socialLinks: {
      facebook: "",
      linkedin: "",
      twitter: "",
      instagram: "",
    },
  };

  if (!existingCompany) {
    await CompanySettings.create(officialCompanyData);
    console.log("Seeded company settings with official details");
  } else {
    await CompanySettings.updateOne({}, { $set: officialCompanyData });
  }

  // 10. Seed Gallery Items
  const gallerySeed = [
    {
      title: "Commercial Office Security Team Briefing",
      description: "Daily shift briefing and access log verification for corporate IT campus.",
      image: "/images/security.jpg",
      category: "Security Operations",
      altText: "Security guard team deployment in Pune by Diamond Integrated Facility Services",
      sortOrder: 1,
      status: "Active" as const,
    },
    {
      title: "Corporate Deep Cleaning & Surface Sanitization",
      description: "Mechanized floor cleaning and workstation hygiene maintenance.",
      image: "/images/facility.jpg",
      category: "Housekeeping & Sanitization",
      altText: "Corporate housekeeping services in Pune",
      sortOrder: 2,
      status: "Active" as const,
    },
    {
      title: "Underground Water Tank High-Pressure Wash",
      description: "Six-stage mechanized de-silting, cleaning and antibacterial treatment.",
      image: "/images/tank.jpg",
      category: "Tank Cleaning & Hygiene",
      altText: "High pressure water tank sanitization Pune",
      sortOrder: 3,
      status: "Active" as const,
    },
    {
      title: "Interior Repainting & Terrace Waterproofing",
      description: "Surface preparation, elastomeric coating and waterproofing finish.",
      image: "/images/painting.jpg",
      category: "Civil & Technical Upkeep",
      altText: "Office interior painting and terrace waterproofing",
      sortOrder: 4,
      status: "Active" as const,
    },
    {
      title: "Targeted Pest Control & Rodent Management",
      description: "Odorless gel treatment and perimeter rodent management for commercial pantry.",
      image: "/images/pest.jpg",
      category: "Pest Management",
      altText: "Targeted pest eradication commercial kitchens Pune",
      sortOrder: 5,
      status: "Active" as const,
    },
    {
      title: "Facility Management Front Desk & Gate Coordination",
      description: "Single-point facility supervision and statutory visitor control.",
      image: "/images/hero.jpg",
      category: "Integrated Facility",
      altText: "Integrated facility management team in Pune",
      sortOrder: 6,
      status: "Active" as const,
    },
  ];

  for (const g of gallerySeed) {
    const existing = await Gallery.findOne({ title: g.title });
    if (!existing) {
      await Gallery.create(g);
      console.log(`Seeded gallery item: ${g.title}`);
    } else {
      await Gallery.updateOne({ title: g.title }, { $set: g });
    }
  }

  console.log("Database seeding completed successfully!");
  return { success: true, message: "Database seeded successfully." };
}

export default seedDatabase;
