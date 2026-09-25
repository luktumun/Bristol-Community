import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { User } from "@/lib/models";
import { createSession, verifyPassword } from "@/lib/auth";
export async function POST(request: Request) { try { const { email, password } = await request.json(); await connectDb(); const user = await User.findOne({ email: String(email || "").toLowerCase().trim() }); if (!user || !(await verifyPassword(String(password || ""), user.password))) return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 }); if (!user.verified) return NextResponse.json({ error: "Please verify your email before signing in." }, { status: 403 }); return createSession(user); } catch { return NextResponse.json({ error: "Unable to sign in." }, { status: 500 }); } }
