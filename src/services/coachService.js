import { apiDelete, apiGet, apiPost, apiPut } from "./apiClient.js";
import { resolveImageUrl, toStoredImageUrl } from "../utils/imageUtils.js";

const GUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidGuid(value) {
  return GUID_PATTERN.test(value);
}

export function mapCoachSummaryFromApi(c) {
  return {
    id: c.id,
    slug: c.slug ?? "",
    sportId: c.sportType?.toLowerCase() ?? "",
    sportType: c.sportType ?? "",
    name: c.name,
    title: c.title,
    image: resolveImageUrl(c.imageUrl ?? ""),
    imageUrl: resolveImageUrl(c.imageUrl ?? ""),
    experienceYears: c.experienceYears,
    rating: c.rating,
    sessions: c.sessions ?? 0,
    price: c.price,
    phoneMasked: c.phoneMasked ?? "",
    bio: c.bio ?? "",
    isActive: c.isActive ?? true,
  };
}

export function mapCoachDetailsFromApi(c) {
  return {
    id: c.id,
    slug: c.slug ?? "",
    sportId: c.sportType?.toLowerCase() ?? "",
    sportType: c.sportType ?? "",
    name: c.name,
    title: c.title,
    image: resolveImageUrl(c.imageUrl ?? ""),
    imageUrl: resolveImageUrl(c.imageUrl ?? ""),
    experienceYears: c.experienceYears,
    rating: c.rating,
    sessions: c.sessions ?? 0,
    price: c.price,
    phoneMasked: c.phoneMasked ?? "",
    bio: c.bio ?? "",
    isActive: c.isActive ?? true,
    specialties: c.specialties ?? [],
    championships: (c.championships ?? []).map((ch) => ch.title),
    championshipsDetailed: c.championships ?? [],
    certificates: (c.certificates ?? []).map((cert) => cert.title),
    certificatesDetailed: c.certificates ?? [],
    experience: (c.experience ?? []).map((exp) => ({
      place: exp.place,
      role: exp.role,
      period: exp.period,
    })),
  };
}

function toLines(value) {
  if (Array.isArray(value)) return value.join("\n");
  return String(value ?? "");
}

function parsePipeLines(text, parts) {
  return String(text ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const cells = line.split("|").map((cell) => cell.trim());
      const entry = {};
      parts.forEach((key, index) => {
        entry[key] = cells[index] ?? "";
      });
      return entry;
    })
    .filter((entry) => Object.values(entry).some(Boolean));
}

export function coachFormToApi(form) {
  const specialties = Array.isArray(form.specialties)
    ? form.specialties
    : String(form.specialtiesText ?? "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

  const championships = Array.isArray(form.championshipsDetailed)
    ? form.championshipsDetailed
    : parsePipeLines(form.championshipsText, ["title", "year"]).map((item) => ({
        title: item.title,
        year: item.year ? Number(item.year) : null,
      }));

  const certificates = Array.isArray(form.certificatesDetailed)
    ? form.certificatesDetailed
    : parsePipeLines(form.certificatesText, ["title", "issuer", "year"]).map((item) => ({
        title: item.title,
        issuer: item.issuer || null,
        year: item.year ? Number(item.year) : null,
        imageUrl: null,
      }));

  const experiences = Array.isArray(form.experience) && !form.experienceText
    ? form.experience
    : parsePipeLines(form.experienceText, ["place", "role", "period"]);

  return {
    slug: String(form.slug ?? "").trim(),
    sportType: String(form.sportType ?? "").trim(),
    name: String(form.name ?? "").trim(),
    title: String(form.title ?? "").trim(),
    bio: String(form.bio ?? "").trim(),
    imageUrl: toStoredImageUrl(form.image ?? form.imageUrl ?? ""),
    phoneNumber: String(form.phoneNumber ?? "").trim() || null,
    experienceYears: Number(form.experienceYears ?? 0),
    rating: Number(form.rating ?? 0),
    sessionsCount: Number(form.sessions ?? form.sessionsCount ?? 0),
    sessionPrice: Number(form.price ?? form.sessionPrice ?? 0),
    isActive: form.isActive ?? true,
    specialties,
    championships,
    certificates,
    experiences,
  };
}

export function coachToForm(coach) {
  return {
    slug: coach.slug ?? "",
    sportType: coach.sportType ?? "",
    name: coach.name ?? "",
    title: coach.title ?? "",
    bio: coach.bio ?? "",
    imageUrl: coach.image ?? coach.imageUrl ?? "",
    phoneNumber: "",
    phoneMasked: coach.phoneMasked ?? "",
    experienceYears: coach.experienceYears ?? 0,
    rating: coach.rating ?? 0,
    sessionsCount: coach.sessions ?? 0,
    price: coach.price ?? 0,
    isActive: coach.isActive ?? true,
    specialtiesText: toLines(coach.specialties),
    championshipsText: (coach.championshipsDetailed ?? [])
      .map((item) => (item.year ? `${item.title} | ${item.year}` : item.title))
      .join("\n"),
    certificatesText: (coach.certificatesDetailed ?? [])
      .map((item) =>
        [item.title, item.issuer, item.year].filter(Boolean).join(" | ")
      )
      .join("\n"),
    experienceText: (coach.experience ?? [])
      .map((item) => [item.place, item.role, item.period].filter(Boolean).join(" | "))
      .join("\n"),
  };
}

export async function getCoaches(sportType) {
  const params = sportType ? `?sportType=${encodeURIComponent(sportType)}` : "";
  const data = await apiGet(`/api/coaches${params}`);
  return (data ?? []).map(mapCoachSummaryFromApi);
}

export async function getCoachesForAdmin(sportType) {
  const params = sportType ? `?sportType=${encodeURIComponent(sportType)}` : "";
  const data = await apiGet(`/api/coaches/admin${params}`);
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

export async function getCoachForAdmin(id) {
  try {
    const data = await apiGet(`/api/coaches/admin/${encodeURIComponent(id)}`);
    if (data && (data.specialties || data.bio)) return mapCoachDetailsFromApi(data);
    // Admin by-id may return a summary for inactive coaches; enrich from admin list.
    if (data) {
      const summary = mapCoachSummaryFromApi(data);
      return {
        ...summary,
        specialties: [],
        championships: [],
        championshipsDetailed: [],
        certificates: [],
        certificatesDetailed: [],
        experience: [],
      };
    }
    return null;
  } catch {
    const list = await getCoachesForAdmin();
    const found = list.find((item) => String(item.id) === String(id));
    if (!found) return null;
    return {
      ...found,
      specialties: [],
      championships: [],
      championshipsDetailed: [],
      certificates: [],
      certificatesDetailed: [],
      experience: [],
    };
  }
}

export async function createCoach(form) {
  const data = await apiPost("/api/coaches", coachFormToApi(form));
  return data ? mapCoachDetailsFromApi(data) : null;
}

export async function updateCoach(id, form) {
  const data = await apiPut(`/api/coaches/${id}`, coachFormToApi(form));
  return data ? mapCoachDetailsFromApi(data) : null;
}

export async function deleteCoach(id) {
  await apiDelete(`/api/coaches/${id}`);
}

export async function deleteCoachPermanently(id) {
  await apiDelete(`/api/coaches/${id}/permanent`);
}
