import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Industry } from "@/models";
import { verifyAdminRequest } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();
    const industries = await Industry.find().sort({ sortOrder: 1, createdAt: 1 });
    return NextResponse.json(industries);
  } catch (error: any) {
    console.error("GET /api/industries error:", error);
    return NextResponse.json({ error: "Failed to fetch industries" }, { status: 500 });
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
    const industry = await Industry.create(data);
    return NextResponse.json(industry, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/industries error:", error);
    return NextResponse.json({ error: error?.message || "Failed to create industry" }, { status: 500 });
  }
}
