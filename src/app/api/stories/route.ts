import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDb } from "@/lib/db";
import { Story, type StoryDocument } from "@/lib/models";
import { getSession } from "@/lib/auth";

const allowedCategories = ["Community", "Events", "Local News", "Opinion"];
const allowedStatuses = ["draft", "published", "pending"];

export async function GET() {
  try {
    await connectDb();
    const session = await getSession();
    const filter = session ? { $or: [{ status: "published" as const }, { author: new mongoose.Types.ObjectId(session.id) }] } : { status: "published" as const };
    const stories = await Story.find(filter).populate("author", "name email").sort({ createdAt: -1 }).limit(60).lean();
    return NextResponse.json({ stories });
  } catch { return NextResponse.json({ error: "Unable to load stories." }, { status: 500 }); }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Sign in to share a story." }, { status: 401 });
    await connectDb();
    const body = await request.json();
    const title = String(body.title || "").trim(); const excerpt = String(body.excerpt || "").trim(); const content = String(body.content || "").trim();
    const category = String(body.category || "Community"); const requestedStatus = String(body.status || "pending");
    if (title.length < 5 || excerpt.length < 20 || content.length < 30 || !allowedCategories.includes(category) || !allowedStatuses.includes(requestedStatus)) return NextResponse.json({ error: "Please complete every field with valid content." }, { status: 400 });
    const status = session.role === "admin" ? requestedStatus as StoryDocument["status"] : requestedStatus === "draft" ? "draft" : "pending";
    const story = await Story.create({ title, excerpt, content, category: category as StoryDocument["category"], status, author: new mongoose.Types.ObjectId(session.id) });
    return NextResponse.json({ story }, { status: 201 });
  } catch { return NextResponse.json({ error: "Unable to create story." }, { status: 500 }); }
}
