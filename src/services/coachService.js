import { apiGet } from "./apiClient.js";

const GUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidGuid(value) {
  return GUID_PATTERN.test(value);
}

export function mapCoachSummaryFromApi(c) {
  return {
    id: c.id,
    sportId: c.sportType?.toLowerCase() ?? "",
    name: c.name,
    title: c.title,
    image: c.imageUrl ?? "",
    experienceYears: c.experienceYears,
    rating: c.rating,
    sessions: c.sessions ?? 0,
    price: c.price,
    phoneMasked: c.phoneMasked ?? "",
    bio: c.bio ?? "",
  };
}

export function mapCoachDetailsFromApi(c) {
  return {
    id: c.id,
    sportId: c.sportType?.toLowerCase() ?? "",
    name: c.name,
    title: c.title,
    image: c.imageUrl ?? "",
    experienceYears: c.experienceYears,
    rating: c.rating,
    sessions: c.sessions ?? 0,
    price: c.price,
    phoneMasked: c.phoneMasked ?? "",
    bio: c.bio ?? "",
    specialties: c.specialties ?? [],
    championships: (c.championships ?? []).map((ch) => ch.title),
    certificates: (c.certificates ?? []).map((cert) => cert.title),
    experience: (c.experience ?? []).map((exp) => ({
      place: exp.place,
      role: exp.role,
      period: exp.period,
    })),
  };
}

export async function getCoaches(sportType) {
  const params = sportType ? `?sportType=${encodeURIComponent(sportType)}` : "";
  const data = await apiGet(`/api/coaches${params}`);
  return (data ?? []).map(mapCoachSummaryFromApi);
}

export async function getCoach(id) {
  const path = isValidGuid(id)
    ? `/api/coaches/${id}`
    : `/api/coaches/by-slug/${encodeURIComponent(id)}`;
  const data = await apiGet(path);
  return data ? mapCoachDetailsFromApi(data) : null;
}

export async function getCoachBySlug(slug) {
  const data = await apiGet(`/api/coaches/by-slug/${encodeURIComponent(slug)}`);
  return data ? mapCoachDetailsFromApi(data) : null;
}
