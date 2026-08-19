import type { Request, Response } from "express";
import type { Model } from "mongoose";
import asyncHandler from "express-async-handler";
import { User } from "../models/User.js";
import { Video } from "../models/Video.js";
import { Image } from "../models/Image.js";
import { Article } from "../models/Article.js";
import { ApiError } from "../utils/ApiError.js";
import { ok } from "../utils/ApiResponse.js";
import { ROLES, MAX_ADMIN_SLOTS, type Role } from "../constants/roles.js";

// Typed as Model<any> so TS doesn't try to unify Video's, Image's, and
// Article's distinct inferred schema types when all three are accessed
// through the same lookup map (see social.controller.ts for the same
// pattern with TARGET_MODELS).
const CONTENT_MODELS: Record<"video" | "image" | "article", Model<any>> = {
  video: Video,
  image: Image,
  article: Article,
};
type ContentType = keyof typeof CONTENT_MODELS;

function assertValidContentType(type: string): asserts type is ContentType {
  if (!(type in CONTENT_MODELS)) throw ApiError.badRequest(`Unknown content type: ${type}`);
}

async function findTargetUser(username: string) {
  const target = await User.findOne({ username: username.toLowerCase() });
  if (!target) throw ApiError.notFound("User not found");
  return target;
}

function assertNotOwner(target: { role: Role }) {
  if (target.role === ROLES.OWNER) {
    throw ApiError.forbidden("The Owner account cannot be modified");
  }
}

function assertNotSelf(req: Request, target: { _id: unknown }) {
  if (String(target._id) === req.user!.id) {
    throw ApiError.badRequest("You cannot change your own role");
  }
}

// ---- User directory ----

export const listUsers = asyncHandler(async (req: Request, res: Response) => {
  const { role, search, page = "1", limit = "20" } = req.query as Record<string, string>;
  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(100, Math.max(1, Number(limit)));

  const filter: Record<string, unknown> = {};
  if (role) filter.role = role;
  if (search) {
    filter.$or = [
      { username: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const [items, total] = await Promise.all([
    User.find(filter)
      .select("username email role profile.displayName profile.avatarUrl status createdAt")
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    User.countDocuments(filter),
  ]);

  ok(res, { items, total, page: pageNum, pages: Math.ceil(total / limitNum) });
});

export const getAdminStats = asyncHandler(async (_req: Request, res: Response) => {
  const [totalUsers, adminCount, creatorCount, pendingVideos, pendingImages, pendingArticles] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: ROLES.ADMIN }),
      User.countDocuments({ role: ROLES.CREATOR }),
      Video.countDocuments({ status: "pending" }),
      Image.countDocuments({ status: "pending" }),
      Article.countDocuments({ status: "pending" }),
    ]);

  ok(res, {
    totalUsers,
    adminSlotsUsed: adminCount,
    adminSlotsTotal: MAX_ADMIN_SLOTS,
    totalCreators: creatorCount,
    pendingContentCount: pendingVideos + pendingImages + pendingArticles,
  });
});

// ---- Admin slot management (Super Admin + Owner only) ----

export const promoteToAdmin = asyncHandler(async (req: Request, res: Response) => {
  const target = await findTargetUser(req.params.username);
  assertNotOwner(target);
  assertNotSelf(req, target);

  if (target.role === ROLES.ADMIN) throw ApiError.conflict("This user is already an Admin");
  if (target.role === ROLES.SUPER_ADMIN) {
    throw ApiError.badRequest("This user is a Super Admin - revoke that first if you want to reassign them");
  }

  const currentAdminCount = await User.countDocuments({ role: ROLES.ADMIN });
  if (currentAdminCount >= MAX_ADMIN_SLOTS) {
    throw ApiError.conflict(
      `All ${MAX_ADMIN_SLOTS} Admin slots are filled. Revoke one before assigning another.`
    );
  }

  target.previousRole = target.role;
  target.role = ROLES.ADMIN;
  await target.save();

  ok(res, target, `${target.username} is now an Admin`);
});

