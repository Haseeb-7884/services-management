import { Router } from "express";
import { addComment, deleteComment, listComments, toggleLike } from "../controllers/social.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/likes", requireAuth, toggleLike);

router.get("/comments/:targetType/:targetId", listComments);
router.post("/comments", requireAuth, addComment);
router.delete("/comments/:id", requireAuth, deleteComment);

export default router;
