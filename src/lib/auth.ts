import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { User } from "@/lib/models";
import mongoose from "mongoose";
const cookieName = "bristol_session";
function getSecret() {
  const secretValue = process.env.JWT_SECRET;
  if (!secretValue || secretValue.length < 32) throw new Error("JWT_SECRET must be at least 32 characters.");
  return new TextEncoder().encode(secretValue);
}
export async function hashPassword(password: string) { return bcrypt.hash(password, 12); }
export async function verifyPassword(password: string, hash: string) { return bcrypt.compare(password, hash); }
export async function createSession(user: { _id: mongoose.Types.ObjectId; role: string }) { const token = await new SignJWT({ role: user.role }).setProtectedHeader({ alg: "HS256" }).setSubject(user._id.toString()).setIssuedAt().setExpirationTime("7d").sign(getSecret()); const response = NextResponse.json({ ok: true }); response.cookies.set(cookieName, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 604800, path: "/" }); return response; }
export async function getSession() { const token = (await cookies()).get(cookieName)?.value; if (!token) return null; try { const { payload } = await jwtVerify(token, getSecret()); return { id: payload.sub as string, role: payload.role as string }; } catch { return null; } }
export async function getCurrentUser() { const session = await getSession(); if (!session) return null; await connectDb(); return User.findById(session.id).select("-password -verificationToken -verificationExpires").lean(); }
export function validatePassword(password: unknown) { return typeof password === "string" && password.length >= 8 && password.length <= 72; }
