import type { NextRequest } from "next/server";
import { connectDB } from "../../../../../lib/db";
import { User } from "../../../../../lib/models/User";
import { ApiError } from "../../../../../lib/ApiError";
import { ok } from "../../../../../lib/ApiResponse";
import { withHandler } from "../../../../../lib/handler";
import { requireAuth } from "../../../../../lib/auth";

export const POST = withHandler(async (req: NextRequest) => {
  await connectDB();
  const authUser = await requireAuth(req);
  const { url } = await req.json();
  if (!url) throw ApiError.badRequest("No file uploaded");

  const user = await User.findByIdAndUpdate(authUser.id, { "profile.coverUrl": url }, { new: true });
  return ok(user, "Cover photo updated");
});
