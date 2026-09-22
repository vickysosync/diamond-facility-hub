import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Gallery } from "@/models";
import { verifyAdminRequest } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const item = await Gallery.findById(id);
    if (!item) {
      return NextResponse.json({ error: "Gallery item not found" }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (error: any) {
    console.error("GET /api/gallery/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch gallery item" }, { status: 500 });
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
    const item = await Gallery.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return NextResponse.json({ error: "Gallery item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: item, item });
  } catch (error: any) {
    console.error("PUT /api/gallery/[id] error:", error);
    return NextResponse.json({ error: error?.message || "Failed to update gallery item" }, { status: 500 });
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
    const item = await Gallery.findByIdAndDelete(id);

    if (!item) {
      return NextResponse.json({ error: "Gallery item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Gallery item deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/gallery/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete gallery item" }, { status: 500 });
  }
}
