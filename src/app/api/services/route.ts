import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Service } from "@/models";
import { verifyAdminRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");

    const query: any = {};
    if (category) query.categoryName = category;
    if (status) query.status = status;

    const services = await Service.find(query).sort({ sortOrder: 1, createdAt: 1 });
    return NextResponse.json(services, {
      headers: {
        "Cache-Control": "no-store, max-age=0, must-revalidate",
      },
    });
  } catch (error: any) {
    console.error("GET /api/services error:", error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await verifyAdminRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const data = await req.json();
    const categoryName = data.categoryName || data.category;
    if (!data.name || !data.slug || !categoryName) {
      return NextResponse.json(
        { error: "Name, slug, and category are required" },
        { status: 400 }
      );
    }

    data.categoryName = categoryName;
    data.category = categoryName;

    await connectToDatabase();
    const service = await Service.create(data);
    return NextResponse.json(service, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/services error:", error);
    return NextResponse.json({ error: error?.message || "Failed to create service" }, { status: 500 });
  }
}
