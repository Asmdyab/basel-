import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useUserProfiles } from "../context/UserProfileContext.jsx";
import { getCoaches } from "../services/coachService.js";
import "./AdminTrainingRegistrationsPage.css";

const statusMeta = {
  Pending: { className: "chip warning", label: "قيد المراجعة" },
  Approved: { className: "chip success", label: "مقبول" },
  Rejected: { className: "chip danger-chip", label: "مرفوض" },
  Cancelled: { className: "chip muted-chip", label: "ملغي" },
};

export default function AdminTrainingRegistrationsPage() {
  const { trainingRegistrations, updateTrainingStatus, isLoadingRegistrations } = useUserProfiles();
  const [statusFilter, setStatusFilter] = useState("all");
  const [reviewingId, setReviewingId] = useState(null);
  const [coaches, setCoaches] = useState([]);
  const [form, setForm] = useState({
    status: "Approved",
    assignedCoachId: "",
    assignedDate: "",
    assignedTime: "",
    reviewNote: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const pendingCount = trainingRegistrations.filter((r) => r.status === "Pending").length;
  const approvedCount = trainingRegistrations.filter((r) => r.status === "Approved").length;
  const rejectedCount = trainingRegistrations.filter((r) => r.status === "Rejected").length;

  const filtered = useMemo(() => {
    let list = [...trainingRegistrations];
    if (statusFilter !== "all") list = list.filter((r) => r.status === statusFilter);
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [trainingRegistrations, statusFilter]);

  function formatTime(timeStr) {
    if (!timeStr) return "";
    return timeStr.length > 5 ? timeStr.slice(0, 5) : timeStr;
  }

  async function openReview(reg) {
    setReviewingId(reg.id);
    setForm({
      status: "Approved",
      assignedCoachId: reg.assignedCoachId ?? "",
      assignedDate: reg.assignedDate ?? "",
      assignedTime: formatTime(reg.assignedTime),
      reviewNote: reg.reviewNote ?? "",
    });
    try {
      const data = await getCoaches(reg.sportType);
      setCoaches(data ?? []);
    } catch {
      setCoaches([]);
    }
  }

  function closeReview() {
    setReviewingId(null);
  }

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(regId) {
    setSubmitting(true);
    try {
      const payload = { status: form.status };
      if (form.status === "Approved") {
        if (form.assignedCoachId) payload.assignedCoachId = form.assignedCoachId;
        if (form.assignedDate) payload.assignedDate = form.assignedDate;
        if (form.assignedTime) payload.assignedTime = form.assignedTime;
      }
      if (form.reviewNote.trim()) payload.reviewNote = form.reviewNote.trim();
      await updateTrainingStatus(regId, payload.status, payload);
      setReviewingId(null);
    } catch {
      // handled by context
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page section">
      <section className="courts-hero admin-hero">
        <div>
          <p className="eyebrow">Admin Review</p>
          <h1>مراجعة طلبات التدريب</h1>
          <p>راجع طلبات التدريب، اعتمد مع الكابتن والموعد، أو ارفض مع ملاحظة.</p>
        </div>
        <span className="admin-badge-big">TRAINING</span>
      </section>

      <section className="admin-stats-grid">
        <article className="admin-stat-card">
          <span>⏳</span>
          <strong>{pendingCount}</strong>
          <p>قيد المراجعة</p>
        </article>
        <article className="admin-stat-card">
          <span>✅</span>
          <strong>{approvedCount}</strong>
          <p>مقبول</p>
        </article>
        <article className="admin-stat-card">
          <span>❌</span>
          <strong>{rejectedCount}</strong>
          <p>مرفوض</p>
        </article>
        <Link className="admin-action-card" to="/admin" style={{ gridColumn: "1 / -1" }}>
          <span>⬅️</span>
          <div>
            <h3>الرجوع للوحة التحكم</h3>
            <p>العودة إلى لوحة التحكم الرئيسية.</p>
          </div>
        </Link>
      </section>

      <section className="section compact-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Training Requests</p>
            <h2>كل طلبات التدريب</h2>
          </div>
          <div className="atr-filter-tabs">
            {["all", "Pending", "Approved", "Rejected", "Cancelled"].map((s) => (
              <button
                key={s}
                className={`atr-tab ${statusFilter === s ? "active" : ""}`}
                onClick={() => setStatusFilter(s)}
              >
                {s === "all" ? "الكل" : statusMeta[s]?.label ?? s}
              </button>
            ))}
          </div>
        </div>

        {isLoadingRegistrations ? (
          <div className="empty-state"><p>جار التحميل...</p></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <h2>لا توجد طلبات</h2>
            <p>لم يتم العثور على طلبات تدريب لهذا التصنيف.</p>
          </div>
        ) : (
          <div className="atr-list">
            {filtered.map((reg) => {
              const meta = statusMeta[reg.status] ?? { className: "", label: reg.status };
              const isReviewing = reviewingId === reg.id;

              return (
                <article className={`atr-card ${isReviewing ? "atr-card--reviewing" : ""}`} key={reg.id}>
                  <div className="atr-card-header">
                    <div className="atr-card-info">
                      <span className={`chip ${meta.className}`}>{meta.label}</span>
                      <h3>{reg.participantName}</h3>
                      <p>
                        {reg.sportName} — {reg.courtName}
                      </p>
                      <p className="atr-meta">
                        العمر: {reg.age} • {reg.paymentMethod} • {reg.trainingPrice} ج.م
                        {reg.phone && <> • {reg.phone}</>}
                      </p>
                      {reg.assignedCoachName && (
                        <p className="atr-assigned">
                          الكابتن: {reg.assignedCoachName}
                          {reg.assignedDate && <> • {reg.assignedDate}</>}
                          {reg.assignedTime && <> • {formatTime(reg.assignedTime)}</>}
                        </p>
                      )}
                      {reg.reviewNote && <p className="atr-note">{reg.reviewNote}</p>}
                    </div>

                    <div className="atr-card-actions">
                      {reg.paymentProofImageUrl && (
                        <a href={reg.paymentProofImageUrl} target="_blank" rel="noreferrer" className="proof-image-link">
                          <img src={reg.paymentProofImageUrl} alt="إثبات الدفع" />
                        </a>
                      )}
                      {reg.status === "Pending" && !isReviewing && (
                        <button className="btn btn-primary" onClick={() => openReview(reg)}>
                          مراجعة
                        </button>
                      )}
                      {isReviewing && (
                        <button className="btn btn-muted" onClick={closeReview}>إلغاء</button>
                      )}
                    </div>
                  </div>

                  {isReviewing && (
                    <div className="atr-review-form">
                      <div className="atr-review-status">
                        <label className={`atr-status-option ${form.status === "Approved" ? "selected" : ""}`}>
                          <input
                            type="radio"
                            name="status"
                            value="Approved"
                            checked={form.status === "Approved"}
                            onChange={handleFormChange}
                          />
                          <span>✅ قبول</span>
                        </label>
                        <label className={`atr-status-option ${form.status === "Rejected" ? "selected" : ""}`}>
                          <input
                            type="radio"
                            name="status"
                            value="Rejected"
                            checked={form.status === "Rejected"}
                            onChange={handleFormChange}
                          />
                          <span>❌ رفض</span>
                        </label>
                      </div>

                      {form.status === "Approved" && (
                        <div className="atr-assign-fields">
                          <label className="registration-field">
                            <span>الكابتن</span>
                            <select
                              name="assignedCoachId"
                              value={form.assignedCoachId}
                              onChange={handleFormChange}
                            >
                              <option value="">-- دون كابتن --</option>
                              {coaches.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                              ))}
                            </select>
                          </label>
                          <label className="registration-field">
                            <span>التاريخ</span>
                            <input
                              type="date"
                              name="assignedDate"
                              value={form.assignedDate}
                              onChange={handleFormChange}
                            />
                          </label>
                          <label className="registration-field">
                            <span>الوقت</span>
                            <input
                              type="time"
                              name="assignedTime"
                              value={form.assignedTime}
                              onChange={handleFormChange}
                            />
                          </label>
                        </div>
                      )}

                      <label className="registration-field atr-note-field">
                        <span>ملاحظة (اختياري)</span>
                        <textarea
                          name="reviewNote"
                          value={form.reviewNote}
                          onChange={handleFormChange}
                          placeholder="ملاحظة للمستخدم..."
                          rows={2}
                        />
                      </label>

                      <div className="atr-submit-row">
                        <button
                          className="btn btn-primary"
                          onClick={() => handleSubmit(reg.id)}
                          disabled={submitting}
                        >
                          {submitting ? "جاري الحفظ..." : "تأكيد"}
                        </button>
                        <button className="btn btn-muted" onClick={closeReview}>إلغاء</button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
