import type { NextRequest } from "next/server";
import { connectDB } from "../../../lib/db";
import { Notification } from "../../../lib/models/Notification";
import { ok } from "../../../lib/ApiResponse";
import { withHandler } from "../../../lib/handler";
import { requireAuth } from "../../../lib/auth";

// Every route here hits a live database (and most require auth via
// cookies/headers) - force dynamic so Next.js never tries to execute
// and statically cache any of these at build time. Without this, a
// GET-only handler with no request-specific reads can get silently
// picked up for static optimization and run during `next build`,
// which crashes the whole build if the DB isn't reachable from the
// build environment (e.g. Netlify's build servers).
export const dynamic = "force-dynamic";

export const GET = withHandler(async (req: NextRequest) => {
  await connectDB();
  const user = await requireAuth(req);
  const sp = req.nextUrl.searchParams;
  const pageNum = Math.max(1, Number(sp.get("page") ?? "1"));
  const limitNum = Math.min(50, Math.max(1, Number(sp.get("limit") ?? "20")));

  const [items, total, unreadCount] = await Promise.all([
    Notification.find({ recipient: user.id })
      .populate("actor", "username profile.displayName profile.avatarUrl")
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Notification.countDocuments({ recipient: user.id }),
    Notification.countDocuments({ recipient: user.id, read: false }),
  ]);

  return ok({ items, total, unreadCount, page: pageNum, pages: Math.ceil(total / limitNum) });
});
