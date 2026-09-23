import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const session = await verifyAdminRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "diamond_facility";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadToCloudinary(buffer, folder);

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      secure_url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
    });
  } catch (error: any) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { error: error?.message || "Image upload to Cloudinary failed" },
      { status: 500 }
    );
  }
}
