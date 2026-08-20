import type { NextRequest } from "next/server";
import { connectDB } from "../../../../../../../lib/db";
import { ApiError } from "../../../../../../../lib/ApiError";
import { ok } from "../../../../../../../lib/ApiResponse";
import { withHandler } from "../../../../../../../lib/handler";
import { requireAuth } from "../../../../../../../lib/auth";
import { requireRole } from "../../../../../../../lib/rbac";
import { ROLES } from "../../../../../../../lib/constants/roles";
import { assertValidContentType, CONTENT_MODELS } from "../../../../../../../lib/adminHelpers";

type Ctx = { params: Promise<{ type: string; id: string }> };

export const POST = withHandler<Ctx>(async (req: NextRequest, ctx) => {
  await connectDB();
  const authUser = await requireAuth(req);
  requireRole(authUser, ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.OWNER);
  const { type, id } = await ctx.params;
  assertValidContentType(type);
  const { reason } = await req.json().catch(() => ({ reason: undefined }));

  const doc = await CONTENT_MODELS[type].findByIdAndUpdate(id, { status: "rejected", moderationNote: reason ?? "" }, { new: true });
  if (!doc) throw ApiError.notFound(`${type} not found`);

  return ok(doc, "Content rejected");
});
