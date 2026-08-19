import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Conversation } from "../models/Conversation.js";
import { Message } from "../models/Message.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { created, ok } from "../utils/ApiResponse.js";

export const listMyConversations = asyncHandler(async (req: Request, res: Response) => {
  const conversations = await Conversation.find({ participants: req.user!.id })
    .populate("participants", "username profile.displayName profile.avatarUrl")
    .populate("lastMessage.sender", "username")
    .sort({ updatedAt: -1 });

  ok(res, conversations);
});

export const getOrCreateConversation = asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.body as { username: string };
  if (!username) throw ApiError.badRequest("username is required");

  const target = await User.findOne({ username: username.toLowerCase() });
  if (!target) throw ApiError.notFound("User not found");
  if (String(target._id) === req.user!.id) {
    throw ApiError.badRequest("You cannot message yourself");
  }

  let conversation = await Conversation.findOne({
    participants: { $all: [req.user!.id, target._id], $size: 2 },
  });

  if (!conversation) {
    conversation = await Conversation.create({ participants: [req.user!.id, target._id] });
  }

  await conversation.populate("participants", "username profile.displayName profile.avatarUrl");
  ok(res, conversation);
});

export const listMessages = asyncHandler(async (req: Request, res: Response) => {
  const conversation = await Conversation.findById(req.params.conversationId);
  if (!conversation) throw ApiError.notFound("Conversation not found");
  if (!conversation.participants.some((p) => String(p) === req.user!.id)) {
    throw ApiError.forbidden();
  }

  const { page = "1", limit = "50" } = req.query as Record<string, string>;
  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(100, Math.max(1, Number(limit)));

  const [items, total] = await Promise.all([
    Message.find({ conversation: conversation._id })
      .populate("sender", "username profile.displayName profile.avatarUrl")
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Message.countDocuments({ conversation: conversation._id }),
  ]);

  await Message.updateMany(
    { conversation: conversation._id, sender: { $ne: req.user!.id }, readBy: { $ne: req.user!.id } },
    { $addToSet: { readBy: req.user!.id } }
  );

  ok(res, { items: items.reverse(), total, page: pageNum, pages: Math.ceil(total / limitNum) });
});

export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  const conversation = await Conversation.findById(req.params.conversationId);
  if (!conversation) throw ApiError.notFound("Conversation not found");
  if (!conversation.participants.some((p) => String(p) === req.user!.id)) {
    throw ApiError.forbidden();
  }

  const { body } = req.body as { body: string };
  if (!body?.trim()) throw ApiError.badRequest("Message body is required");

  const message = await Message.create({
    conversation: conversation._id,
    sender: req.user!.id,
    body: body.trim(),
    readBy: [req.user!.id],
  });

  conversation.lastMessage = {
    body: message.body,
    sender: message.sender,
    sentAt: new Date(),
  };
  await conversation.save();

  await message.populate("sender", "username profile.displayName profile.avatarUrl");
  created(res, message, "Message sent");
});
