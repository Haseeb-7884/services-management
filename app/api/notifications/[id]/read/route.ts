import type { NextRequest } from "next/server";
import { connectDB } from "../../../../../lib/db";
import { Notification } from "../../../../../lib/models/Notification";
import { ApiError } from "../../../../../lib/ApiError";
import { ok } from "../../../../../lib/ApiResponse";
import { withHandler } from "../../../../../lib/handler";
import { requireAuth } from "../../../../../lib/auth";

type Ctx = { params: Promise<{ id: string }> };

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
