import { Router } from "express";
import { getDashboardStats, listMyContent } from "../controllers/dashboard.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { requirePermission } from "../middleware/rbac.js";
import { PERMISSIONS } from "../constants/roles.js";

const router = Router();

router.use(requireAuth, requirePermission(PERMISSIONS.ACCESS_CREATOR_DASHBOARD));

router.get("/stats", getDashboardStats);
router.get("/content", listMyContent);

export default router;
