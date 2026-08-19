import { Router } from "express";
import {
  getOrCreateConversation,
  listMessages,
  listMyConversations,
  sendMessage,
} from "../controllers/message.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.get("/", listMyConversations);
router.post("/", getOrCreateConversation);
router.get("/:conversationId/messages", listMessages);
router.post("/:conversationId/messages", sendMessage);

export default router;
