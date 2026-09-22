import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Industry } from "@/models";
import { verifyAdminRequest } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();
    
    let industry = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      industry = await Industry.findById(id);
    }
    if (!industry) {
      industry = await Industry.findOne({ slug: id });
    }

    if (!industry) {
      return NextResponse.json({ error: "Industry not found" }, { status: 404 });
    }
    return NextResponse.json(industry);
  } catch (error: any) {
    console.error("GET /api/industries/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch industry" }, { status: 500 });
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
    const industry = await Industry.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!industry) {
      return NextResponse.json({ error: "Industry not found" }, { status: 404 });
    }

    return NextResponse.json(industry);
  } catch (error: any) {
    console.error("PUT /api/industries/[id] error:", error);
    return NextResponse.json({ error: error?.message || "Failed to update industry" }, { status: 500 });
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
    const industry = await Industry.findByIdAndDelete(id);

    if (!industry) {
      return NextResponse.json({ error: "Industry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Industry deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/industries/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete industry" }, { status: 500 });
  }
}
