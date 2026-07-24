import { Link } from "react-router-dom";
import { courts, paymentMethods } from "../data/courts.js";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function Footer() {
  const { t, pick } = useLanguage();
  const sportTypes = [...new Set(courts.map((court) => court.type))];

  return (
    <footer className="site-footer">
      <div className="footer-inner page">
        <div className="footer-brand">
          <Link to="/" className="brand footer-logo">
            <img src="/k-hub-logo.png" alt="K-HUB logo" className="brand-logo-img footer-logo-img" />
            <span>
              <strong>K-HUB</strong>
              <small>{t("brandSubtitle")}</small>
            </span>
          </Link>
          <p>
            استعرض ملاعب النادي، شاهد مواعيد التدريب والمدربين، ثم أرسل طلب
            التسجيل من خلال الملعب المناسب.
          </p>
          <div className="footer-socials">
            <span>IG</span>
            <span>FB</span>
            <span>WA</span>
          </div>
        </div>

        <div className="footer-col">
          <h3>{t("nav.courts")}</h3>
          {sportTypes.map((type) => (
            <Link key={type} to="/courts">
              {type}
            </Link>
          ))}
        </div>

        <div className="footer-col">
          <h3>Links</h3>
          <Link to="/courts">{t("nav.courts")}</Link>
          <Link to="/about">{t("nav.about")}</Link>
          <Link to="/contact">{t("nav.contact")}</Link>
        </div>

        <div className="footer-col">
          <h3>{t("home.paymentTitle")}</h3>
          {paymentMethods.map((method) => (
            <span key={method.id}>{pick(method.name)}</span>
          ))}
        </div>
      </div>

      <div className="footer-bottom page">
        <span>© 2026 K-HUB. All rights reserved.</span>
        <span>Courts and training experience.</span>
      </div>
    </footer>
  );
}
