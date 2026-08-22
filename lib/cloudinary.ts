import { v2 as cloudinary } from "cloudinary";
import { env } from "./env";

if (env.cloudinary.isConfigured) {
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
  });
}

/**
 * IMPORTANT ARCHITECTURE CHANGE from the old Express server: the old
 * uploadLocalFile() saved the file to local disk via multer, then uploaded
 * that local copy to Cloudinary from the server. That doesn't work on
 * Vercel - serverless functions have no writable persistent disk and a
 * request body/execution time ceiling (a multi-hundred-MB video would blow
 * past both). Instead, the browser uploads the file DIRECTLY to Cloudinary
 * using a short-lived signature minted here; our server never touches the
 * file bytes at all. See app/api/uploads/sign/route.ts for the endpoint
 * that calls this, and app/upload/page.tsx for the client-side upload call.
 */
export function signUploadParams(params: Record<string, string | number>) {
  if (!env.cloudinary.isConfigured) {
    throw new Error("Cloudinary is not configured - set CLOUDINARY_* env vars");
  }
  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = { ...params, timestamp };
  const signature = cloudinary.utils.api_sign_request(paramsToSign, env.cloudinary.apiSecret);
  return {
    signature,
    timestamp,
    apiKey: env.cloudinary.apiKey,
    cloudName: env.cloudinary.cloudName,
  };
}

/**
 * Extracts the Cloudinary public_id (including folder prefix, e.g.
 * "platform/videos/abc123") out of a secure_url so it can be deleted.
 * Cloudinary never gives us the public_id back after upload apart from
 * inside the URL itself, and we never stored it separately on the Video/
 * Image/Article documents - it's fully recoverable from the URL as long as
 * no transformation segments were added (we never add any, see
 * api/uploads.ts), so parsing it back out is safe rather than a hack.
 * URL shape: https://res.cloudinary.com/<cloud>/<resource_type>/upload/v<version>/<public_id>.<ext>
 */
function publicIdFromUrl(url: string): string | null {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/);
  return match ? match[1] : null;
}

/**
 * Best-effort delete of the actual asset bytes from Cloudinary storage.
 * Deliberately never throws - if Cloudinary is briefly unreachable we still
 * want the DB record (and therefore the content's visibility on the site)
 * to go away immediately; a failed remote-asset cleanup just leaves an
 * orphaned file in Cloudinary, which is a much smaller problem than a
 * "deleted" item that silently fails to delete at all. Callers should still
 * check the return value if they want to warn an admin about leftovers.
 */
export async function deleteCloudinaryAsset(url: string | undefined | null, resourceType: "video" | "image"): Promise<boolean> {
  if (!url || !env.cloudinary.isConfigured) return false;
  const publicId = publicIdFromUrl(url);
  if (!publicId) return false;
  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType, invalidate: true });
    return result?.result === "ok" || result?.result === "not found";
  } catch (err) {
    console.error(`[cloudinary] failed to delete asset ${publicId}:`, err instanceof Error ? err.message : err);
    return false;
  }
}

/**
 * Derives a thumbnail image URL for a video already uploaded to Cloudinary,
 * with no separate upload or transformation call. Cloudinary generates a
 * frame-capture image on the fly whenever a video delivery URL's file
 * extension is swapped for an image format (jpg/png) - this is standard
 * documented Cloudinary behavior, not a custom transform.
 */
export function deriveVideoThumbnail(url: string): string {
  return url.replace(/\.[a-z0-9]+$/i, ".jpg");
}

export { cloudinary };
