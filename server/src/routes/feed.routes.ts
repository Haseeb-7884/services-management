import { Router } from "express";
import { getFeaturedCreators, getFeed, getPlatformStats, getTrending } from "../controllers/feed.controller.js";

const router = Router();

router.get("/", getFeed);
router.get("/trending", getTrending);
router.get("/creators", getFeaturedCreators);
router.get("/stats", getPlatformStats);

export default router;
