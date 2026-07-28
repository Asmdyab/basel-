import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useBookings } from "../context/BookingContext.jsx";
import { useUserProfiles } from "../context/UserProfileContext.jsx";
import {
  validateImageFile,
} from "../utils/imageUtils.js";
import "./UserProfilePage.css";

const sportLabels = {
  Basketball: "باسكت بول",
  Handball: "هاند بول",
  Tennis: "تنس",
  Padel: "بادل",
};

function bookingStatus(status) {
  if (status === "pending") return { label: "قيد المراجعة", className: "warning" };
  if (status === "rejected") return { label: "مرفوض", className: "danger-chip" };
  if (status === "cancelled") return { label: "ملغي", className: "muted-chip" };
  return { label: "مؤكد", className: "success" };
}

function registrationStatus(status) {
  const s = String(status ?? "").toLowerCase();
  if (s === "approved") return { label: "مقبول", className: "success" };
  if (s === "rejected") return { label: "مرفوض", className: "danger-chip" };
  return { label: "قيد المراجعة", className: "warning" };
}

function formatDate(value) {
  if (!value) return "--";

  return new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getInitials(name) {
  return String(name ?? "U")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function UserProfilePage() {
  const { userId: routeUserId } = useParams();
  const { user, isAdmin } = useAuth();
  const { bookings } = useBookings();
  const {
    getProfile,
    fetchProfile,
    upsertProfile,
    trainingRegistrations,
    adjustPoints,
    updateTrainingStatus,
    isLoadingProfile,
  } = useUserProfiles();

  const targetUserId = routeUserId ?? user?.id;
  const profile = getProfile(targetUserId);
  const isOwner = user?.id === targetUserId;
  const canView = Boolean(profile && (isOwner || isAdmin));

  const userBookings = useMemo(
    () =>
      bookings
        .filter((booking) => booking.userId === targetUserId)
        .sort((a, b) =>
          String(b.createdAt ?? `${b.date}T${b.startTime}`).localeCompare(
            String(a.createdAt ?? `${a.date}T${a.startTime}`)
          )
        ),
    [bookings, targetUserId]
  );

  const userRegistrations = useMemo(
    () =>
      trainingRegistrations
        .filter((registration) => registration.userId === targetUserId)
        .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))),
    [targetUserId, trainingRegistrations]
  );

  const [editForm, setEditForm] = useState(() => ({
    name: profile?.name ?? "",
    phone: profile?.phone ?? "",
    age: profile?.age ? String(profile.age) : "",
    preferredSport: profile?.preferredSport ?? "",
  }));
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [pointsAmount, setPointsAmount] = useState("10");
  const [pointsNote, setPointsNote] = useState("");
  const [pointsMessage, setPointsMessage] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (!profile) {
      if (isAdmin && targetUserId) fetchProfile(targetUserId);
      return;
    }

    setEditForm({
      name: profile.name ?? "",
      phone: profile.phone ?? "",
      age: profile.age ? String(profile.age) : "",
      preferredSport: profile.preferredSport ?? "",
    });
    setProfileImageFile(null);
    setProfileMessage("");
    setProfileError("");
  }, [
    targetUserId,
    profile?.age,
    profile?.name,
    profile?.phone,
    profile?.preferredSport,
  ]);

  if (!canView) {
    if (isLoadingProfile) {
      return (
        <div className="page section">
          <div className="empty-state">
            <h2>جاري تحميل الملف الشخصي...</h2>
          </div>
        </div>
      );
    }

    return (
      <div className="page section">
        <div className="empty-state">
          <h1>الصفحة الشخصية غير متاحة</h1>
          <p>هذه البيانات خاصة بصاحب الحساب والإدارة فقط.</p>
          <Link className="btn btn-primary" to="/">
            الرجوع للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  const trainingPendingCount = userRegistrations.filter(
    (r) => String(r.status ?? "").toLowerCase() === "pending"
  ).length;
  const trainingApprovedCount = userRegistrations.filter(
    (r) => String(r.status ?? "").toLowerCase() === "approved"
  ).length;

  async function saveProfile(event) {
    event.preventDefault();
    setProfileError("");
    setProfileMessage("");

    const age = Number(editForm.age);

    if (editForm.name.trim().length < 2) {
      setProfileError("اكتب الاسم بشكل صحيح.");
      return;
    }

    if (editForm.age && (!Number.isInteger(age) || age < 5 || age > 100)) {
      setProfileError("اكتب سن صحيح من 5 إلى 100 سنة.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", editForm.name.trim());
      formData.append("phone", editForm.phone.trim());
      formData.append("age", editForm.age ? String(age) : "");

      if (editForm.preferredSport) {
        formData.append("preferredSport", editForm.preferredSport);
      }

      if (profileImageFile) {
        const imageError = validateImageFile(profileImageFile, "الصورة الشخصية");

        if (imageError) {
          setProfileError(imageError);
          return;
        }

        formData.append("profileImage", profileImageFile);
      }

      await upsertProfile(targetUserId, formData);

      setProfileImageFile(null);
      setProfileMessage("تم تحديث بيانات الصفحة الشخصية.");
    } catch (error) {
      setProfileError(error.message ?? "تعذر تحديث البيانات.");
    }
  }

  async function changePoints(direction) {
    setPointsMessage("");

    try {
      const amount = Math.abs(Number(pointsAmount)) * direction;
      const updated = await adjustPoints({
        userId: targetUserId,
        amount,
        note: pointsNote,
      });

      setPointsMessage(`تم تحديث الرصيد إلى ${updated.points} نقطة.`);
      setPointsNote("");
    } catch (error) {
      setPointsMessage(error.message ?? "تعذر تعديل النقاط.");
    }
  }

  return (
    <div className="page section user-profile-page" dir="rtl">
      <section className="profile-hero-card">
        <div className="profile-avatar-wrap">
          {profile.profileImage ? (
            <img src={profile.profileImage} alt={`صورة ${profile.name}`} />
          ) : (
            <span>{getInitials(profile.name)}</span>
          )}
        </div>

        <div className="profile-hero-content">
          <p className="eyebrow">Private Member Profile</p>
          <h1>{profile.name}</h1>
          <p>{profile.email || "لا يوجد بريد مسجل"}</p>
          <div className="profile-meta-row">
            <span>🔒 خاصة بصاحب الحساب والإدارة</span>
            {profile.age && <span>العمر: {profile.age} سنة</span>}
            {profile.preferredSport && (
              <span>اللعبة: {sportLabels[profile.preferredSport] ?? profile.preferredSport}</span>
            )}
          </div>
        </div>

        <div className="points-orb">
          <small>رصيد النقاط</small>
          <strong>{profile.points}</strong>
          <span>نقطة</span>
        </div>
      </section>

      <section className="profile-stats-grid">
        <article>
          <span>🏟️</span>
          <strong>{userRegistrations.length}</strong>
          <p>إجمالي طلبات التدريب</p>
        </article>
        <article>
          <span>⏳</span>
          <strong>{trainingPendingCount}</strong>
          <p>قيد المراجعة</p>
        </article>
        <article>
          <span>✅</span>
          <strong>{trainingApprovedCount}</strong>
          <p>مقبولة</p>
        </article>
        <article>
          <span>🏅</span>
          <strong>{profile.points}</strong>
          <p>النقاط الحالية</p>
        </article>
      </section>

      <div className="profile-columns">
        <section className="profile-panel">
          <div className="profile-panel-heading">
            <div>
              <p className="eyebrow">Member Information</p>
              <h2>معلومات المستخدم</h2>
            </div>
          </div>

          <dl className="profile-details-list">
            <div><dt>الاسم</dt><dd>{profile.name}</dd></div>
            <div><dt>الإيميل</dt><dd>{profile.email || "--"}</dd></div>
            <div><dt>الموبايل</dt><dd>{profile.phone || "--"}</dd></div>
            <div><dt>السن</dt><dd>{profile.age ? `${profile.age} سنة` : "--"}</dd></div>
            <div>
              <dt>اللعبة المفضلة</dt>
              <dd>{sportLabels[profile.preferredSport] ?? (profile.preferredSport || "--")}</dd>
            </div>
          </dl>

          {isOwner && (
            <form className="profile-edit-form" onSubmit={saveProfile}>
              <h3>تعديل بياناتي</h3>
              <div className="profile-edit-grid">
                <label>
                  الاسم
                  <input
                    value={editForm.name}
                    onChange={(event) =>
                      setEditForm({ ...editForm, name: event.target.value })
                    }
                  />
                </label>
                <label>
                  رقم الموبايل
                  <input
                    value={editForm.phone}
                    onChange={(event) =>
                      setEditForm({ ...editForm, phone: event.target.value })
                    }
                  />
                </label>
                <label>
                  السن
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={editForm.age}
                    onChange={(event) =>
                      setEditForm({ ...editForm, age: event.target.value })
                    }
                  />
                </label>
                <label>
                  اللعبة المفضلة
                  <select
                    value={editForm.preferredSport}
                    onChange={(event) =>
                      setEditForm({
                        ...editForm,
                        preferredSport: event.target.value,
                      })
                    }
                  >
                    <option value="">اختار اللعبة</option>
                    {Object.entries(sportLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="profile-image-input">
                تحديث الصورة الشخصية
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) =>
                    setProfileImageFile(event.target.files?.[0] ?? null)
                  }
                />
              </label>

              {profileError && <p className="profile-error">{profileError}</p>}
              {profileMessage && <p className="profile-success">{profileMessage}</p>}

              <button className="btn btn-primary" type="submit">
                حفظ التعديلات
              </button>
            </form>
          )}
        </section>

        {isAdmin && (
          <section className="profile-panel admin-points-panel">
            <div className="profile-panel-heading">
              <div>
                <p className="eyebrow">Admin Only</p>
                <h2>إدارة نقاط المستخدم</h2>
              </div>
            </div>

            <label>
              عدد النقاط
              <input
                type="number"
                min="1"
                value={pointsAmount}
                onChange={(event) => setPointsAmount(event.target.value)}
              />
            </label>
            <label>
              سبب التعديل
              <input
                value={pointsNote}
                onChange={(event) => setPointsNote(event.target.value)}
                placeholder="مثال: مكافأة انتظام"
              />
            </label>
            <div className="points-actions">
              <button className="btn btn-primary" type="button" onClick={() => changePoints(1)}>
                إضافة نقاط
              </button>
              <button className="btn btn-danger" type="button" onClick={() => changePoints(-1)}>
                خصم نقاط
              </button>
            </div>
            {pointsMessage && <p className="points-message">{pointsMessage}</p>}
          </section>
        )}
      </div>

      <section className="profile-panel profile-wide-panel">
        <div className="profile-panel-heading">
          <div>
            <p className="eyebrow">Booking History</p>
            <h2>الحجوزات وصور تأكيد الدفع</h2>
          </div>
          {isOwner && <Link className="btn btn-primary" to="/courts">حجز جديد</Link>}
        </div>

        {userBookings.length === 0 ? (
          <div className="empty-state compact-empty">
            <h3>لا توجد حجوزات حتى الآن</h3>
          </div>
        ) : (
          <div className="profile-bookings-grid">
            {userBookings.map((booking) => {
              const status = bookingStatus(booking.status);

              return (
                <article className="profile-booking-card" key={booking.id}>
                  <div className="profile-booking-head">
                    <span className={`chip ${status.className}`}>{status.label}</span>
                    <small>{booking.date}</small>
                  </div>
                  <h3>{booking.courtName}</h3>
                  <p>{booking.time}</p>
                  <p>{booking.playersCount || "--"} لاعب</p>
                  <p>{booking.paymentMethodLabel || "--"}</p>
                  {booking.paymentReference && (
                    <p>مرجع الدفع: {booking.paymentReference}</p>
                  )}
                  {booking.adminNote && <p className="admin-note-text">{booking.adminNote}</p>}
                  {booking.paymentProof ? (
                    <button
                      className="image-preview-trigger"
                      type="button"
                      onClick={() =>
                        setPreviewImage({
                          src: booking.paymentProof,
                          alt: "صورة تأكيد الدفع",
                        })
                      }
                    >
                      <img
                        className="profile-proof-image"
                        src={booking.paymentProof}
                        alt="صورة تأكيد الدفع"
                      />
                    </button>
                  ) : (
                    <div className="proof-placeholder">لا توجد صورة دفع</div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="profile-panel profile-wide-panel">
        <div className="profile-panel-heading">
          <div>
            <p className="eyebrow">Training Requests</p>
            <h2>طلبات التسجيل في التمرين</h2>
          </div>
          {isOwner && (
            <Link className="link-btn" to="/courts">
              تسجيل تمرين جديد
            </Link>
          )}
        </div>

        {userRegistrations.length === 0 ? (
          <div className="empty-state compact-empty">
            <h3>لا توجد طلبات تمرين</h3>
          </div>
        ) : (
          <div className="training-history-grid">
            {userRegistrations.map((registration) => {
              const status = registrationStatus(registration.status);

              return (
                <article className="training-history-card" key={registration.id}>
                  <div className="training-history-copy">
                    <span className={`chip ${status.className}`}>{status.label}</span>
                    <h3>{registration.sportName ?? sportLabels[registration.sportType] ?? registration.sportType}</h3>
                    {registration.assignedCoachName && <p>الكابتن: {registration.assignedCoachName}</p>}
                    {registration.courtName && <p>الملعب: {registration.courtName}</p>}
                    <p>العمر: {registration.age} سنة</p>
                    <p>الدفع: {registration.paymentMethod}</p>
                    {registration.trainingPrice && <p>القيمة: {registration.trainingPrice} ج.م</p>}
                    <p>مرجع العملية: {registration.transactionReference}</p>
                    <small>{formatDate(registration.createdAt)}</small>
                  </div>

                  <div className="training-history-images">
                    {registration.profileImageUrl && (
                      <div className="training-profile-image">
                        <img src={registration.profileImageUrl} alt="صورة اللاعب" />
                        <span>اللاعب</span>
                      </div>
                    )}
                    {registration.paymentProofImageUrl && (
                      <button
                        className="training-payment-trigger"
                        type="button"
                        onClick={() =>
                          setPreviewImage({
                            src: registration.paymentProofImageUrl,
                            alt: "إثبات الدفع",
                          })
                        }
                      >
                        <img src={registration.paymentProofImageUrl} alt="إثبات الدفع" />
                        <span>إثبات الدفع</span>
                        <small>اضغط لعرض الفاتورة كاملة</small>
                      </button>
                    )}
                  </div>

                  {isAdmin && String(registration.status ?? "").toLowerCase() === "pending" && (
                    <div className="training-admin-actions">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => updateTrainingStatus(registration.id, "Approved")}
                      >
                        قبول
                      </button>
                      <button
                        className="btn btn-danger"
                        type="button"
                        onClick={() => updateTrainingStatus(registration.id, "Rejected")}
                      >
                        رفض
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="profile-panel profile-wide-panel">
        <div className="profile-panel-heading">
          <div>
            <p className="eyebrow">Points History</p>
            <h2>سجل النقاط</h2>
          </div>
        </div>

        {profile.pointsHistory.length === 0 ? (
          <p className="muted-paragraph">لم تتم إضافة نقاط بعد.</p>
        ) : (
          <div className="points-history-list">
            {profile.pointsHistory.map((item) => (
              <article key={item.id}>
                <strong className={item.amount >= 0 ? "points-positive" : "points-negative"}>
                  {item.amount >= 0 ? "+" : ""}{item.amount}
                </strong>
                <div>
                  <p>{item.note}</p>
                  <small>{item.adminName} • {formatDate(item.createdAt)}</small>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {previewImage && (
        <div
          className="image-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={previewImage.alt}
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="image-lightbox-content"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="image-lightbox-close"
              type="button"
              aria-label="إغلاق الصورة"
              onClick={() => setPreviewImage(null)}
            >
              ×
            </button>
            <img src={previewImage.src} alt={previewImage.alt} />
            <p>{previewImage.alt}</p>
          </div>
        </div>
      )}
    </div>
  );
}
