import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { User } from "@/lib/models";
import { hashPassword, validatePassword } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/mailer";
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
    const verificationToken = randomBytes(32).toString("hex");
    const user = await User.create({ name, email, password: await hashPassword(password), verificationToken, verificationExpires: new Date(Date.now() + 86400000) });
    let emailSent = false;
    try {
      emailSent = await sendVerificationEmail(email, verificationToken);
    } catch (error) {
      console.error("Verification email failed", error);
    }
    return NextResponse.json({
      ok: true,
      emailSent,
      message: emailSent
        ? "Account created. Check your email to verify it."
        : "Account created, but the verification email could not be sent. Check the SMTP settings and try again.",
      userId: user._id,
    }, { status: 201 });
  } catch (error) {
    console.error("Registration failed", error);
    return NextResponse.json({ error: "Unable to create account." }, { status: 500 });
  }
}
