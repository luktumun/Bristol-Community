import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { User } from "@/lib/models";
export async function GET(request: Request) { const token = new URL(request.url).searchParams.get("token"); if (!token) return NextResponse.json({ error: "Missing verification token." }, { status: 400 }); await connectDb(); const user = await User.findOne({ verificationToken: token, verificationExpires: { $gt: new Date() } }); if (!user) return NextResponse.json({ error: "This verification link is invalid or expired." }, { status: 400 }); user.verified = true; user.verificationToken = undefined; user.verificationExpires = undefined; await user.save(); return NextResponse.redirect(new URL("/?verified=1", request.url)); }
