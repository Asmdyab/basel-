import { useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";
import { uploadImage } from "../services/uploadService.js";
import { convertImageToJpeg } from "../utils/convertImageToJpeg.js";
import { resolveImageUrl, validateImageFile } from "../utils/imageUtils.js";

export default function ImageUploadField({
  label,
  value,
  values,
  onChange,
  folder = "general",
  multiple = false,
  required = false,
}) {
  const { t } = useLanguage();
  const inputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const list = multiple ? values ?? [] : value ? [value] : [];
  // Pure mapping computed during render: no state/effect needed.
  // (The old usePreviewList hook looped forever because `list` is a new
  // array every render, so the effect dependency never stabilized.)
  const previews = list.map((url) => resolveImageUrl(url));

  async function handleSelect(event) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;

    setError("");
    setIsUploading(true);
    try {
      const uploaded = [];
      for (const rawFile of files) {
        const converted = await convertImageToJpeg(rawFile);
        const validationError = validateImageFile(converted, label);
        if (validationError) throw new Error(validationError);
        const url = await uploadImage(converted, folder);
        if (!url) throw new Error(t("admin.uploadFailed"));
        uploaded.push(url);
        if (!multiple) break;
      }

      if (multiple) {
        onChange([...(values ?? []), ...uploaded]);
      } else {
        onChange(uploaded[0] ?? "");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("admin.uploadFailed"));
    } finally {
      setIsUploading(false);
    }
  }

  function handleRemove(index) {
    if (multiple) {
      onChange((values ?? []).filter((_, i) => i !== index));
    } else {
      onChange("");
    }
  }

  return (
    <div className="upload-field">
      <span className="upload-field-label">
        {label} {required && <b>*</b>}
      </span>

      {previews.length > 0 && (
        <div className="upload-preview-row">
          {previews.map((src, index) => (
            <div className="upload-preview-item" key={`${src}-${index}`}>
              <img src={src} alt={`${label} ${index + 1}`} />
              <button
                type="button"
                className="upload-remove-btn"
                onClick={() => handleRemove(index)}
                aria-label={t("admin.removeImage")}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        className="btn btn-light"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
      >
        {isUploading ? t("admin.uploading") : t("admin.chooseImage")}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
        multiple={multiple}
        onChange={handleSelect}
        hidden
      />
      {error && <small className="upload-field-error">{error}</small>}
    </div>
  );
}
