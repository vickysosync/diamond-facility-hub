import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { PortfolioProject } from "@/models";
import { verifyAdminRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");

    const query: any = {};
    if (category && category !== "All") query.category = category;
    if (status && status !== "All") query.status = status;

    const projects = await PortfolioProject.find(query).sort({ sortOrder: 1, createdAt: -1 });
    return NextResponse.json(projects, {
      headers: {
        "Cache-Control": "no-store, max-age=0, must-revalidate",
      },
    });
  } catch (error: any) {
    console.error("GET /api/portfolio error:", error);
    return NextResponse.json({ error: "Failed to fetch portfolio projects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await verifyAdminRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const data = await req.json();
    if (!data.title || !data.slug || !data.category) {
      return NextResponse.json(
        { error: "Title, slug, and category are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const project = await PortfolioProject.create(data);
    return NextResponse.json(project, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/portfolio error:", error);
    return NextResponse.json({ error: error?.message || "Failed to create project" }, { status: 500 });
  }
}
