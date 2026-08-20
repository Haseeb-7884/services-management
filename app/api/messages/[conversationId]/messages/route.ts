import type { NextRequest } from "next/server";
import { connectDB } from "../../../../../lib/db";
import { Conversation } from "../../../../../lib/models/Conversation";
import { Message } from "../../../../../lib/models/Message";
import { ApiError } from "../../../../../lib/ApiError";
import { created, ok } from "../../../../../lib/ApiResponse";
import { withHandler } from "../../../../../lib/handler";
import { requireAuth } from "../../../../../lib/auth";

type Ctx = { params: Promise<{ conversationId: string }> };

// Every route here hits a live database (and most require auth via
// cookies/headers) - force dynamic so Next.js never tries to execute
// and statically cache any of these at build time. Without this, a
// GET-only handler with no request-specific reads can get silently
// picked up for static optimization and run during `next build`,
// which crashes the whole build if the DB isn't reachable from the
// build environment (e.g. Netlify's build servers).
export const dynamic = "force-dynamic";

export const GET = withHandler<Ctx>(async (req: NextRequest, ctx) => {
  await connectDB();
  const user = await requireAuth(req);
  const { conversationId } = await ctx.params;

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) throw ApiError.notFound("Conversation not found");
  if (!conversation.participants.some((p) => String(p) === user.id)) throw ApiError.forbidden();

  const sp = req.nextUrl.searchParams;
  const pageNum = Math.max(1, Number(sp.get("page") ?? "1"));
  const limitNum = Math.min(100, Math.max(1, Number(sp.get("limit") ?? "50")));

  const [items, total] = await Promise.all([
    Message.find({ conversation: conversation._id })
      .populate("sender", "username profile.displayName profile.avatarUrl")
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Message.countDocuments({ conversation: conversation._id }),
  ]);

  await Message.updateMany(
    { conversation: conversation._id, sender: { $ne: user.id }, readBy: { $ne: user.id } },
    { $addToSet: { readBy: user.id } }
  );

  return ok({ items: items.reverse(), total, page: pageNum, pages: Math.ceil(total / limitNum) });
});

export const POST = withHandler<Ctx>(async (req: NextRequest, ctx) => {
  await connectDB();
  const user = await requireAuth(req);
  const { conversationId } = await ctx.params;

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) throw ApiError.notFound("Conversation not found");
  if (!conversation.participants.some((p) => String(p) === user.id)) throw ApiError.forbidden();

  const { body } = await req.json();
  if (!body?.trim()) throw ApiError.badRequest("Message body is required");

  const message = await Message.create({
    conversation: conversation._id,
    sender: user.id,
    body: body.trim(),
    readBy: [user.id],
  });

  conversation.lastMessage = { body: message.body, sender: message.sender, sentAt: new Date() };
  await conversation.save();

  await message.populate("sender", "username profile.displayName profile.avatarUrl");
  return created(message, "Message sent");
});
