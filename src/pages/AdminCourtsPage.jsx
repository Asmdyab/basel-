import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ImageUploadField from "../components/ImageUploadField.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { getCourtTrainingSportId } from "../data/courts.js";
import {
  createCourt,
  deleteCourtPermanently,
  getCourtsForAdmin,
  updateCourt,
} from "../services/courtService.js";
import "./AdminManage.css";

const emptyForm = {
  name: "",
  slug: "",
  sportType: "",
  price: "",
  duration: 60,
  capacity: "",
  rating: 0,
  openingTime: "08:00",
  closingTime: "23:00",
  location: "",
  surface: "",
  icon: "🎯",
  accent: "#22c55e",
  tag: "",
  image: "",
  gallery: [],
  featuresText: "",
  description: "",
  longDescription: "",
  isActive: true,
};

// The enrollment page a client lands on is derived from the sport, so the
// admin must pick it from this fixed list (free text used to break the link).
const SPORT_OPTIONS = ["Padel", "Basketball", "Handball", "Tennis"];

function slugify(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toForm(court) {
  return {
    name: court?.name ?? "",
    slug: court?.slug ?? "",
    sportType: court?.sportType ?? court?.type ?? "",
    price: court?.price ?? "",
    duration: court?.duration ?? 60,
    capacity: court?.capacity ?? "",
    rating: court?.rating ?? 0,
    openingTime: court?.openingTime ?? "08:00",
    closingTime: court?.closingTime ?? "23:00",
    location: court?.location ?? "",
    surface: court?.surface ?? "",
    icon: court?.icon ?? "🎯",
    accent: court?.accent ?? "#22c55e",
    tag: typeof court?.tag === "string" ? court.tag : "",
    image: court?.image ?? "",
    gallery: court?.gallery ?? [],
    featuresText: (court?.features ?? []).join("\n"),
    description: court?.description ?? "",
    longDescription: court?.longDescription ?? "",
    isActive: court?.isActive ?? true,
  };
}

export default function AdminCourtsPage() {
  const { t, language } = useLanguage();
  const [courts, setCourts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    setIsLoading(true);
    try {
      const data = await getCourtsForAdmin();
      setCourts(data);
    } catch (err) {
      setError(err.message || t("admin.loadFailed"));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return courts.filter((court) => {
      if (showActiveOnly && court.isActive === false) return false;
      if (!query) return true;
      return [court.name, court.slug, court.sportType, court.type]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    });
  }, [courts, search, showActiveOnly]);

  function openCreate() {
    setEditing({ mode: "create" });
    setForm(emptyForm);
    setError("");
  }

  function openEdit(court) {
    setEditing({ mode: "edit", id: court.id });
    setForm(toForm(court));
    setError("");
  }

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleNameChange(value) {
    // Auto-fill the slug from the name while the admin hasn't typed one.
    setForm((prev) => ({
      ...prev,
      name: value,
      slug: prev.slug.trim() ? prev.slug : slugify(value),
    }));
  }

  const enrollmentSportId = getCourtTrainingSportId(form.sportType);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (!form.name.trim() || !form.slug.trim() || !form.sportType.trim()) {
      setError(t("admin.requiredCourts"));
      return;
    }
    setIsSaving(true);
    try {
      if (editing?.mode === "create") {
        await createCourt(form);
      } else {
        await updateCourt(editing.id, form);
      }
      setEditing(null);
      await load();
    } catch (err) {
      setError(err.message || t("admin.saveFailed"));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleToggleActive(court) {
    if (busyId) return;
    setError("");
    setBusyId(court.id);
    try {
      await updateCourt(court.id, {
        ...toForm(court),
        isActive: !court.isActive,
      });
      await load();
    } catch (err) {
      setError(err.message || t("admin.updateFailed"));
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(court) {
    if (busyId) return;
    const confirmed = window.confirm(
      `${court.name}\n${t("admin.deletePermanentCourtConfirm")}`
    );
    if (!confirmed) return;
    setError("");
    setBusyId(court.id);
    try {
      await deleteCourtPermanently(court.id);
      await load();
    } catch (err) {
      setError(err.message || t("admin.deleteFailed"));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="page section" dir={language === "ar" ? "rtl" : "ltr"}>
      <section className="courts-hero admin-hero">
        <div>
          <p className="eyebrow">{t("admin.courtsEyebrow")}</p>
          <h1>{t("admin.courtsTitle")}</h1>
          <p>{t("admin.courtsDesc")}</p>
        </div>
        <span className="admin-badge-big">COURTS</span>
      </section>

      <div className="manage-toolbar">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t("admin.searchCourts")}
        />
        <label className="chip">
          <input
            type="checkbox"
            checked={showActiveOnly}
            onChange={(event) => setShowActiveOnly(event.target.checked)}
          />{" "}
          {t("admin.activeOnly")}
        </label>
        <strong>
          {filtered.length} {t("admin.courtsCount")}
        </strong>
        <button type="button" className="btn btn-primary" onClick={openCreate}>
          {t("admin.newCourt")}
        </button>
        <Link className="btn btn-light" to="/admin">
          {t("admin.backToDashboard")}
        </Link>
      </div>

      {error && !editing && <div className="manage-error">{error}</div>}

      {isLoading ? (
        <div className="empty-state">
          <h2>{t("admin.loadingCourts")}</h2>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <h2>{t("admin.emptyCourts")}</h2>
          <p>{t("admin.emptyCourtsText")}</p>
        </div>
      ) : (
        <div className="manage-table-wrap">
          <table className="manage-table">
            <thead>
              <tr>
                <th>{t("admin.colCourt")}</th>
                <th>{t("admin.colSport")}</th>
                <th>{t("admin.colPrice")}</th>
                <th>{t("admin.colHours")}</th>
                <th>{t("admin.colStatus")}</th>
                <th>{t("admin.colActions")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((court) => (
                <tr key={court.id}>
                  <td>
                    <div className="manage-name-cell">
                      {court.image && (
                        <img
                          src={court.image}
                          alt={court.name}
                          className="manage-row-thumb"
                        />
                      )}
                      <div>
                        <strong>{court.name}</strong>
                        <br />
                        <small>{court.slug}</small>
                      </div>
                    </div>
                  </td>
                  <td>{court.sportType || court.type}</td>
                  <td>{court.price} ج.م</td>
                  <td>{court.openHours}</td>
                  <td>
                    {court.isActive ? (
                      <span className="chip success">{t("admin.active")}</span>
                    ) : (
                      <span className="chip warning">{t("admin.inactive")}</span>
                    )}
                  </td>
                  <td>
                    <div className="manage-row-actions">
                      <button
                        type="button"
                        className="btn btn-light"
                        onClick={() => openEdit(court)}
                      >
                        {t("admin.edit")}
                      </button>
                      <button
                        type="button"
                        className="btn btn-light"
                        onClick={() => handleToggleActive(court)}
                        disabled={busyId === court.id}
                      >
                        {court.isActive
                          ? t("admin.deactivate")
                          : t("admin.activate")}
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => handleDelete(court)}
                        disabled={busyId === court.id}
                      >
                        {t("admin.deletePermanent")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="manage-modal-backdrop" onClick={() => setEditing(null)}>
          <div className="manage-modal" onClick={(event) => event.stopPropagation()}>
            <h2>
              {editing.mode === "create"
                ? t("admin.newCourtTitle")
                : t("admin.editCourtTitle")}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="manage-form-grid">
                <label>
                  {t("admin.fieldName")} *
                  <input
                    value={form.name}
                    onChange={(event) => handleNameChange(event.target.value)}
                    placeholder="Padel Court 1"
                  />
                </label>
                <label>
                  {t("admin.fieldSlug")} *
                  <input
                    value={form.slug}
                    onChange={(event) => updateField("slug", event.target.value)}
                    placeholder="padel-1"
                    dir="ltr"
                  />
                </label>
                <label>
                  {t("admin.fieldSport")} *
                  <select
                    value={form.sportType}
                    onChange={(event) => updateField("sportType", event.target.value)}
                  >
                    <option value="">—</option>
                    {SPORT_OPTIONS.map((sport) => (
                      <option key={sport} value={sport}>
                        {sport}
                      </option>
                    ))}
                  </select>
                  {enrollmentSportId && (
                    <small>رابط التسجيل للعملاء: /training/{enrollmentSportId}?court=…</small>
                  )}
                </label>
                <label>
                  {t("admin.fieldPrice")}
                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(event) => updateField("price", event.target.value)}
                  />
                </label>
                <label>
                  {t("admin.fieldDuration")}
                  <input
                    type="number"
                    min="1"
                    value={form.duration}
                    onChange={(event) => updateField("duration", event.target.value)}
                  />
                </label>
                <label>
                  {t("admin.fieldCapacity")}
                  <input
                    type="number"
                    min="1"
                    value={form.capacity}
                    onChange={(event) => updateField("capacity", event.target.value)}
                  />
                </label>
                <label>
                  {t("admin.fieldRating")}
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={form.rating}
                    onChange={(event) => updateField("rating", event.target.value)}
                  />
                </label>
                <label>
                  {t("admin.fieldOpen")}
                  <input
                    type="time"
                    value={form.openingTime}
                    onChange={(event) => updateField("openingTime", event.target.value)}
                  />
                </label>
                <label>
                  {t("admin.fieldClose")}
                  <input
                    type="time"
                    value={form.closingTime}
                    onChange={(event) => updateField("closingTime", event.target.value)}
                  />
                </label>
                <label>
                  {t("admin.fieldLocation")}
                  <input
                    value={form.location}
                    onChange={(event) => updateField("location", event.target.value)}
                  />
                </label>
                <label>
                  {t("admin.fieldSurface")}
                  <input
                    value={form.surface}
                    onChange={(event) => updateField("surface", event.target.value)}
                  />
                </label>
                <label>
                  {t("admin.fieldAccent")}
                  <span className="color-picker-row">
                    <input
                      type="color"
                      className="color-picker"
                      value={
                        /^#[0-9a-fA-F]{6}$/.test(form.accent ?? "")
                          ? form.accent
                          : "#22c55e"
                      }
                      onChange={(event) =>
                        updateField("accent", event.target.value)
                      }
                    />
                    <code className="color-picker-value">
                      {form.accent || "#22c55e"}
                    </code>
                  </span>
                </label>
                <label>
                  {t("admin.fieldTag")}
                  <input
                    value={form.tag}
                    onChange={(event) => updateField("tag", event.target.value)}
                  />
                </label>
                <div className="manage-span-2">
                  <ImageUploadField
                    label={t("admin.fieldImage")}
                    value={form.image}
                    onChange={(url) => updateField("image", url)}
                    folder="courts"
                  />
                </div>
                <div className="manage-span-2">
                  <ImageUploadField
                    label={t("admin.fieldGallery")}
                    values={form.gallery}
                    onChange={(urls) => updateField("gallery", urls)}
                    folder="courts"
                    multiple
                  />
                </div>
                <label className="manage-span-2">
                  {t("admin.fieldFeatures")}
                  <textarea
                    value={form.featuresText}
                    onChange={(event) => updateField("featuresText", event.target.value)}
                  />
                </label>
                <label className="manage-span-2">
                  {t("admin.fieldDescription")}
                  <textarea
                    value={form.description}
                    onChange={(event) => updateField("description", event.target.value)}
                  />
                </label>
                <label className="manage-span-2">
                  {t("admin.fieldLongDescription")}
                  <textarea
                    value={form.longDescription}
                    onChange={(event) => updateField("longDescription", event.target.value)}
                  />
                </label>
                <label className="manage-check-row">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(event) => updateField("isActive", event.target.checked)}
                  />
                  {t("admin.fieldActive")}
                </label>
              </div>

              {error && <div className="manage-error">{error}</div>}

              <div className="manage-modal-actions">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => setEditing(null)}
                  disabled={isSaving}
                >
                  {t("admin.cancel")}
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSaving}>
                  {isSaving ? t("admin.saving") : t("admin.save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
