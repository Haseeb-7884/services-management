import type { NextRequest } from "next/server";
import { connectDB } from "../../../../../lib/db";
import { Notification } from "../../../../../lib/models/Notification";
import { ApiError } from "../../../../../lib/ApiError";
import { ok } from "../../../../../lib/ApiResponse";
import { withHandler } from "../../../../../lib/handler";
import { requireAuth } from "../../../../../lib/auth";

type Ctx = { params: Promise<{ id: string }> };

// Every route here hits a live database (and most require auth via
// cookies/headers) - force dynamic so Next.js never tries to execute
// and statically cache any of these at build time. Without this, a
// GET-only handler with no request-specific reads can get silently
// picked up for static optimization and run during `next build`,
// which crashes the whole build if the DB isn't reachable from the
// build environment (e.g. Netlify's build servers).
export const dynamic = "force-dynamic";

export const PATCH = withHandler<Ctx>(async (req: NextRequest, ctx) => {
  await connectDB();
  const user = await requireAuth(req);
  const { id } = await ctx.params;

  const notification = await Notification.findOne({ _id: id, recipient: user.id });
  if (!notification) throw ApiError.notFound("Notification not found");

  notification.read = true;
  await notification.save();
  return ok(notification, "Notification marked as read");
});
