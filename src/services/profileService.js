import { apiGet, apiPut, apiPost } from "./apiClient.js";

export async function getMyProfile() {
  return apiGet("/api/profiles/me");
}

export async function getProfile(userId) {
  return apiGet(`/api/profiles/${userId}`);
}

export async function getAllProfiles() {
  return apiGet("/api/profiles");
}

export async function updateProfile(userId, formData) {
  return apiPut(`/api/profiles/${userId}`, formData);
}

export async function adjustPoints(userId, amount, note) {
  return apiPost(`/api/profiles/${userId}/points`, { amount, note });
}
