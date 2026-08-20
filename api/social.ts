import { api } from "./client";
import type { ApiEnvelope, CommentItem } from "@/types";

export async function toggleLike(targetType: "Video" | "Image" | "Article", targetId: string) {
  const { data } = await api.post<ApiEnvelope<{ liked: boolean }>>("/social/likes", { targetType, targetId });
  return data.data;
}

export async function fetchComments(targetType: "Video" | "Image" | "Article", targetId: string) {
  const { data } = await api.get<ApiEnvelope<CommentItem[]>>(`/social/comments/${targetType}/${targetId}`);
  return data.data;
}

export async function addComment(payload: {
  targetType: "Video" | "Image" | "Article";
  targetId: string;
  body: string;
  parentComment?: string;
}) {
  const { data } = await api.post<ApiEnvelope<CommentItem>>("/social/comments", payload);
  return data.data;
}
