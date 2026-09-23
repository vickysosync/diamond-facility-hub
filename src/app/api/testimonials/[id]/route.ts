import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Testimonial } from "@/models";
import { verifyAdminRequest } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }
    return NextResponse.json(testimonial);
  } catch (error: any) {
    console.error("GET /api/testimonials/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch testimonial" }, { status: 500 });
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

    const updatePayload: any = { ...data };
    if (data.content && !data.review) updatePayload.review = data.content;
    if (data.review && !data.content) updatePayload.content = data.review;
    if (data.avatar && !data.image) updatePayload.image = data.avatar;
    if (data.image && !data.avatar) updatePayload.avatar = data.image;

    await connectToDatabase();
    const testimonial = await Testimonial.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    });

    if (!testimonial) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }

    return NextResponse.json(testimonial);
  } catch (error: any) {
    console.error("PUT /api/testimonials/[id] error:", error);
    return NextResponse.json({ error: error?.message || "Failed to update testimonial" }, { status: 500 });
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
    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Testimonial deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/testimonials/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 });
  }
}
