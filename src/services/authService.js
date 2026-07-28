import { apiPost } from "./apiClient.js";

export async function loginApi(credentials) {
  return apiPost("/api/auth/login", {
    email: credentials.email,
    password: credentials.password,
  });
}

export async function registerApi(userData) {
  return apiPost("/api/auth/register", {
    fullName: userData.fullName ?? userData.name ?? "",
    email: userData.email,
    password: userData.password,
    phoneNumber: userData.phoneNumber ?? userData.phone ?? "",
  });
}