export const revokeAdmin = asyncHandler(async (req: Request, res: Response) => {
  const target = await findTargetUser(req.params.username);
  assertNotSelf(req, target);

  if (target.role !== ROLES.ADMIN) throw ApiError.badRequest("This user is not currently an Admin");

  // The Admin slot is a role, not a possession - the moderation queue and
  // pending-content state are global, not owned by whoever held the slot,
  // so freeing it here never loses anything for whoever gets it next.
  target.role = target.previousRole ?? ROLES.CREATOR;
  target.previousRole = null;
  await target.save();

  ok(res, target, `Admin access revoked from ${target.username}`);
});

// ---- Creator status (Admin, Super Admin, Owner) ----

export const grantCreator = asyncHandler(async (req: Request, res: Response) => {
  const target = await findTargetUser(req.params.username);
  assertNotOwner(target);

  const elevatedRoles: Role[] = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MODERATOR];
  if (elevatedRoles.includes(target.role as Role)) {
    throw ApiError.badRequest("This user already has access above Creator level");
  }
  if (target.role === ROLES.CREATOR) throw ApiError.conflict("This user is already a Creator");

  target.role = ROLES.CREATOR;
  await target.save();

  ok(res, target, `${target.username} is now a Creator`);
});

export const revokeCreator = asyncHandler(async (req: Request, res: Response) => {
  const target = await findTargetUser(req.params.username);

  if (target.role !== ROLES.CREATOR) throw ApiError.badRequest("This user is not currently a Creator");

  target.role = ROLES.STANDARD;
  await target.save();

  ok(res, target, `Creator status revoked from ${target.username}`);
});

// ---- Content moderation queue ----

export const listPendingContent = asyncHandler(async (req: Request, res: Response) => {
  const { type = "all", page = "1", limit = "20" } = req.query as Record<string, string>;
  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(60, Math.max(1, Number(limit)));

  const wantsVideos = type === "all" || type === "video";
  const wantsImages = type === "all" || type === "image";
  const wantsArticles = type === "all" || type === "article";

  const [videos, images, articles] = await Promise.all([
    wantsVideos
      ? Video.find({ status: "pending" }).populate("owner", "username profile.displayName").sort({ createdAt: -1 })
      : [],
    wantsImages
      ? Image.find({ status: "pending" }).populate("owner", "username profile.displayName").sort({ createdAt: -1 })
      : [],
    wantsArticles
      ? Article.find({ status: "pending" }).populate("owner", "username profile.displayName").sort({ createdAt: -1 })
      : [],
  ]);

  const items = [
    ...videos.map((v) => ({
      id: String(v._id),
      contentType: "video" as const,
      title: v.title,
      thumbnailUrl: v.thumbnailUrl,
      owner: v.owner,
      createdAt: v.createdAt,
    })),
    ...images.map((i) => ({
      id: String(i._id),
      contentType: "image" as const,
      title: i.caption || "",
      thumbnailUrl: i.url,
      owner: i.owner,
      createdAt: i.createdAt,
    })),
    ...articles.map((a) => ({
      id: String(a._id),
      contentType: "article" as const,
      title: a.title,
      thumbnailUrl: a.coverImageUrl,
      owner: a.owner,
      createdAt: a.createdAt,
    })),
  ].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); // oldest first - first in, first reviewed

  const total = items.length;
  const paged = items.slice((pageNum - 1) * limitNum, pageNum * limitNum);

  ok(res, { items: paged, total, page: pageNum, pages: Math.ceil(total / limitNum) });
});

export const approveContent = asyncHandler(async (req: Request, res: Response) => {
  const { type, id } = req.params;
  assertValidContentType(type);

  const doc = await CONTENT_MODELS[type].findByIdAndUpdate(
    id,
    { status: "approved", moderationNote: "" },
    { new: true }
  );
  if (!doc) throw ApiError.notFound(`${type} not found`);

  ok(res, doc, "Content approved");
});

export const rejectContent = asyncHandler(async (req: Request, res: Response) => {
  const { type, id } = req.params;
  assertValidContentType(type);
  const { reason } = req.body as { reason?: string };

  const doc = await CONTENT_MODELS[type].findByIdAndUpdate(
    id,
    { status: "rejected", moderationNote: reason ?? "" },
    { new: true }
  );
  if (!doc) throw ApiError.notFound(`${type} not found`);

  ok(res, doc, "Content rejected");
});
