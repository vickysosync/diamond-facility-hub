import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await verifyAdminRequest(req);
    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }
    return NextResponse.json({
      authenticated: true,
      user: session,
    });
  } catch (error) {
    console.error("Session API error:", error);
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}
