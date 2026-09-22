import { NextRequest, NextResponse } from "next/server";
import { seedDatabase } from "@/lib/seed";
import { verifyAdminRequest } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import { Admin } from "@/models";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const adminCount = await Admin.countDocuments();
    
    // If admins already exist, require authenticated admin session or secret header
    if (adminCount > 0) {
      const session = await verifyAdminRequest(req);
      const secretHeader = req.headers.get("x-seed-secret");
      const isAuthorized = !!session || (process.env.SEED_SECRET && secretHeader === process.env.SEED_SECRET);
      
      if (!isAuthorized) {
        return NextResponse.json(
          { error: "Unauthorized: Admin authentication required to reseed database." },
          { status: 401 }
        );
      }
    }

    const result = await seedDatabase();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Seed API error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to seed database" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const adminCount = await Admin.countDocuments();
    
    if (adminCount > 0) {
      const session = await verifyAdminRequest(req);
      const secretHeader = req.headers.get("x-seed-secret");
      const isAuthorized = !!session || (process.env.SEED_SECRET && secretHeader === process.env.SEED_SECRET);
      
      if (!isAuthorized) {
        return NextResponse.json(
          { error: "Unauthorized: Admin authentication required to inspect or run seed." },
          { status: 401 }
        );
      }
    }

    const result = await seedDatabase();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Seed API error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to seed database" },
      { status: 500 }
    );
  }
}
