import { apiPost } from "./apiClient.js";

export async function uploadImage(file, folder = "general") {
  const formData = new FormData();
  formData.append("file", file);

  const data = await apiPost(
    `/api/uploads/image?folder=${encodeURIComponent(folder)}`,
    formData
  );
  return data?.url ?? null;
}
