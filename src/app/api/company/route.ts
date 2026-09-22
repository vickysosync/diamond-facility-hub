import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { CompanySettings } from "@/models";
import { verifyAdminRequest } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();
    let company = await CompanySettings.findOne();
    if (!company) {
      company = await CompanySettings.create({});
    }
    return NextResponse.json(company);
  } catch (error: any) {
    console.error("GET /api/company error:", error);
    return NextResponse.json({ error: "Failed to fetch company settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await verifyAdminRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const data = await req.json();
    await connectToDatabase();
    
    let company = await CompanySettings.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
    });

    return NextResponse.json(company);
  } catch (error: any) {
    console.error("PUT /api/company error:", error);
    return NextResponse.json({ error: error?.message || "Failed to update company settings" }, { status: 500 });
  }
}
