const API_BASE_URL = String(
  import.meta.env.VITE_API_BASE_URL ?? ""
).replace(/\/$/, "");

const ACCESS_TOKEN_KEY = "accessToken";

function getToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

async function handleResponse(response) {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const validationErrors = data?.errors
      ? Object.values(data.errors).flat().join(" ")
      : null;

    throw new Error(
      data?.error ??
        data?.detail ??
        validationErrors ??
        data?.title ??
        `Request failed with status ${response.status}`
    );
  }

  return data;
}

export async function apiGet(path, options = {}) {
  const token = getToken();
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers,
    ...options,
  });

  return handleResponse(response);
}

export async function apiPost(path, body, options = {}) {
  const token = getToken();
  const isFormData = body instanceof FormData;

  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers,
    body: isFormData ? body : JSON.stringify(body),
    ...options,
  });

  return handleResponse(response);
}

export async function apiPut(path, body, options = {}) {
  const token = getToken();
  const isFormData = body instanceof FormData;

  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "PUT",
    headers,
    body: isFormData ? body : JSON.stringify(body),
    ...options,
  });

  return handleResponse(response);
}

export async function apiPatch(path, body, options = {}) {
  const token = getToken();

  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(body),
    ...options,
  });

  return handleResponse(response);
}

export async function apiDelete(path, options = {}) {
  const token = getToken();

  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "DELETE",
    headers,
    ...options,
  });

  if (response.status === 204) return null;

  return handleResponse(response);
}
