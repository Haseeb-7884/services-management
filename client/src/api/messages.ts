import { api } from "./client";
import type { ApiEnvelope, Conversation, MessageItem, Paginated } from "../types";

export async function fetchMyConversations() {
  const { data } = await api.get<ApiEnvelope<Conversation[]>>("/messages");
  return data.data;
}

export async function getOrCreateConversation(username: string) {
  const { data } = await api.post<ApiEnvelope<Conversation>>("/messages", { username });
  return data.data;
}

export async function fetchMessages(conversationId: string, page = 1, limit = 50) {
  const { data } = await api.get<ApiEnvelope<Paginated<MessageItem>>>(
    `/messages/${conversationId}/messages`,
    { params: { page, limit } }
  );
  return data.data;
}

export async function sendMessage(conversationId: string, body: string) {
  const { data } = await api.post<ApiEnvelope<MessageItem>>(
    `/messages/${conversationId}/messages`,
    { body }
  );
  return data.data;
}
