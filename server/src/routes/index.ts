import { Router } from "express";
import mongoose from "mongoose";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import videoRoutes from "./video.routes.js";
import imageRoutes from "./image.routes.js";
import articleRoutes from "./article.routes.js";
import socialRoutes from "./social.routes.js";
import configRoutes from "./config.routes.js";
import notificationRoutes from "./notification.routes.js";
import messageRoutes from "./message.routes.js";
import planRoutes from "./plan.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import adminRoutes from "./admin.routes.js";
import feedRoutes from "./feed.routes.js";

const router = Router();

const MONGOOSE_STATES: Record<number, string> = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

// Visit http://localhost:5000/api/v1/health directly in a browser to check
// the API is up AND whether it actually has a live MongoDB connection -
// "db": "connected" means Atlas is reachable, anything else means requests
// that hit the database (register, login, uploads...) will fail or hang.
router.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "ok",
    db: MONGOOSE_STATES[mongoose.connection.readyState] ?? "unknown",
  });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/videos", videoRoutes);
router.use("/images", imageRoutes);
router.use("/articles", articleRoutes);
router.use("/social", socialRoutes);
router.use("/config", configRoutes);
router.use("/notifications", notificationRoutes);
router.use("/messages", messageRoutes);
router.use("/plans", planRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/admin", adminRoutes);
router.use("/feed", feedRoutes);

export default router;
