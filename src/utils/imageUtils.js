const DEFAULT_MAX_DIMENSION = 1280;
const DEFAULT_QUALITY = 0.82;

const API_BASE_URL = String(
  import.meta.env.VITE_API_BASE_URL ?? ""
).replace(/\/$/, "");

export function resolveImageUrl(url) {
  if (!url) return "";
  const value = String(url).trim();
  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:") ||
    value.startsWith("blob:")
  ) {
    return value;
  }
  if (value.startsWith("/uploads/")) {
    return `${API_BASE_URL}${value}`;
  }
  return value;
}

export function toStoredImageUrl(url) {
  if (!url) return "";
  const value = String(url).trim();
  if (API_BASE_URL && value.startsWith(`${API_BASE_URL}/uploads/`)) {
    return value.slice(API_BASE_URL.length);
  }
  return value;
}
export function validateImageFile(file, label = "الصورة", maximumBytes = 5 * 1024 * 1024) {
  if (!file) {
    return `${label} مطلوبة.`;
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    return `${label} لازم تكون JPG أو PNG أو WEBP.`;
  }

  if (file.size > maximumBytes) {
    return `حجم ${label} لازم يكون أقل من 5 ميجابايت.`;
  }

  return null;
}

export function fileToOptimizedDataUrl(
  file,
  {
    maxDimension = DEFAULT_MAX_DIMENSION,
    quality = DEFAULT_QUALITY,
  } = {}
) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("تعذر قراءة الصورة."));
    reader.onload = () => {
      const image = new Image();

      image.onerror = () => reject(new Error("ملف الصورة غير صالح."));
      image.onload = () => {
        const scale = Math.min(
          1,
          maxDimension / Math.max(image.width, image.height)
        );

        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
          reject(new Error("تعذر تجهيز الصورة."));
          return;
        }

        canvas.width = width;
        canvas.height = height;
        context.drawImage(image, 0, 0, width, height);

        const outputType = file.type === "image/png" ? "image/webp" : file.type;
        const dataUrl = canvas.toDataURL(outputType, quality);
        resolve(dataUrl);
      };

      image.src = String(reader.result);
    };

    reader.readAsDataURL(file);
  });
}
