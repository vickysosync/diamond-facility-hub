import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Banner } from "@/models";
import { verifyAdminRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const placement = searchParams.get("placement");

    const query: any = {};
    if (status && status !== "All") query.status = status;
    if (placement && placement !== "All") query.placement = placement;

    const banners = await Banner.find(query).sort({ sortOrder: 1, createdAt: 1 });
    return NextResponse.json(banners, {
      headers: {
        "Cache-Control": "no-store, max-age=0, must-revalidate",
      },
    });
  } catch (error: any) {
    console.error("GET /api/banners error:", error);
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await verifyAdminRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const data = await req.json();
    if (!data.title) {
      return NextResponse.json({ error: "Banner title is required" }, { status: 400 });
    }

    // Support both image and imageUrl
    if (data.imageUrl && !data.image) {
      data.image = data.imageUrl;
    }

    await connectToDatabase();
    const banner = await Banner.create(data);
    return NextResponse.json(banner, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/banners error:", error);
    return NextResponse.json({ error: error?.message || "Failed to create banner" }, { status: 500 });
  }
}
