import { Router } from "express";
import {
  followUser,
  getProfile,
  getUserContent,
  listFollowers,
  listFollowing,
  unfollowUser,
  updateProfile,
  uploadAvatar,
  uploadCover,
} from "../controllers/user.controller.js";
import { requireAuth, attachUserIfPresent } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.get("/:username", attachUserIfPresent, getProfile);
router.get("/:username/followers", listFollowers);
router.get("/:username/following", listFollowing);
router.get("/:username/content", getUserContent);

router.patch("/me", requireAuth, updateProfile);
router.post("/me/avatar", requireAuth, upload.single("avatar"), uploadAvatar);
router.post("/me/cover", requireAuth, upload.single("cover"), uploadCover);

router.post("/:username/follow", requireAuth, followUser);
router.delete("/:username/follow", requireAuth, unfollowUser);

export default router;
