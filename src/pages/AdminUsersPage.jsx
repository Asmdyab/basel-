import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useBookings } from "../context/BookingContext.jsx";
import { useUserProfiles } from "../context/UserProfileContext.jsx";
import "./UserProfilePage.css";

function initials(name) {
  return String(name ?? "U")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function AdminUsersPage() {
  const { bookings } = useBookings();
  const { knownUsers, trainingRegistrations } = useUserProfiles();
  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return knownUsers.filter((profile) => {
      if (profile.role === "Admin") return false;
      if (!query) return true;

      return [profile.name, profile.email, profile.phone]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    });
  }, [knownUsers, search]);

  return (
    <div className="page section admin-users-page" dir="rtl">
      <section className="courts-hero admin-hero users-admin-hero">
        <div>
          <p className="eyebrow">Private Member Management</p>
          <h1>ملفات المستخدمين</h1>
          <p>
            عرض بيانات المستخدم، حجوزاته، صور الدفع، طلبات التمرين، وإدارة
            نقاطه. هذه الصفحة للإدارة فقط.
          </p>
        </div>
        <span className="admin-badge-big">USERS</span>
      </section>

      <section className="admin-users-toolbar">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="ابحث بالاسم أو الإيميل أو الموبايل..."
        />
        <strong>{filteredUsers.length} مستخدم</strong>
      </section>

      {filteredUsers.length === 0 ? (
        <div className="empty-state">
          <h2>لا توجد ملفات مستخدمين</h2>
          <p>تظهر الملفات بعد تسجيل المستخدم أو تنفيذ حجز أو طلب تمرين.</p>
        </div>
      ) : (
        <section className="admin-users-grid">
          {filteredUsers.map((profile) => {
            const bookingCount = bookings.filter(
              (booking) => booking.userId === profile.userId
            ).length;
            const trainingCount = trainingRegistrations.filter(
              (registration) => registration.userId === profile.userId
            ).length;

            return (
              <article className="admin-user-card" key={profile.userId}>
                <div className="admin-user-avatar">
                  {profile.profileImage ? (
                    <img src={profile.profileImage} alt={profile.name} />
                  ) : (
                    <span>{initials(profile.name)}</span>
                  )}
                </div>
                <div className="admin-user-copy">
                  <h2>{profile.name}</h2>
                  <p>{profile.email || "لا يوجد إيميل"}</p>
                  <p>{profile.phone || "لا يوجد موبايل"}</p>
                </div>
                <div className="admin-user-mini-stats">
                  <span><strong>{bookingCount}</strong> حجز</span>
                  <span><strong>{trainingCount}</strong> تمرين</span>
                  <span><strong>{profile.points}</strong> نقطة</span>
                </div>
                <Link
                  className="btn btn-primary full-width"
                  to={`/admin/users/${profile.userId}`}
                >
                  فتح الملف الخاص
                </Link>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
