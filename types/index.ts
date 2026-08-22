export type Role =
  | "owner"
  | "super_admin"
  | "admin"
  | "moderator"
  | "creator"
  | "premium"
  | "standard";

export interface User {
  _id: string;
  username: string;
  email: string;
  role: Role;
  profile: {
    displayName?: string;
    avatarUrl?: string;
    coverUrl?: string;
    bio?: string;
    tagline?: string;
    category?: string;
    socialLinks?: {
      website?: string;
      twitter?: string;
      instagram?: string;
      youtube?: string;
    };
  };
  followersCount: number;
  followingCount: number;
  isFollowedByViewer?: boolean;
  isEmailVerified: boolean;
  status: "active" | "suspended" | "banned";
  createdAt: string;
}

export interface VideoItem {
  _id: string;
  owner: Pick<User, "_id" | "username" | "profile">;
  title: string;
  description?: string;
  url: string;
  thumbnailUrl?: string;
  durationSec?: number;
  category: string;
  tags: string[];
  isShort: boolean;
  views: number;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
}

export interface ImageItem {
  _id: string;
  owner: Pick<User, "_id" | "username" | "profile">;
  caption?: string;
  url: string;
  category: string;
  tags: string[];
  views: number;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
}

export interface ArticleItem {
  _id: string;
  owner: Pick<User, "_id" | "username" | "profile">;
  title: string;
  excerpt?: string;
  body: string;
  coverImageUrl?: string;
  category: string;
  tags: string[];
  views: number;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
}

export interface CommentItem {
  _id: string;
  author: Pick<User, "_id" | "username" | "profile">;
  targetType: "Video" | "Image" | "Article";
  targetId: string;
  body: string;
  parentComment: string | null;
  createdAt: string;
}

export interface FeedItem {
  id: string;
  type: "video" | "short" | "image" | "article";
  title: string;
  excerpt?: string;
  thumbnailUrl: string;
  durationSec?: number;
  owner: Pick<User, "username" | "profile">;
  createdAt: string;
  views: number;
  likesCount: number;
  commentsCount: number;
}

export interface FeaturedCreator {
  _id: string;
  username: string;
  role: Role;
  profile: { displayName?: string; avatarUrl?: string };
  followersCount: number;
}

export interface PlatformStats {
  totalUsers: number;
  activeCreators: number;
  contentPublished: number;
  totalViews: number;
}

export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface PlanItem {
  _id: string;
  name: string;
  slug: string;
  monthly: number;
  yearly: number;
  description: string;
  features: PlanFeature[];
  cta: string;
  highlight: boolean;
  badge?: string;
  order: number;
  isActive: boolean;
}

export interface DashboardContentItem {
  id: string;
  title: string;
  thumbnailUrl: string;
  type: "Video" | "Image" | "Article";
  status: "pending" | "approved" | "rejected";
  views: number;
  likesCount?: number;
  createdAt: string;
}

export interface DashboardStatsResponse {
  stats: {
    totalViews: number;
    followers: number;
    totalLikes: number;
    contentCount: number;
  };
  content: DashboardContentItem[];
}

export interface FollowerItem {
  _id: string;
  username: string;
  profile: { displayName?: string; avatarUrl?: string };
  followedAt: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
}

export interface Branding {
  siteName: string;
  logoUrl: string;
  faviconUrl: string;
  theme: {
    colors: {
      primary: string;
      secondary: string;
      backgroundStart: string;
      backgroundEnd: string;
      textPrimary: string;
      textMuted: string;
    };
    fontFamily: string;
  };
  homepageLayout: string[];
  footer: { text: string; links: { label: string; url: string }[] };
  seoDefaults: { metaTitle: string; metaDescription: string; ogImageUrl: string };
}

export interface ChannelContentItem {
  id: string;
  contentType: "video" | "short" | "image" | "article";
  title: string;
  thumbnailUrl: string;
  views: number;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
}

export interface NotificationItem {
  _id: string;
  recipient: string;
  actor: Pick<User, "_id" | "username" | "profile">;
  type: "follow" | "like" | "comment";
  targetType?: "Video" | "Image" | "Article" | "Comment" | null;
  targetId?: string | null;
  read: boolean;
  createdAt: string;
}

export interface Conversation {
  _id: string;
  participants: Pick<User, "_id" | "username" | "profile">[];
  lastMessage?: {
    body: string;
    sender: string | Pick<User, "_id" | "username">;
    sentAt: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

export interface MessageItem {
  _id: string;
  conversation: string;
  sender: Pick<User, "_id" | "username" | "profile">;
  body: string;
  readBy: string[];
  createdAt: string;
}

export interface AdminUserRow {
  _id: string;
  username: string;
  email: string;
  role: Role;
  profile: { displayName?: string; avatarUrl?: string };
  status: "active" | "suspended" | "banned";
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  adminSlotsUsed: number;
  adminSlotsTotal: number;
  totalCreators: number;
  pendingContentCount: number;
}

export interface PendingContentItem {
  id: string;
  contentType: "video" | "image" | "article";
  title: string;
  thumbnailUrl: string;
  owner: Pick<User, "username" | "profile">;
  createdAt: string;
}

export interface AdminContentItem {
  id: string;
  contentType: "video" | "image" | "article";
  title: string;
  thumbnailUrl: string;
  status: "pending" | "approved" | "rejected";
  views: number;
  owner: Pick<User, "username" | "profile">;
  createdAt: string;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}
