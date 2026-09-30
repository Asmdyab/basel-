import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ImageUploadField from "../components/ImageUploadField.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import {
  coachToForm,
  createCoach,
  deleteCoachPermanently,
  getCoachForAdmin,
  getCoachesForAdmin,
  updateCoach,
} from "../services/coachService.js";
import "./AdminManage.css";

const emptyForm = {
  name: "",
  slug: "",
  sportType: "",
  title: "",
  bio: "",
  imageUrl: "",
  phoneNumber: "",
  phoneMasked: "",
  experienceYears: 0,
  rating: 0,
  sessionsCount: 0,
  price: 0,
  isActive: true,
  specialtiesText: "",
  championshipsText: "",
  certificatesText: "",
  experienceText: "",
};

export default function AdminCoachesPage() {
  const { t, language } = useLanguage();
  const [coaches, setCoaches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    setIsLoading(true);
    try {
      const data = await getCoachesForAdmin();
      setCoaches(data);
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
    if (!query) return coaches;
    return coaches.filter((coach) =>
      [coach.name, coach.slug, coach.sportType, coach.title]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [coaches, search]);

  function openCreate() {
    setEditing({ mode: "create" });
    setForm(emptyForm);
    setError("");
  }

  async function openEdit(coach) {
    setEditing({ mode: "edit", id: coach.id });
    setError("");
    setIsLoadingDetails(true);
    try {
      const details = await getCoachForAdmin(coach.id);
      setForm({ ...coachToForm(details ?? coach), phoneNumber: "" });
    } catch (err) {
      setError(err.message || t("admin.detailsFailed"));
      setForm({ ...coachToForm(coach), phoneNumber: "" });
    } finally {
      setIsLoadingDetails(false);
    }
  }

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (!form.name.trim() || !form.slug.trim() || !form.sportType.trim()) {
      setError(t("admin.requiredCoaches"));
      return;
    }
    if (!form.title.trim() || !form.bio.trim() || !form.imageUrl.trim()) {
      setError(t("admin.requiredCoachDetails"));
      return;
    }
    setIsSaving(true);
    try {
      if (editing?.mode === "create") {
        await createCoach(form);
      } else {
        await updateCoach(editing.id, form);
      }
      setEditing(null);
      await load();
    } catch (err) {
      setError(err.message || t("admin.saveFailed"));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleToggleActive(coach) {
    if (busyId) return;
    setError("");
    setBusyId(coach.id);
    try {
      const details = await getCoachForAdmin(coach.id);
      const current = details ?? coach;
      await updateCoach(coach.id, {
        ...coachToForm(current),
        phoneNumber: "",
        isActive: !(current.isActive ?? true),
      });
      await load();
    } catch (err) {
      setError(err.message || t("admin.updateFailed"));
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(coach) {
    if (busyId) return;
    const confirmed = window.confirm(
      `${coach.name}\n${t("admin.deletePermanentCoachConfirm")}`
    );
    if (!confirmed) return;
    setError("");
    setBusyId(coach.id);
    try {
      await deleteCoachPermanently(coach.id);
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
          <p className="eyebrow">{t("admin.coachesEyebrow")}</p>
          <h1>{t("admin.coachesTitle")}</h1>
          <p>{t("admin.coachesDesc")}</p>
        </div>
        <span className="admin-badge-big">COACHES</span>
      </section>

      <div className="manage-toolbar">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t("admin.searchCoaches")}
        />
        <strong>
          {filtered.length} {t("admin.coachesCount")}
        </strong>
        <button type="button" className="btn btn-primary" onClick={openCreate}>
          {t("admin.newCoach")}
        </button>
        <Link className="btn btn-light" to="/admin">
          {t("admin.backToDashboard")}
        </Link>
      </div>

      {error && !editing && <div className="manage-error">{error}</div>}

      {isLoading ? (
        <div className="empty-state">
          <h2>{t("admin.loadingCoaches")}</h2>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <h2>{t("admin.emptyCoaches")}</h2>
          <p>{t("admin.emptyCoachesText")}</p>
        </div>
      ) : (
        <div className="manage-table-wrap">
          <table className="manage-table">
            <thead>
                <tr>
                  <th>{t("admin.colCoach")}</th>
                  <th>{t("admin.colSport")}</th>
                  <th>{t("admin.colSessionPrice")}</th>
                  <th>{t("admin.colRating")}</th>
                  <th>{t("admin.colStatus")}</th>
                  <th>{t("admin.colActions")}</th>
                </tr>
            </thead>
            <tbody>
              {filtered.map((coach) => (
                <tr key={coach.id}>
                  <td>
                    <div className="manage-name-cell">
                      {coach.image && (
                        <img
                          src={coach.image}
                          alt={coach.name}
                          className="manage-row-thumb"
                        />
                      )}
                      <div>
                        <strong>{coach.name}</strong>
                        <br />
                        <small>{coach.title}</small>
                      </div>
                    </div>
                  </td>
                  <td>{coach.sportType}</td>
                  <td>{coach.price} ج.م</td>
                  <td>{coach.rating}</td>
                  <td>
                    {coach.isActive === false ? (
                      <span className="chip warning">{t("admin.inactive")}</span>
                    ) : (
                      <span className="chip success">{t("admin.active")}</span>
                    )}
                  </td>
                  <td>
                    <div className="manage-row-actions">
                      <button
                        type="button"
                        className="btn btn-light"
                        onClick={() => openEdit(coach)}
                      >
                        {t("admin.edit")}
                      </button>
                      <button
                        type="button"
                        className="btn btn-light"
                        onClick={() => handleToggleActive(coach)}
                        disabled={busyId === coach.id}
                      >
                        {coach.isActive === false
                          ? t("admin.activate")
                          : t("admin.deactivate")}
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => handleDelete(coach)}
                        disabled={busyId === coach.id}
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
                ? t("admin.newCoachTitle")
                : t("admin.editCoachTitle")}
            </h2>
            {isLoadingDetails ? (
              <p>{t("admin.loadingDetails")}</p>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="manage-form-grid">
                  <label>
                    {t("admin.fieldName")} *
                    <input
                      value={form.name}
                      onChange={(event) => updateField("name", event.target.value)}
                    />
                  </label>
                  <label>
                    {t("admin.fieldSlug")} *
                    <input
                      value={form.slug}
                      onChange={(event) => updateField("slug", event.target.value)}
                      placeholder="coach-ahmed-padel"
                      dir="ltr"
                    />
                  </label>
                  <label>
                    {t("admin.fieldSport")} *
                    <input
                      value={form.sportType}
                      onChange={(event) => updateField("sportType", event.target.value)}
                      placeholder="Padel"
                    />
                  </label>
                  <label>
                    {t("admin.fieldTitle")} *
                    <input
                      value={form.title}
                      onChange={(event) => updateField("title", event.target.value)}
                    />
                  </label>
                  <label className="manage-span-2">
                    {t("admin.fieldBio")} *
                    <textarea
                      value={form.bio}
                      onChange={(event) => updateField("bio", event.target.value)}
                    />
                  </label>
                  <div className="manage-span-2">
                    <ImageUploadField
                      label={t("admin.fieldImage")}
                      value={form.imageUrl}
                      onChange={(url) => updateField("imageUrl", url)}
                      folder="coaches"
                      required
                    />
                  </div>
                  <label>
                    {t("admin.fieldPhone")}
                    <input
                      value={form.phoneNumber}
                      onChange={(event) => updateField("phoneNumber", event.target.value)}
                      placeholder={form.phoneMasked || "01xxxxxxxxx"}
                      dir="ltr"
                    />
                  </label>
                  <label>
                    {t("admin.fieldExperience")}
                    <input
                      type="number"
                      min="0"
                      value={form.experienceYears}
                      onChange={(event) => updateField("experienceYears", event.target.value)}
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
                    {t("admin.fieldSessions")}
                    <input
                      type="number"
                      min="0"
                      value={form.sessionsCount}
                      onChange={(event) => updateField("sessionsCount", event.target.value)}
                    />
                  </label>
                  <label>
                    {t("admin.fieldSessionPrice")}
                    <input
                      type="number"
                      min="0"
                      value={form.price}
                      onChange={(event) => updateField("price", event.target.value)}
                    />
                  </label>
                  <label className="manage-span-2">
                    {t("admin.fieldSpecialties")}
                    <textarea
                      value={form.specialtiesText}
                      onChange={(event) => updateField("specialtiesText", event.target.value)}
                    />
                  </label>
                  <label className="manage-span-2">
                    {t("admin.fieldChampionships")}
                    <textarea
                      value={form.championshipsText}
                      onChange={(event) => updateField("championshipsText", event.target.value)}
                      placeholder="بطل القاهرة | 2024"
                    />
                  </label>
                  <label className="manage-span-2">
                    {t("admin.fieldCertificates")}
                    <textarea
                      value={form.certificatesText}
                      onChange={(event) => updateField("certificatesText", event.target.value)}
                    />
                  </label>
                  <label className="manage-span-2">
                    {t("admin.fieldCoachExperience")}
                    <textarea
                      value={form.experienceText}
                      onChange={(event) => updateField("experienceText", event.target.value)}
                      placeholder="K-HUB | مدرب رئيسي | 2021 – الآن"
                    />
                  </label>
                  {editing.mode === "edit" && (
                    <label className="manage-check-row">
                      <input
                        type="checkbox"
                        checked={form.isActive}
                        onChange={(event) => updateField("isActive", event.target.checked)}
                      />
                      {t("admin.fieldActive")}
                    </label>
                  )}
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
            )}
          </div>
        </div>
      )}
    </div>
  );
}
