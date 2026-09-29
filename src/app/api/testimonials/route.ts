import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Testimonial } from "@/models";
import { verifyAdminRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const query: any = {};
    if (status) {
      query.status = status;
    } else {
      // By default for public users, only show Approved
      const session = await verifyAdminRequest(req);
      if (!session) {
        query.status = "Approved";
      }
    }

    const testimonials = await Testimonial.find(query).sort({ createdAt: -1 });
    return NextResponse.json(testimonials, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error: any) {
    console.error("GET /api/testimonials error:", error);
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const name = (data.name || data.clientName || "").trim();
    const review = (data.review || data.content || data.message || "").trim();
    const company = (data.company || "Client").trim();

    if (!name || !review) {
      return NextResponse.json(
        { error: "Client name and review content are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    // Default to Approved if admin, else Pending
    const session = await verifyAdminRequest(req);
    const status = session ? (data.status || "Approved") : (data.status || "Pending");

    const testimonial = await Testimonial.create({
      name,
      company,
      role: data.role || "Facility Client",
      industry: data.industry || data.serviceCategory || "Facility Services",
      review,
      content: review,
      rating: Number(data.rating) || 5,
      image: data.image || data.avatar || "",
      avatar: data.avatar || data.image || "",
      featured: !!data.featured,
      sortOrder: Number(data.sortOrder) || 1,
      status,
    });
    return NextResponse.json({ success: true, data: testimonial, testimonial }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/testimonials error:", error);
    return NextResponse.json({ error: error?.message || "Failed to create testimonial" }, { status: 500 });
  }
}
