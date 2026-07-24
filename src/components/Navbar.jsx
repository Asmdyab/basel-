import { Link, NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useNotifications } from "../context/NotificationContext.jsx";

const languages = [
  { code: "ar", label: "AR" },
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
];

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="navbar">
      <Link to="/" className="brand" aria-label="K-HUB Home">
        <img src="/k-hub-logo.png" alt="K-HUB logo" className="brand-logo-img" />
        <span>
          <strong>K-HUB</strong>
          <small>{t("brandSubtitle")}</small>
        </span>
      </Link>

      <nav className="nav-links" aria-label="Main navigation">
        <NavLink to="/">{t("nav.home")}</NavLink>

        {user && !isAdmin && <NavLink to="/profile">صفحتي</NavLink>}

        <NavLink to="/courts">{t("nav.courts")}</NavLink>
        <NavLink to="/about">{t("nav.about")}</NavLink>
        <NavLink to="/contact">{t("nav.contact")}</NavLink>

        {isAdmin && (
          <>
            <NavLink to="/admin">Admin</NavLink>
            <NavLink to="/admin/users">المستخدمون</NavLink>
            <NavLink to="/schedule">{t("nav.schedule")}</NavLink>
          </>
        )}
      </nav>

      <div className="nav-actions nav-actions-extended">
        <div className="language-switcher" aria-label={t("nav.language")}>
          {languages.map((item) => (
            <button
              key={item.code}
              type="button"
              className={language === item.code ? "lang-pill active" : "lang-pill"}
              onClick={() => setLanguage(item.code)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {user ? (
          <>
            {!isAdmin && (
              <Link
                to="/notifications"
                className="notification-bell-button"
                aria-label={`${t("nav.notifications")}${
                  unreadCount > 0 ? `، ${unreadCount} غير مقروء` : ""
                }`}
                title={t("nav.notifications")}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                  <path d="M10 21h4" />
                </svg>
                {unreadCount > 0 && (
                  <span className="notification-bell-badge">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>
            )}

            <span className="user-pill">
              👋 {user.name}
              {isAdmin ? " • Admin" : ""}
            </span>
            <button type="button" className="btn btn-light" onClick={handleLogout}>
              {t("nav.logout")}
            </button>
          </>
        ) : (
          <div className="inline-auth-actions">
            <Link className="btn btn-light" to="/login">
              {t("nav.login")}
            </Link>
            <Link className="btn btn-primary" to="/register">
              {t("nav.register")}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
