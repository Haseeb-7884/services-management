import { Router } from "express";
import { createPlan, deletePlan, getPlan, listPlans, updatePlan } from "../controllers/plan.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { requirePermission } from "../middleware/rbac.js";
import { PERMISSIONS } from "../constants/roles.js";

const router = Router();

router.get("/", listPlans);
router.get("/:slug", getPlan);
router.post("/", requireAuth, requirePermission(PERMISSIONS.MANAGE_SUBSCRIPTION_PLANS), createPlan);
router.patch("/:id", requireAuth, requirePermission(PERMISSIONS.MANAGE_SUBSCRIPTION_PLANS), updatePlan);
router.delete("/:id", requireAuth, requirePermission(PERMISSIONS.MANAGE_SUBSCRIPTION_PLANS), deletePlan);

export default router;
