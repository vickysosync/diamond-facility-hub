import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Enquiry } from "@/models";
import { verifyAdminRequest } from "@/lib/auth";
import { sendEnquiryNotification } from "@/lib/email";

export async function GET(req: NextRequest) {
  try {
    const session = await verifyAdminRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const service = searchParams.get("service");
    const search = searchParams.get("search");

    const query: any = {};
    if (status && status !== "All") query.status = status;
    if (service && service !== "All") query.service = service;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { enquiryId: { $regex: search, $options: "i" } },
      ];
    }

    const enquiries = await Enquiry.find(query).sort({ createdAt: -1 });
    return NextResponse.json(enquiries);
  } catch (error: any) {
    console.error("GET /api/enquiries error:", error);
    return NextResponse.json({ error: "Failed to fetch enquiries" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const name = (data.name || data.fullName || "").trim();
    if (!name || !data.phone || !data.email || !data.message) {
      return NextResponse.json(
        { error: "Name, phone, email, and message are required" },
        { status: 400 }
      );
    }

    const service = data.service || data.serviceInterest || "General Facility Enquiry";

    await connectToDatabase();

    // Generate unique ID: ENQ-2026-XXXXX
    const count = await Enquiry.countDocuments();
    const enquiryId = `ENQ-2026-${String(count + 1).padStart(5, "0")}`;

    const enquiry = await Enquiry.create({
      enquiryId,
      name,
      company: data.company?.trim() || "",
      phone: data.phone.trim(),
      email: data.email.trim(),
      service,
      message: data.message.trim(),
      status: "New",
    });

    // Send email notification in background (non-blocking)
    sendEnquiryNotification({
      enquiryId: enquiry.enquiryId,
      name: enquiry.name,
      company: enquiry.company,
      phone: enquiry.phone,
      email: enquiry.email,
      service: enquiry.service,
      message: enquiry.message,
    }).catch((err) => console.error("Background email error:", err));

    return NextResponse.json(
      {
        success: true,
        message: "Your enquiry has been received. Our team will contact you shortly.",
        enquiryId: enquiry.enquiryId,
        referenceNumber: enquiry.enquiryId,
        enquiry,
        data: enquiry,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/enquiries error:", error);
    return NextResponse.json({ error: error?.message || "Failed to submit enquiry" }, { status: 500 });
  }
}
