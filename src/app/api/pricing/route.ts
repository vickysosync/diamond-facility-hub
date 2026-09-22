import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Pricing } from "@/models";
import { verifyAdminRequest } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();
    const pricing = await Pricing.find().sort({ createdAt: 1 });
    return NextResponse.json(pricing);
  } catch (error: any) {
    console.error("GET /api/pricing error:", error);
    return NextResponse.json({ error: "Failed to fetch pricing rules" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await verifyAdminRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const data = await req.json();
    if (!data.serviceId || !data.name) {
      return NextResponse.json({ error: "serviceId and name are required" }, { status: 400 });
    }

    await connectToDatabase();
    const existing = await Pricing.findOne({ serviceId: data.serviceId });
    if (existing) {
      return NextResponse.json({ error: "Pricing for this serviceId already exists" }, { status: 409 });
    }

    const pricing = await Pricing.create(data);
    return NextResponse.json(pricing, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/pricing error:", error);
    return NextResponse.json({ error: error?.message || "Failed to create pricing rule" }, { status: 500 });
  }
}
