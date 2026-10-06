import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { User } from "@/lib/models";
import { createSession, hashPassword, validatePassword } from "@/lib/auth";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = body.password;
    if (name.length < 2 || !email.includes("@") || !validatePassword(password)) {
      return NextResponse.json({ error: "Use a valid name, email, and password of at least 8 characters." }, { status: 400 });
    }
    await connectDb();
    if (await User.exists({ email })) return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
    const user = await User.create({ name, email, password: await hashPassword(password), verified: true });
    const session = await createSession(user);
    const sessionBody = await session.json();
    return NextResponse.json({
      ...sessionBody,
      user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role, verified: user.verified },
    }, { status: 201, headers: session.headers });
  } catch (error) {
    console.error("Registration failed", error);
    return NextResponse.json({ error: "Unable to create account." }, { status: 500 });
  }
}
