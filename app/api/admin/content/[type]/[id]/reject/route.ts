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

// Every route here hits a live database (and most require auth via
// cookies/headers) - force dynamic so Next.js never tries to execute
// and statically cache any of these at build time. Without this, a
// GET-only handler with no request-specific reads can get silently
// picked up for static optimization and run during `next build`,
// which crashes the whole build if the DB isn't reachable from the
// build environment (e.g. Netlify's build servers).
export const dynamic = "force-dynamic";

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
