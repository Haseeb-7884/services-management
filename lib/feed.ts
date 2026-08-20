const OWNER_SELECT = "username profile.displayName profile.avatarUrl";

export type MergedItem = {
  id: string;
  type: "video" | "short" | "image" | "article";
  title: string;
  excerpt?: string;
  thumbnailUrl: string;
  durationSec?: number;
  owner: unknown;
  createdAt: Date;
  views: number;
  likesCount: number;
  commentsCount: number;
};

export function mapVideo(v: any): MergedItem {
  return {
    id: String(v._id),
    type: v.isShort ? "short" : "video",
    title: v.title,
    excerpt: v.description,
    thumbnailUrl: v.thumbnailUrl,
    durationSec: v.durationSec,
    owner: v.owner,
    createdAt: v.createdAt,
    views: v.views,
    likesCount: v.likesCount,
    commentsCount: v.commentsCount,
  };
}
export function mapImage(i: any): MergedItem {
  return {
    id: String(i._id),
    type: "image",
    title: i.caption || "",
    thumbnailUrl: i.url,
    owner: i.owner,
    createdAt: i.createdAt,
    views: i.views,
    likesCount: i.likesCount,
    commentsCount: i.commentsCount,
  };
}
export function mapArticle(a: any): MergedItem {
  return {
    id: String(a._id),
    type: "article",
    title: a.title,
    excerpt: a.excerpt,
    thumbnailUrl: a.coverImageUrl,
    owner: a.owner,
    createdAt: a.createdAt,
    views: a.views,
    likesCount: a.likesCount,
    commentsCount: a.commentsCount,
  };
}

export { OWNER_SELECT };
