import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Gallery } from "@/models";
import { verifyAdminRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");

    const query: any = {};
    if (category && category !== "All") query.category = category;

    if (status) {
      query.status = status;
    } else {
      const session = await verifyAdminRequest(req);
      if (!session) {
        query.status = "Active";
      }
    }

    const items = await Gallery.find(query).sort({ sortOrder: 1, createdAt: -1 });
    return NextResponse.json(items, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error: any) {
    console.error("GET /api/gallery error:", error);
    return NextResponse.json({ error: "Failed to fetch gallery items" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await verifyAdminRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const data = await req.json();
    if (!data.title || !data.image) {
      return NextResponse.json(
        { error: "Title and Image URL are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const item = await Gallery.create({
      title: data.title.trim(),
      description: data.description?.trim() || "",
      image: data.image.trim(),
      category: data.category?.trim() || "General Operations",
      altText: data.altText?.trim() || data.title.trim(),
      sortOrder: Number(data.sortOrder) || 1,
      status: data.status || "Active",
    });

    return NextResponse.json({ success: true, data: item, item }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/gallery error:", error);
    return NextResponse.json({ error: error?.message || "Failed to create gallery item" }, { status: 500 });
  }
}
