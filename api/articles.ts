import { api } from "./client";
import { uploadToCloudinary } from "./uploads";
import type { ApiEnvelope, ArticleItem, Paginated } from "@/types";

export async function fetchArticles(params: { category?: string; tag?: string; search?: string; page?: number }) {
  const { data } = await api.get<ApiEnvelope<Paginated<ArticleItem>>>("/articles", { params });
  return data.data;
}

export async function fetchArticle(id: string) {
  const { data } = await api.get<ApiEnvelope<ArticleItem>>(`/articles/${id}`);
  return data.data;
}

export async function createArticle(payload: {
  title: string;
  excerpt?: string;
  body: string;
  category?: string;
  tags?: string;
  cover?: File | null;
}) {
  let coverImageUrl: string | undefined;
  if (payload.cover) {
    const { url } = await uploadToCloudinary(payload.cover, "articles");
    coverImageUrl = url;
  }

  const { data } = await api.post<ApiEnvelope<ArticleItem>>("/articles", {
    title: payload.title,
    excerpt: payload.excerpt,
    body: payload.body,
    category: payload.category,
    tags: payload.tags,
    coverImageUrl,
  });
  return data.data;
}

export async function deleteArticle(id: string) {
  await api.delete(`/articles/${id}`);
}
