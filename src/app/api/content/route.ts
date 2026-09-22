import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { WebsiteContent } from "@/models";
import { verifyAdminRequest } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();
    let content = await WebsiteContent.findOne();
    if (!content) {
      content = await WebsiteContent.create({});
    }
    return NextResponse.json(content);
  } catch (error: any) {
    console.error("GET /api/content error:", error);
    return NextResponse.json({ error: "Failed to fetch website content" }, { status: 500 });
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
    
    let content = await WebsiteContent.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
    });

    return NextResponse.json(content);
  } catch (error: any) {
    console.error("PUT /api/content error:", error);
    return NextResponse.json({ error: error?.message || "Failed to update website content" }, { status: 500 });
  }
}
