import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { ServiceCategory } from "@/models";
import { verifyAdminRequest } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();
    const categories = await ServiceCategory.find().sort({ sortOrder: 1, createdAt: 1 });
    return NextResponse.json(categories, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error: any) {
    console.error("GET /api/service-categories error:", error);
    return NextResponse.json({ error: "Failed to fetch service categories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await verifyAdminRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const data = await req.json();
    if (!data.name || !data.slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
    }

    await connectToDatabase();

    const existing = await ServiceCategory.findOne({ slug: data.slug });
    if (existing) {
      return NextResponse.json({ error: "A category with this slug already exists" }, { status: 409 });
    }

    const category = await ServiceCategory.create(data);
    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/service-categories error:", error);
    return NextResponse.json({ error: error?.message || "Failed to create service category" }, { status: 500 });
  }
}
