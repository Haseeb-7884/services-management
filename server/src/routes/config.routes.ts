import { Router } from "express";
import { getBranding, updateBranding, uploadFavicon, uploadLogo } from "../controllers/config.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { requirePermission } from "../middleware/rbac.js";
import { PERMISSIONS } from "../constants/roles.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.get("/branding", getBranding);

router.patch(
  "/branding",
  requireAuth,
  requirePermission(PERMISSIONS.MANAGE_BRANDING),
  updateBranding
);
router.post(
  "/branding/logo",
  requireAuth,
  requirePermission(PERMISSIONS.MANAGE_BRANDING),
  upload.single("logo"),
  uploadLogo
);
router.post(
  "/branding/favicon",
  requireAuth,
  requirePermission(PERMISSIONS.MANAGE_BRANDING),
  upload.single("favicon"),
  uploadFavicon
);

export default router;
