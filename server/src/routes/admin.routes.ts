import { Router } from "express";
import {
  approveContent,
  getAdminStats,
  grantCreator,
  listPendingContent,
  listUsers,
  promoteToAdmin,
  rejectContent,
  revokeAdmin,
  revokeCreator,
} from "../controllers/admin.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/rbac.js";
import { ROLES } from "../constants/roles.js";

const router = Router();

router.use(requireAuth);

// Moderator and above can review content.
const canModerate = requireRole(ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.OWNER);
// Admin and above can see the user directory and manage Creator status.
const canManageUsers = requireRole(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.OWNER);
// Only Super Admin/Owner hand out the 5 Admin slots. There is deliberately
// no route to promote/revoke Super Admin itself - Owner is the single,
// fixed top authority (it already carries every Super Admin permission
// and more), not a role that gets assigned to other people.
const canManageAdmins = requireRole(ROLES.SUPER_ADMIN, ROLES.OWNER);

router.get("/stats", canModerate, getAdminStats);

router.get("/users", canManageUsers, listUsers);
router.post("/users/:username/creator", canManageUsers, grantCreator);
router.delete("/users/:username/creator", canManageUsers, revokeCreator);

router.post("/users/:username/admin", canManageAdmins, promoteToAdmin);
router.delete("/users/:username/admin", canManageAdmins, revokeAdmin);

router.get("/content/pending", canModerate, listPendingContent);
router.post("/content/:type/:id/approve", canModerate, approveContent);
router.post("/content/:type/:id/reject", canModerate, rejectContent);

export default router;
