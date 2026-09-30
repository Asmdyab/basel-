import { Link } from 'react-router-dom';
import { useBookings } from '../context/BookingContext.jsx';
import { useUserProfiles } from '../context/UserProfileContext.jsx';
import { toLocalDateInputValue } from '../utils/bookingUtils.js';

export default function AdminDashboardPage() {
  const { bookings, approveBooking, rejectBooking } = useBookings();
  const { trainingRegistrations, updateTrainingStatus } = useUserProfiles();
  const today = toLocalDateInputValue();
  const todayBookings = bookings.filter((booking) => booking.date === today);
  const confirmedBookings = bookings.filter((booking) => booking.status === 'confirmed');
  const pendingPayments = bookings.filter((booking) => booking.status === 'pending');
  const revenue = confirmedBookings.reduce((total, booking) => total + Number(booking.price || 0), 0);
  const pendingTrainings = trainingRegistrations.filter((r) => r.status === "Pending");

  return (
    <div className="page section">
      <section className="courts-hero admin-hero">
        <div>
          <p className="eyebrow">Admin Dashboard</p>
          <h1>لوحة تحكم K-HUB</h1>
          <p>راجع الحجوزات، أكد المدفوعات، وتابع جدول النادي من مكان واحد.</p>
        </div>
        <span className="admin-badge-big">ADMIN</span>
      </section>

      <section className="admin-stats-grid">
        <article className="admin-stat-card">
          <span>📅</span>
          <strong>{todayBookings.length}</strong>
          <p>حجوزات اليوم</p>
        </article>
        <article className="admin-stat-card">
          <span>⏳</span>
          <strong>{pendingPayments.length}</strong>
          <p>مدفوعات قيد المراجعة</p>
        </article>
        <article className="admin-stat-card">
          <span>💰</span>
          <strong>{revenue}</strong>
          <p>إجمالي المؤكد ج.م</p>
        </article>

        <article className="admin-stat-card">
          <span>🏋️</span>
          <strong>{pendingTrainings.length}</strong>
          <p>طلبات تدريب قيد المراجعة</p>
        </article>

      </section>

      <section className="admin-actions-grid">
        <Link className="admin-action-card" to="/schedule">
          <span>📋</span>
          <div>
            <h3>جدول المواعيد</h3>
            <p>متابعة الحجوزات حسب التاريخ والملعب ومراجعة الدفع.</p>
          </div>
        </Link>
        <Link className="admin-action-card" to="/admin/courts">
          <span>🏟️</span>
          <div>
            <h3>إدارة الملاعب</h3>
            <p>إضافة ملعب، تعديل البيانات والأسعار والمواعيد، تفعيل أو حذف.</p>
          </div>
        </Link>
        <Link className="admin-action-card" to="/admin/coaches">
          <span>🧑‍🏫</span>
          <div>
            <h3>إدارة الكباتن</h3>
            <p>إضافة مدرب، تعديل البيانات والأسعار والتخصصات، تفعيل أو حذف.</p>
          </div>
        </Link>
        <Link className="admin-action-card" to="/admin/training-registrations">
          <span>🏋️</span>
          <div>
            <h3>طلبات التدريب</h3>
            <p>مراجعة طلبات التدريب، تعيين الكابتن والموعد، قبول أو رفض.</p>
          </div>
        </Link>
        <Link className="admin-action-card" to="/admin/users">
          <span>👤</span>
          <div>
            <h3>ملفات المستخدمين</h3>
            <p>عرض الصفحات الخاصة، الحجوزات، صور الدفع، وإدارة النقاط.</p>
          </div>
        </Link>
      </section>

      <section className="section compact-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Payment Review</p>
            <h2>طلبات الدفع المنتظرة</h2>
          </div>
          <Link className="link-btn" to="/schedule">عرض كل الحجوزات ←</Link>
        </div>

        {pendingPayments.length === 0 ? (
          <div className="empty-state">
            <h2>لا توجد مدفوعات قيد المراجعة</h2>
            <p>أي حجز يتم عبر InstaPay أو Vodafone Cash أو PayPal سيظهر هنا بعد رفع إثبات الدفع.</p>
          </div>
        ) : (
          <div className="admin-pending-grid">
            {pendingPayments.map((booking) => (
              <article className="pending-payment-card" key={booking.id}>
                <div>
                  <span className="chip warning">قيد المراجعة</span>
                  <h3>{booking.courtName}</h3>
                  <p>{booking.userName} - {booking.userPhone}</p>
                  <p>{booking.date} - {booking.time}</p>
                  <p>{booking.paymentMethodLabel} - {booking.price} ج.م</p>
                  {booking.paymentReference && <p>رقم العملية: {booking.paymentReference}</p>}
                </div>
                {booking.paymentProof && <img src={booking.paymentProof} alt="إثبات الدفع" />}
                <div className="admin-review-actions">
                  <button className="btn btn-primary" onClick={() => approveBooking(booking.id)}>تأكيد</button>
                  <button className="btn btn-danger" onClick={() => rejectBooking(booking.id)}>رفض</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="section compact-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Training Review</p>
            <h2>طلبات التدريب قيد المراجعة</h2>
          </div>
          <Link className="link-btn" to="/admin/training-registrations">عرض كل الطلبات ←</Link>
        </div>

        {pendingTrainings.length === 0 ? (
          <div className="empty-state">
            <h2>لا توجد طلبات تدريب قيد المراجعة</h2>
            <p>طلبات التدريب الجديدة من المستخدمين ستظهر هنا للمراجعة والقبول أو الرفض.</p>
          </div>
        ) : (
          <div className="admin-pending-grid">
            {pendingTrainings.map((reg) => (
              <article className="pending-payment-card" key={reg.id}>
                <div>
                  <span className="chip warning">قيد المراجعة</span>
                  <h3>{reg.participantName}</h3>
                  <p>{reg.sportName} — {reg.courtName}</p>
                  <p>العمر: {reg.age} • {reg.trainingPrice} ج.م</p>
                  {reg.phone && <p>رقم الهاتف: {reg.phone}</p>}
                </div>
                {reg.paymentProofImageUrl && (
                  <img src={reg.paymentProofImageUrl} alt="إثبات الدفع" />
                )}
                <div className="admin-review-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => updateTrainingStatus(reg.id, "Approved")}
                  >
                    قبول
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => updateTrainingStatus(reg.id, "Rejected")}
                  >
                    رفض
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
