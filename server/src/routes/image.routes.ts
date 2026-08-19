import { Router } from "express";
import { deleteImage, getImage, listImages, uploadImage } from "../controllers/image.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { requirePermission } from "../middleware/rbac.js";
import { PERMISSIONS } from "../constants/roles.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.get("/", listImages);
router.get("/:id", getImage);
router.post(
  "/",
  requireAuth,
  requirePermission(PERMISSIONS.UPLOAD_CONTENT),
  upload.single("image"),
  uploadImage
);
router.delete("/:id", requireAuth, deleteImage);

export default router;
