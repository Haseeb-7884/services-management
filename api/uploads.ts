import { api } from "./client";

// Cloudinary rejects (or silently drops mid-transfer) any single-request
// upload past a plan-dependent size, and free-tier accounts default to
// ~100MB for non-chunked uploads - well under the "up to 500MB" limit this
// app advertises to users. A plain single XHR POST for a large video (or
// any upload over a slow/flaky mobile connection) gets aborted by
// Cloudinary's edge before a proper HTTP response comes back, which the
// browser surfaces as a bare, unhelpful `xhr.onerror` ("network error")
// instead of a real status code. Splitting large files into signed chunks
// (Cloudinary's documented "chunked upload" flow - same signature/timestamp
// reused across chunks, tied together via X-Unique-Upload-Id + Content-Range)
// fixes this properly instead of just enlarging the account's limit, and as
// a bonus each chunk is small enough to retry on its own if a mobile
// connection blips mid-upload.
const CHUNK_SIZE = 20 * 1024 * 1024; // 20MB - Cloudinary's per-chunk cap
const CHUNK_THRESHOLD = 15 * 1024 * 1024; // below this, a single plain request is simpler and just as reliable
const MAX_FILE_SIZE = 500 * 1024 * 1024; // matches the limit shown in the upload UI

type SignedFields = { apiKey: string; timestamp: number; signature: string; folder: string };

function buildForm(fields: SignedFields, filePart: File | Blob, fileName: string): FormData {
  const form = new FormData();
  form.append("file", filePart, fileName);
  form.append("api_key", fields.apiKey);
  form.append("timestamp", String(fields.timestamp));
  form.append("signature", fields.signature);
  form.append("folder", fields.folder);
  return form;
}

function uploadSingle(file: File, uploadUrl: string, fields: SignedFields, onProgress?: (pct: number) => void): Promise<any> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", uploadUrl);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 99));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress?.(100);
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(`Cloudinary upload failed (${xhr.status})`));
      }
    };
    xhr.onerror = () => reject(new Error("Upload failed - check your connection and try again."));
    xhr.send(buildForm(fields, file, file.name));
  });
}

function uploadChunked(file: File, uploadUrl: string, fields: SignedFields, onProgress?: (pct: number) => void): Promise<any> {
  const uploadId = `sgu-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  let uploadedBytes = 0;

  return new Promise((resolve, reject) => {
    const sendChunk = (start: number, retried = false) => {
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", uploadUrl);
      xhr.setRequestHeader("X-Unique-Upload-Id", uploadId);
      xhr.setRequestHeader("Content-Range", `bytes ${start}-${end - 1}/${file.size}`);
      xhr.upload.onprogress = (e) => {
        if (!e.lengthComputable || !onProgress) return;
        onProgress(Math.min(99, Math.round(((uploadedBytes + e.loaded) / file.size) * 100)));
      };
      xhr.onload = () => {
        if (xhr.status < 200 || xhr.status >= 300) {
          reject(new Error(`Upload failed (${xhr.status})`));
          return;
        }
        uploadedBytes = end;
        if (end < file.size) {
          sendChunk(end);
        } else {
          onProgress?.(100);
          resolve(JSON.parse(xhr.responseText));
        }
      };
      xhr.onerror = () => {
        // Mobile connections drop mid-upload far more often than they're
        // actually broken - one silent retry of just this chunk (not the
        // whole file) clears the vast majority of these without bothering
        // the user.
        if (!retried) {
          sendChunk(start, true);
        } else {
          reject(new Error("Upload failed - check your connection and try again."));
        }
      };
      xhr.send(buildForm(fields, chunk, file.name));
    };

    sendChunk(0);
  });
}

/**
 * Uploads a file directly to Cloudinary from the browser (bypassing our own
 * server entirely) using a short-lived signature minted by
 * POST /api/uploads/sign. Replaces the old multer-based flow, which can't
 * work on Vercel (no persistent disk, request-body/time limits that a
 * multi-hundred-MB video would blow past). Returns the resulting
 * `secure_url` so the caller can pass it to the matching create endpoint
 * (POST /api/videos, /api/images, /api/articles, /api/users/me/avatar, etc.)
 */
export async function uploadToCloudinary(
  file: File,
  folder: "videos" | "images" | "articles" | "avatars" | "covers",
  onProgress?: (pct: number) => void
): Promise<{ url: string; durationSec?: number }> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File is too large (${Math.round(file.size / (1024 * 1024))}MB). Max size is 500MB.`);
  }
  if (file.size === 0) {
    throw new Error("This file is empty.");
  }

  const { data } = await api.post("/uploads/sign", { folder });
  const { signature, timestamp, apiKey, cloudName } = data.data;

  const resourceType = folder === "videos" ? "video" : "image";
  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
  const fields: SignedFields = { apiKey, timestamp, signature, folder: `platform/${folder}` };

  const result = file.size > CHUNK_THRESHOLD ? await uploadChunked(file, uploadUrl, fields, onProgress) : await uploadSingle(file, uploadUrl, fields, onProgress);

  return { url: result.secure_url as string, durationSec: result.duration as number | undefined };
}
