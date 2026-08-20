import type { NextRequest } from "next/server";
import { connectDB } from "../../../../lib/db";
import { User } from "../../../../lib/models/User";
import { ok } from "../../../../lib/ApiResponse";
import { withHandler } from "../../../../lib/handler";
import { requireAuth } from "../../../../lib/auth";
import { requireRole } from "../../../../lib/rbac";
import { ROLES } from "../../../../lib/constants/roles";

export const GET = withHandler(async (req: NextRequest) => {
  await connectDB();
  const authUser = await requireAuth(req);
  requireRole(authUser, ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.OWNER);

  const sp = req.nextUrl.searchParams;
  const role = sp.get("role") ?? undefined;
  const search = sp.get("search") ?? undefined;
  const pageNum = Math.max(1, Number(sp.get("page") ?? "1"));
  const limitNum = Math.min(100, Math.max(1, Number(sp.get("limit") ?? "20")));

  const filter: Record<string, unknown> = {};
  if (role) filter.role = role;
  if (search) {
    filter.$or = [
      { username: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const [items, total] = await Promise.all([
    User.find(filter)
      .select("username email role profile.displayName profile.avatarUrl status createdAt")
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    User.countDocuments(filter),
  ]);

  return ok({ items, total, page: pageNum, pages: Math.ceil(total / limitNum) });
});
