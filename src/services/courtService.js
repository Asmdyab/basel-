import { apiDelete, apiGet, apiPost, apiPut } from "./apiClient.js";
import { resolveImageUrl, toStoredImageUrl } from "../utils/imageUtils.js";

const GUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidGuid(value) {
  return GUID_PATTERN.test(value);
}

function padTime(value) {
  return String(value).padStart(2, "0");
}

function formatTime(timeSpan) {
  if (timeSpan == null) return "";
  if (typeof timeSpan === "string") {
    const parts = timeSpan.split(":");
    if (parts.length >= 2) return `${padTime(parts[0])}:${padTime(parts[1])}`;
    return timeSpan;
  }
  return `${padTime(timeSpan.hours ?? 0)}:${padTime(timeSpan.minutes ?? 0)}`;
}

function normalizeTimeInput(value, fallback) {
  const raw = String(value ?? "").trim() || fallback;
  if (/^\d{2}:\d{2}(:\d{2})?$/.test(raw)) {
    return raw.length === 5 ? `${raw}:00` : raw;
  }
  return fallback;
}

export function mapCourtFromApi(c) {
  return {
    id: c.id,
    slug: c.slug ?? "",
    name: c.name,
    type: c.sportType,
    typeLabel: c.sportType,
    sportType: c.sportType,
    icon: c.icon ?? "🎯",
    accent: c.accent ?? "#22c55e",
    price: c.pricePerHour,
    duration: c.durationMinutes,
    capacity: c.capacity,
    rating: c.rating,
    tag: c.tag ?? "",
    image: resolveImageUrl(c.imageUrl ?? ""),
    gallery: (c.gallery?.length ? c.gallery : [c.imageUrl].filter(Boolean)).map(
      resolveImageUrl
    ),
    description: c.description ?? "",
    longDescription: c.longDescription ?? c.description ?? "",
    features: c.features ?? [],
    surface: c.surface ?? "",
    location: c.location ?? "",
    openHours: `${formatTime(c.openingTime)} - ${formatTime(c.closingTime)}`,
    openingTime: formatTime(c.openingTime),
    closingTime: formatTime(c.closingTime),
    isActive: c.isActive ?? true,
  };
}

export function mapCourtToApi(form) {
  const toList = (value) =>
    String(value ?? "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

  return {
    slug: String(form.slug ?? "").trim(),
    name: String(form.name ?? "").trim(),
    sportType: String(form.sportType ?? form.type ?? "").trim(),
    description: String(form.description ?? "").trim() || null,
    longDescription: String(form.longDescription ?? "").trim() || null,
    location: String(form.location ?? "").trim() || null,
    imageUrl: toStoredImageUrl(form.image ?? form.imageUrl ?? "") || null,
    gallery: (Array.isArray(form.gallery) ? form.gallery : toList(form.galleryText)).map(
      toStoredImageUrl
    ),
    features: Array.isArray(form.features) ? form.features : toList(form.featuresText),
    surface: String(form.surface ?? "").trim() || null,
    icon: String(form.icon ?? "").trim() || null,
    accent: String(form.accent ?? "").trim() || null,
    tag: String(form.tag ?? "").trim() || null,
    rating: Number(form.rating ?? 0),
    pricePerHour: Number(form.price ?? form.pricePerHour ?? 0),
    durationMinutes: Number(form.duration ?? form.durationMinutes ?? 60),
    capacity: Number(form.capacity ?? 0),
    openingTime: normalizeTimeInput(form.openingTime, "08:00:00"),
    closingTime: normalizeTimeInput(form.closingTime, "23:00:00"),
    isActive: form.isActive ?? true,
  };
}

export async function getCourts() {
  const data = await apiGet("/api/courts");
  return (data ?? []).map(mapCourtFromApi);
}

export async function getCourtsForAdmin() {
  const data = await apiGet("/api/courts/admin");
  return (data ?? []).map(mapCourtFromApi);
}

export async function getCourt(id) {
  const path = isValidGuid(id)
    ? `/api/courts/${id}`
    : `/api/courts/by-slug/${encodeURIComponent(id)}`;
  const data = await apiGet(path);
  return data ? mapCourtFromApi(data) : null;
}

export async function getCourtBySlug(slug) {
  const data = await apiGet(`/api/courts/by-slug/${encodeURIComponent(slug)}`);
  return data ? mapCourtFromApi(data) : null;
}

export async function createCourt(form) {
  const data = await apiPost("/api/courts", mapCourtToApi(form));
  return data ? mapCourtFromApi(data) : null;
}

export async function updateCourt(id, form) {
  const data = await apiPut(`/api/courts/${id}`, {
    ...mapCourtToApi(form),
    isActive: form.isActive ?? true,
  });
  return data ? mapCourtFromApi(data) : null;
}

export async function deleteCourt(id) {
  await apiDelete(`/api/courts/${id}`);
}

export async function deleteCourtPermanently(id) {
  await apiDelete(`/api/courts/${id}/permanent`);
}
