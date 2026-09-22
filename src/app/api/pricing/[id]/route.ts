import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Pricing } from "@/models";
import { verifyAdminRequest } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();
    
    let rule = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      rule = await Pricing.findById(id);
    }
    if (!rule) {
      rule = await Pricing.findOne({ serviceId: id });
    }

    if (!rule) {
      return NextResponse.json({ error: "Pricing rule not found" }, { status: 404 });
    }
    return NextResponse.json(rule);
  } catch (error: any) {
    console.error("GET /api/pricing/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch pricing rule" }, { status: 500 });
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
    let rule = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      rule = await Pricing.findByIdAndUpdate(id, data, { new: true });
    }
    if (!rule) {
      rule = await Pricing.findOneAndUpdate({ serviceId: id }, data, { new: true });
    }

    if (!rule) {
      return NextResponse.json({ error: "Pricing rule not found" }, { status: 404 });
    }

    return NextResponse.json(rule);
  } catch (error: any) {
    console.error("PUT /api/pricing/[id] error:", error);
    return NextResponse.json({ error: error?.message || "Failed to update pricing rule" }, { status: 500 });
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
    
    let rule = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      rule = await Pricing.findByIdAndDelete(id);
    }
    if (!rule) {
      rule = await Pricing.findOneAndDelete({ serviceId: id });
    }

    if (!rule) {
      return NextResponse.json({ error: "Pricing rule not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Pricing rule deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/pricing/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete pricing rule" }, { status: 500 });
  }
}
