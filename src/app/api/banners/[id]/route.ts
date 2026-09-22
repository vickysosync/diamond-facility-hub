import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Banner } from "@/models";
import { verifyAdminRequest } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const banner = await Banner.findById(id);
    if (!banner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }
    return NextResponse.json(banner);
  } catch (error: any) {
    console.error("GET /api/banners/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch banner" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await verifyAdminRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = await params;
    const data = await req.json();

    await connectToDatabase();
    const banner = await Banner.findByIdAndUpdate(id, data, { new: true });

    if (!banner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    return NextResponse.json(banner);
  } catch (error: any) {
    console.error("PUT /api/banners/[id] error:", error);
    return NextResponse.json({ error: error?.message || "Failed to update banner" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await verifyAdminRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = await params;
    await connectToDatabase();
    const banner = await Banner.findByIdAndDelete(id);

    if (!banner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Banner deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/banners/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete banner" }, { status: 500 });
  }
}
