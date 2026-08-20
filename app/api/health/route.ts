import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";

const MONGOOSE_STATES: Record<number, string> = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

// Every route here hits a live database (and most require auth via
// cookies/headers) - force dynamic so Next.js never tries to execute
// and statically cache any of these at build time. Without this, a
// GET-only handler with no request-specific reads can get silently
// picked up for static optimization and run during `next build`,
// which crashes the whole build if the DB isn't reachable from the
// build environment (e.g. Netlify's build servers).
export const dynamic = "force-dynamic";

export async function GET() {
  await connectDB().catch(() => undefined);
  return NextResponse.json({
    success: true,
    message: "ok",
    db: MONGOOSE_STATES[mongoose.connection.readyState] ?? "unknown",
  });
}
