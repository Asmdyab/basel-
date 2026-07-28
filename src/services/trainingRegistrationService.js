import { apiGet, apiPost, apiPatch } from "./apiClient.js";

export async function createTrainingRegistration(formData) {
  return apiPost("/api/training-registrations", formData);
}

export async function getMyTrainingRegistrations() {
  return apiGet("/api/training-registrations/mine");
}

export async function getAllTrainingRegistrations(status, userId) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (userId) params.set("userId", userId);
  const query = params.toString();
  return apiGet(`/api/training-registrations${query ? `?${query}` : ""}`);
}

export async function reviewTrainingRegistration(id, review) {
  return apiPatch(`/api/training-registrations/${id}/review`, review);
}
