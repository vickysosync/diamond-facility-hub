import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Enquiry } from "@/models";
import { verifyAdminRequest } from "@/lib/auth";

export async function GET(
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
    
    let enquiry = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      enquiry = await Enquiry.findById(id);
    }
    if (!enquiry) {
      enquiry = await Enquiry.findOne({ enquiryId: id });
    }

    if (!enquiry) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
    }
    return NextResponse.json(enquiry);
  } catch (error: any) {
    console.error("GET /api/enquiries/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch enquiry" }, { status: 500 });
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
    let enquiry = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      enquiry = await Enquiry.findByIdAndUpdate(id, data, { new: true });
    }
    if (!enquiry) {
      enquiry = await Enquiry.findOneAndUpdate({ enquiryId: id }, data, { new: true });
    }

    if (!enquiry) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
    }

    return NextResponse.json(enquiry);
  } catch (error: any) {
    console.error("PUT /api/enquiries/[id] error:", error);
    return NextResponse.json({ error: error?.message || "Failed to update enquiry" }, { status: 500 });
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
    
    let enquiry = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      enquiry = await Enquiry.findByIdAndDelete(id);
    }
    if (!enquiry) {
      enquiry = await Enquiry.findOneAndDelete({ enquiryId: id });
    }

    if (!enquiry) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Enquiry deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/enquiries/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete enquiry" }, { status: 500 });
  }
}
