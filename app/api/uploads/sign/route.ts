import type { NextRequest } from "next/server";
import { withHandler } from "../../../../lib/handler";
import { requireAuth } from "../../../../lib/auth";
import { requirePermission } from "../../../../lib/rbac";
import { PERMISSIONS } from "../../../../lib/constants/roles";
import { signUploadParams } from "../../../../lib/cloudinary";
import { ok } from "../../../../lib/ApiResponse";
import { ApiError } from "../../../../lib/ApiError";

const ALLOWED_FOLDERS = new Set(["videos", "images", "articles", "avatars", "covers"]);

/**
 * Mints a signed, short-lived Cloudinary upload signature so the browser can
 * upload the actual file bytes directly to Cloudinary (bypassing our
 * serverless functions entirely - see lib/cloudinary.ts for why). The
 * client then POSTs the file straight to
 * https://api.cloudinary.com/v1_1/<cloud_name>/<resource_type>/upload
 * using the returned signature/timestamp/apiKey, and finally calls our own
 * /api/videos (or /images, /articles) with the resulting secure_url.
 */
export const POST = withHandler(async (req: NextRequest) => {
  const user = await requireAuth(req);
  requirePermission(user, PERMISSIONS.UPLOAD_CONTENT);

  const { folder } = await req.json();
  if (!ALLOWED_FOLDERS.has(folder)) throw ApiError.badRequest("Invalid upload folder");

  const params = signUploadParams({ folder: `platform/${folder}` });
  return ok(params, "Upload signature issued");
});
