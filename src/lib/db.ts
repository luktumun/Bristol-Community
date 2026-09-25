import mongoose from "mongoose";
type Cached = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
const globalWithMongo = globalThis as typeof globalThis & { __mongoose?: Cached };
const cached = globalWithMongo.__mongoose ?? { conn: null, promise: null };
globalWithMongo.__mongoose = cached;
export async function connectDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not configured.");
  if (cached.conn) return cached.conn;
  if (!cached.promise) cached.promise = mongoose.connect(uri, { bufferCommands: false });
  cached.conn = await cached.promise;
  return cached.conn;
}
