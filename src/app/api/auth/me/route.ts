import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
export async function GET() { const user = await getCurrentUser(); return NextResponse.json({ user: user ? { id: user._id, name: user.name, email: user.email, role: user.role, verified: user.verified } : null }); }
