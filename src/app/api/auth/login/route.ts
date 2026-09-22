import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Admin } from "@/models";
import { comparePassword, createSessionToken, hashPassword, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const normalizedEmail = email.trim().toLowerCase();
    let admin = await Admin.findOne({ email: normalizedEmail });

    // Auto-bootstrap default admin if none exists in DB
    if (!admin && normalizedEmail === (process.env.ADMIN_EMAIL || "admin@diamondifs.com").toLowerCase()) {
      const defaultPassword = process.env.ADMIN_PASSWORD || "admin123";
      if (password === defaultPassword) {
        const passwordHash = await hashPassword(defaultPassword);
        admin = await Admin.create({
          email: normalizedEmail,
          passwordHash,
          name: "Director Umesh Patil",
          role: "superadmin",
        });
      }
    }

    if (!admin) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isValid = await comparePassword(password, admin.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Update lastLogin
    admin.lastLogin = new Date();
    await admin.save();

    const sessionToken = await createSessionToken({
      userId: admin._id.toString(),
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: admin._id.toString(),
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}
