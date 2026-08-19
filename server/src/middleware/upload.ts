import multer from "multer";
import fs from "node:fs";
import path from "node:path";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      /** Set by upload.ts's fileFilter when a file is silently dropped for
       *  having an unsupported mimetype, so controllers can report a real
       *  error instead of a generic "no file uploaded". */
      fileValidationError?: string;
    }
  }
}

const uploadDir = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-matroska", // .mkv (mimetype reported by most Linux/Chromium builds)
  "video/matroska", // .mkv (mimetype some Windows/browser combos report instead)
]);

export const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB ceiling; tighten per-role in controller
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      // IMPORTANT: don't cb(new Error(...)) here. Rejecting mid-stream that
      // way makes multer tear down the request immediately, which - on a
      // large multipart body still being uploaded - looks like a dropped
      // connection to the browser (axios reports it as "no response at
      // all", not a clean 4xx). Silently skip the file instead and let the
      // controller's `if (!req.file)` check produce a real error response.
      req.fileValidationError = `Unsupported file type: ${file.mimetype || "unknown"}. Allowed: JPG, PNG, WEBP, GIF, MP4, WEBM, MOV, MKV.`;
      cb(null, false);
      return;
    }
    cb(null, true);
  },
});
