import type { NextRequest } from "next/server";
import { connectDB } from "../../../lib/db";
import { Conversation } from "../../../lib/models/Conversation";
import { User } from "../../../lib/models/User";
import { ApiError } from "../../../lib/ApiError";
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
  const conversations = await Conversation.find({ participants: user.id })
    .populate("participants", "username profile.displayName profile.avatarUrl")
    .populate("lastMessage.sender", "username")
    .sort({ updatedAt: -1 });

  return ok(conversations);
});

export const POST = withHandler(async (req: NextRequest) => {
  await connectDB();
  const user = await requireAuth(req);
  const { username } = await req.json();
  if (!username) throw ApiError.badRequest("username is required");

  const target = await User.findOne({ username: username.toLowerCase() });
  if (!target) throw ApiError.notFound("User not found");
  if (String(target._id) === user.id) throw ApiError.badRequest("You cannot message yourself");

  let conversation = await Conversation.findOne({
    participants: { $all: [user.id, target._id], $size: 2 },
  });

  if (!conversation) {
    conversation = await Conversation.create({ participants: [user.id, target._id] });
  }

  await conversation.populate("participants", "username profile.displayName profile.avatarUrl");
  return ok(conversation);
});
