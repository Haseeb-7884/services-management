import { Router } from "express";
import { deleteVideo, getVideo, listVideos, uploadVideo } from "../controllers/video.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { requirePermission } from "../middleware/rbac.js";
import { PERMISSIONS } from "../constants/roles.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.get("/", listVideos);
router.get("/:id", getVideo);
router.post(
  "/",
  requireAuth,
  requirePermission(PERMISSIONS.UPLOAD_CONTENT),
  upload.single("video"),
  uploadVideo
);
router.delete("/:id", requireAuth, deleteVideo);

export default router;
