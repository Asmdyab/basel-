import { apiGet } from "./apiClient.js";

const GUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidGuid(value) {
  return GUID_PATTERN.test(value);
}

function padTime(value) {
  return String(value).padStart(2, "0");
}

function formatTime(timeSpan) {
  if (typeof timeSpan === "string") {
    const parts = timeSpan.split(":");
    return `${padTime(parts[0])}:${padTime(parts[1])}`;
  }
  return `${padTime(timeSpan.hours ?? 0)}:${padTime(timeSpan.minutes ?? 0)}`;
}

export function mapCourtFromApi(c) {
  return {
    id: c.id,
    name: c.name,
    type: c.sportType,
    typeLabel: c.sportType,
    icon: c.icon ?? "🎯",
    accent: c.accent ?? "#22c55e",
    price: c.pricePerHour,
    duration: c.durationMinutes,
    capacity: c.capacity,
    rating: c.rating,
    tag: c.tag ?? "",
    image: c.imageUrl ?? "",
    gallery: c.gallery?.length ? c.gallery : [c.imageUrl].filter(Boolean),
    description: c.description ?? "",
    longDescription: c.longDescription ?? c.description ?? "",
    features: c.features ?? [],
    surface: c.surface ?? "",
    location: c.location ?? "",
    openHours: `${formatTime(c.openingTime)} - ${formatTime(c.closingTime)}`,
  };
}

export async function getCourts() {
  const data = await apiGet("/api/courts");
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
