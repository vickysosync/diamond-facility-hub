import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Service } from "@/models";
import { verifyAdminRequest } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();
    
    // Check by ID or slug
    let service = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      service = await Service.findById(id);
    }
    if (!service) {
      service = await Service.findOne({ slug: id });
    }

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }
    return NextResponse.json(service);
  } catch (error: any) {
    console.error("GET /api/services/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch service" }, { status: 500 });
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
    const service = await Service.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json(service);
  } catch (error: any) {
    console.error("PUT /api/services/[id] error:", error);
    return NextResponse.json({ error: error?.message || "Failed to update service" }, { status: 500 });
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
    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Service deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/services/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}
