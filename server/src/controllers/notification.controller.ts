import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Notification } from "../models/Notification.js";
import { ApiError } from "../utils/ApiError.js";
import { ok } from "../utils/ApiResponse.js";

export const listMyNotifications = asyncHandler(async (req: Request, res: Response) => {
  const { page = "1", limit = "20" } = req.query as Record<string, string>;
  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(50, Math.max(1, Number(limit)));

  const [items, total, unreadCount] = await Promise.all([
    Notification.find({ recipient: req.user!.id })
      .populate("actor", "username profile.displayName profile.avatarUrl")
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Notification.countDocuments({ recipient: req.user!.id }),
    Notification.countDocuments({ recipient: req.user!.id, read: false }),
  ]);

  ok(res, { items, total, unreadCount, page: pageNum, pages: Math.ceil(total / limitNum) });
});

export const markNotificationRead = asyncHandler(async (req: Request, res: Response) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    recipient: req.user!.id,
  });
  if (!notification) throw ApiError.notFound("Notification not found");

  notification.read = true;
  await notification.save();
  ok(res, notification, "Notification marked as read");
});

export const markAllNotificationsRead = asyncHandler(async (req: Request, res: Response) => {
  await Notification.updateMany(
    { recipient: req.user!.id, read: false },
    { $set: { read: true } }
  );
  ok(res, null, "All notifications marked as read");
});
