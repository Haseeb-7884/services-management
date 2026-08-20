import type { NextRequest } from "next/server";
import { connectDB } from "../../../../lib/db";
import { Notification } from "../../../../lib/models/Notification";
import { ok } from "../../../../lib/ApiResponse";
import { withHandler } from "../../../../lib/handler";
import { requireAuth } from "../../../../lib/auth";

export const PATCH = withHandler(async (req: NextRequest) => {
  await connectDB();
  const user = await requireAuth(req);
  await Notification.updateMany({ recipient: user.id, read: false }, { $set: { read: true } });
  return ok(null, "All notifications marked as read");
});
