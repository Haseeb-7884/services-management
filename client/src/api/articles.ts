import { api } from "./client";
import type { ApiEnvelope, ArticleItem, Paginated } from "../types";

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
  const form = new FormData();
  form.append("title", payload.title);
  if (payload.excerpt) form.append("excerpt", payload.excerpt);
  form.append("body", payload.body);
  if (payload.category) form.append("category", payload.category);
  if (payload.tags) form.append("tags", payload.tags);
  if (payload.cover) form.append("cover", payload.cover);

  const { data } = await api.post<ApiEnvelope<ArticleItem>>("/articles", form);
  return data.data;
}

export async function deleteArticle(id: string) {
  await api.delete(`/articles/${id}`);
}
