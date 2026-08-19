import { Router } from "express";
import { createArticle, deleteArticle, getArticle, listArticles } from "../controllers/article.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { requirePermission } from "../middleware/rbac.js";
import { PERMISSIONS } from "../constants/roles.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.get("/", listArticles);
router.get("/:id", getArticle);
router.post(
  "/",
  requireAuth,
  requirePermission(PERMISSIONS.UPLOAD_CONTENT),
  upload.single("cover"),
  createArticle
);
router.delete("/:id", requireAuth, deleteArticle);

export default router;
