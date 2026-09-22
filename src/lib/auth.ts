import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export const SESSION_COOKIE_NAME = "diamond_admin_session";
const SESSION_SECRET_STRING =
  process.env.SESSION_SECRET || "diamond_facility_session_secret_jwt_2026_super_secure_key_128bit";
const secretKey = new TextEncoder().encode(SESSION_SECRET_STRING);

export interface AdminSessionPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(payload: AdminSessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

export async function verifySessionToken(token: string): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return {
      userId: (payload.userId as string) || (payload.sub as string),
      email: payload.email as string,
      name: payload.name as string,
      role: (payload.role as string) || "admin",
    };
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    if (!sessionCookie?.value) return null;
    return verifySessionToken(sessionCookie.value);
  } catch {
    return null;
  }
}

export async function verifyAdminRequest(req?: NextRequest): Promise<AdminSessionPayload | null> {
  if (req) {
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const verified = await verifySessionToken(token);
      if (verified) return verified;
    }
    const tokenFromCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (tokenFromCookie) {
      const verified = await verifySessionToken(tokenFromCookie);
      if (verified) return verified;
    }
  }
  return getAdminSession();
}
