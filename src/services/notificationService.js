import { apiGet, apiPatch, apiDelete } from "./apiClient.js";

export async function getNotifications(unreadOnly = false, take = 100) {
  const params = new URLSearchParams();
  if (unreadOnly) params.set("unreadOnly", "true");
  params.set("take", String(take));
  return apiGet(`/api/notifications?${params.toString()}`);
}

export async function getUnreadCount() {
  return apiGet("/api/notifications/unread-count");
}

export async function markAsRead(id) {
  return apiPatch(`/api/notifications/${id}/read`);
}

export async function markAllAsRead() {
  return apiPatch("/api/notifications/read-all");
}

export async function deleteNotification(id) {
  return apiDelete(`/api/notifications/${id}`);
}

export async function deleteAllNotifications() {
  return apiDelete("/api/notifications");
}
