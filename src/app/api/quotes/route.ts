import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { QuoteRequest } from "@/models";
import { verifyAdminRequest } from "@/lib/auth";
import { sendQuoteNotification } from "@/lib/email";

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
    if (service && service !== "All") query.selectedServices = service;
    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: "i" } },
        { contactPerson: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { quoteId: { $regex: search, $options: "i" } },
      ];
    }

    const quotes = await QuoteRequest.find(query).sort({ createdAt: -1 });
    return NextResponse.json(quotes);
  } catch (error: any) {
    console.error("GET /api/quotes error:", error);
    return NextResponse.json({ error: "Failed to fetch quotes" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    const contactPerson = data.contactPerson || data.name || data.fullName;
    const companyName = data.companyName || data.company || contactPerson || "Private Client";
    const phone = data.phone;
    const email = data.email;
    
    let selectedServices: string[] = [];
    if (Array.isArray(data.selectedServices) && data.selectedServices.length > 0) {
      selectedServices = data.selectedServices;
    } else if (Array.isArray(data.services) && data.services.length > 0) {
      selectedServices = data.services;
    } else if (data.serviceCategory) {
      selectedServices = [data.serviceCategory];
    } else if (data.service) {
      selectedServices = [data.service];
    }

    if (!contactPerson || !phone || !email) {
      return NextResponse.json(
        { error: "Contact person, phone, and email are required" },
        { status: 400 }
      );
    }

    if (selectedServices.length === 0) {
      selectedServices = ["Security Guard Services"];
    }

    await connectToDatabase();

    // Generate unique ID: DIF-2026-XXXXX
    const count = await QuoteRequest.countDocuments();
    const quoteId = `DIF-2026-${String(count + 1).padStart(5, "0")}`;

    const quote = await QuoteRequest.create({
      quoteId,
      companyName,
      contactPerson,
      phone,
      email,
      facilityType: data.facilityType || "Corporate Office",
      facilitySize: Number(data.facilitySize) || 0,
      selectedServices,
      frequency: data.frequency || "Monthly",
      preferredDate: data.preferredDate || data.date || "",
      city: data.city || "Pune",
      estimatedCost: Number(data.estimatedCost || data.estimatedPrice) || 0,
      notes: data.notes || data.additionalRequirements || "",
      status: "New",
    });

    // Send email alert in background (non-blocking)
    sendQuoteNotification({
      quoteId: quote.quoteId,
      companyName: quote.companyName,
      contactPerson: quote.contactPerson,
      phone: quote.phone,
      email: quote.email,
      facilityType: quote.facilityType,
      facilitySize: quote.facilitySize,
      selectedServices: quote.selectedServices,
      frequency: quote.frequency,
      estimatedCost: quote.estimatedCost,
      preferredDate: quote.preferredDate,
      city: quote.city,
      notes: quote.notes,
    }).catch((err) => console.error("Background quote email error:", err));

    return NextResponse.json(
      {
        success: true,
        message: "Your quote request has been recorded. Our team will contact you shortly.",
        quoteId: quote.quoteId,
        referenceNumber: quote.quoteId,
        quote,
        data: quote,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/quotes error:", error);
    return NextResponse.json({ error: error?.message || "Failed to submit quote request" }, { status: 500 });
  }
}
