import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext.jsx";
import "./NotificationsPage.css";

function formatNotificationDate(value) {
  if (!value) return "";

  return new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function NotificationIcon({ type }) {
  if (type === "success") {
    return <span aria-hidden="true">✓</span>;
  }

  if (type === "danger") {
    return <span aria-hidden="true">×</span>;
  }

  return <span aria-hidden="true">i</span>;
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const {
    userNotifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearMyNotifications,
  } = useNotifications();
  const [filter, setFilter] = useState("all");

  const visibleNotifications = useMemo(
    () =>
      filter === "unread"
        ? userNotifications.filter((notification) => !notification.isRead)
        : userNotifications,
    [filter, userNotifications]
  );

  function openNotification(notification) {
    markAsRead(notification.id);
    navigate(notification.link || "/profile");
  }

  return (
    <div className="page section notifications-page" dir="rtl">
      <section className="notifications-hero">
        <div className="notifications-hero-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" role="img">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
            <path d="M10 21h4" />
          </svg>
        </div>

        <div>
          <p className="eyebrow">Notifications Center</p>
          <h1>الإشعارات</h1>
          <p>
            تابع نتيجة مراجعة طلبات التدريب وتأكيد أو رفض الحجز من الإدارة.
          </p>
        </div>

        <div className="notifications-summary">
          <strong>{unreadCount}</strong>
          <span>غير مقروء</span>
        </div>
      </section>

      <section className="notifications-panel">
        <div className="notifications-toolbar">
          <div className="notifications-filters" aria-label="فلترة الإشعارات">
            <button
              type="button"
              className={filter === "all" ? "active" : ""}
              onClick={() => setFilter("all")}
            >
              الكل
              <span>{userNotifications.length}</span>
            </button>
            <button
              type="button"
              className={filter === "unread" ? "active" : ""}
              onClick={() => setFilter("unread")}
            >
              غير المقروء
              <span>{unreadCount}</span>
            </button>
          </div>

          <div className="notifications-toolbar-actions">
            {unreadCount > 0 && (
              <button
                type="button"
                className="notifications-text-button"
                onClick={markAllAsRead}
              >
                تعليم الكل كمقروء
              </button>
            )}

            {userNotifications.length > 0 && (
              <button
                type="button"
                className="notifications-text-button danger"
                onClick={clearMyNotifications}
              >
                مسح الكل
              </button>
            )}
          </div>
        </div>

        {visibleNotifications.length === 0 ? (
          <div className="notifications-empty">
            <div aria-hidden="true">🔔</div>
            <h2>
              {filter === "unread"
                ? "لا توجد إشعارات جديدة"
                : "لم تصلك إشعارات بعد"}
            </h2>
            <p>
              عندما تراجع الإدارة طلبك، ستظهر النتيجة هنا وعلى جرس الإشعارات.
            </p>
          </div>
        ) : (
          <div className="notifications-list">
            {visibleNotifications.map((notification) => (
              <article
                key={notification.id}
                className={`notification-card notification-${notification.type} ${
                  notification.isRead ? "is-read" : "is-unread"
                }`}
              >
                <button
                  type="button"
                  className="notification-open-button"
                  onClick={() => openNotification(notification)}
                >
                  <span className="notification-status-icon">
                    <NotificationIcon type={notification.type} />
                  </span>

                  <span className="notification-copy">
                    <span className="notification-title-row">
                      <strong>{notification.title}</strong>
                      {!notification.isRead && (
                        <span className="notification-new-label">جديد</span>
                      )}
                    </span>
                    <span className="notification-message">
                      {notification.message}
                    </span>
                    <small>{formatNotificationDate(notification.createdAt)}</small>
                  </span>

                  <span className="notification-arrow" aria-hidden="true">
                    ‹
                  </span>
                </button>

                <button
                  type="button"
                  className="notification-delete-button"
                  aria-label="حذف الإشعار"
                  onClick={() => removeNotification(notification.id)}
                >
                  ×
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
