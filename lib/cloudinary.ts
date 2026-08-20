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
