import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDb } from "@/lib/db";
import { Story } from "@/lib/models";
import { getSession } from "@/lib/auth";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession(); if (!session) return NextResponse.json({ error: "Sign in to edit a story." }, { status: 401 });
    const { id } = await context.params; if (!mongoose.isValidObjectId(id)) return NextResponse.json({ error: "Invalid story." }, { status: 400 });
    await connectDb(); const story = await Story.findById(id); if (!story) return NextResponse.json({ error: "Story not found." }, { status: 404 });
    if (session.role !== "admin" && story.author.toString() !== session.id) return NextResponse.json({ error: "You can only edit your own stories." }, { status: 403 });
    const body = await request.json(); const updates = { title: String(body.title || "").trim(), excerpt: String(body.excerpt || "").trim(), content: String(body.content || "").trim(), category: body.category, status: session.role === "admin" ? body.status : body.status === "draft" ? "draft" : "pending" };
    if (updates.title.length < 5 || updates.excerpt.length < 20 || updates.content.length < 30) return NextResponse.json({ error: "Please complete every field with valid content." }, { status: 400 });
    Object.assign(story, updates); await story.save(); return NextResponse.json({ story });
  } catch { return NextResponse.json({ error: "Unable to update story." }, { status: 500 }); }
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession(); if (!session) return NextResponse.json({ error: "Sign in to delete a story." }, { status: 401 });
    const { id } = await context.params; if (!mongoose.isValidObjectId(id)) return NextResponse.json({ error: "Invalid story." }, { status: 400 });
    await connectDb(); const story = await Story.findById(id); if (!story) return NextResponse.json({ error: "Story not found." }, { status: 404 });
    if (session.role !== "admin" && story.author.toString() !== session.id) return NextResponse.json({ error: "You can only delete your own stories." }, { status: 403 });
    await story.deleteOne(); return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "Unable to delete story." }, { status: 500 }); }
}
