import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import {
  Service,
  ServiceCategory,
  Industry,
  PortfolioProject,
  Testimonial,
  QuoteRequest,
  Enquiry,
} from "@/models";
import { verifyAdminRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await verifyAdminRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    await connectToDatabase();

    const [
      totalCategories,
      activeCategories,
      totalServices,
      activeServices,
      totalIndustries,
      totalProjects,
      completedProjects,
      ongoingProjects,
      totalTestimonials,
      pendingTestimonials,
      approvedTestimonials,
      totalQuotes,
      newQuotes,
      quotes,
      totalEnquiries,
      newEnquiries,
      projects,
    ] = await Promise.all([
      ServiceCategory.countDocuments(),
      ServiceCategory.countDocuments({ status: "Active" }),
      Service.countDocuments(),
      Service.countDocuments({ status: "Active" }),
      Industry.countDocuments(),
      PortfolioProject.countDocuments(),
      PortfolioProject.countDocuments({ status: "Completed" }),
      PortfolioProject.countDocuments({ status: "Ongoing" }),
      Testimonial.countDocuments(),
      Testimonial.countDocuments({ status: "Pending" }),
      Testimonial.countDocuments({ status: "Approved" }),
      QuoteRequest.countDocuments(),
      QuoteRequest.countDocuments({ status: "New" }),
      QuoteRequest.find().sort({ createdAt: -1 }),
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: "New" }),
      PortfolioProject.find(),
    ]);

    const statuses = ["New", "Contacted", "Quoted", "Converted", "Closed"];
    const quotesByStatus = statuses.map((s) => ({
      status: s,
      count: quotes.filter((q) => q.status === s).length,
    }));

    const pipelineValue = quotes.reduce((acc, q) => acc + (q.estimatedCost || 0), 0);

    // Calculate portfolio category mix
    const categoryCounts: Record<string, number> = {};
    for (const p of projects) {
      const cat = p.category || "General";
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    }
    const portfolioMix = Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      count,
      percentage: totalProjects > 0 ? Math.round((count / totalProjects) * 100) : 0,
    }));

    return NextResponse.json({
      totalCategories,
      activeCategories,
      totalServices,
      activeServices,
      totalIndustries,
      totalProjects,
      completedProjects,
      ongoingProjects,
      totalTestimonials,
      pendingTestimonials,
      approvedTestimonials,
      totalQuotes,
      newQuotes,
      totalEnquiries,
      newEnquiries,
      pipelineValue,
      quotesByStatus,
      portfolioMix,
      recentQuotes: quotes.slice(0, 5),
    });
  } catch (error: any) {
    console.error("GET /api/stats error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard statistics" }, { status: 500 });
  }
}
