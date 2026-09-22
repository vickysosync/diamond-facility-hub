import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { QuoteRequest } from "@/models";
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
    
    let quote = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      quote = await QuoteRequest.findById(id);
    }
    if (!quote) {
      quote = await QuoteRequest.findOne({ quoteId: id });
    }

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }
    return NextResponse.json(quote);
  } catch (error: any) {
    console.error("GET /api/quotes/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch quote" }, { status: 500 });
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
    let quote = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      quote = await QuoteRequest.findByIdAndUpdate(id, data, { new: true });
    }
    if (!quote) {
      quote = await QuoteRequest.findOneAndUpdate({ quoteId: id }, data, { new: true });
    }

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    return NextResponse.json(quote);
  } catch (error: any) {
    console.error("PUT /api/quotes/[id] error:", error);
    return NextResponse.json({ error: error?.message || "Failed to update quote" }, { status: 500 });
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
    
    let quote = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      quote = await QuoteRequest.findByIdAndDelete(id);
    }
    if (!quote) {
      quote = await QuoteRequest.findOneAndDelete({ quoteId: id });
    }

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Quote deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/quotes/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete quote" }, { status: 500 });
  }
}
