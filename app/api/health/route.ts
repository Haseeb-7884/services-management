import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";

const MONGOOSE_STATES: Record<number, string> = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

export async function GET() {
  await connectDB().catch(() => undefined);
  return NextResponse.json({
    success: true,
    message: "ok",
    db: MONGOOSE_STATES[mongoose.connection.readyState] ?? "unknown",
  });
}
