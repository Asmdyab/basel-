import { Link } from "react-router-dom";
import { getCourtTrainingSportId } from "../data/courts.js";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function CourtCard({ court }) {
  const { t, pick } = useLanguage();
  const trainingSportId = getCourtTrainingSportId(court);
  // Clients always go straight to the training page (with the court
  // preselected) so they can enroll. There is no court details page.
  const trainingUrl = trainingSportId
    ? `/training/${trainingSportId}?court=${encodeURIComponent(court.id)}`
    : "/courts";

  return (
    <article className="court-card premium-card" style={{ "--accent": court.accent }}>
      <div className="court-image-wrap">
        <img src={court.image} alt={pick(court.name)} className="court-image" />
        <div className="court-gradient" />
        <span className="court-badge">{court.icon} {pick(court.typeLabel)}</span>
        <span className="court-tag">{pick(court.tag)}</span>
      </div>

      <div className="court-content">
        <div className="court-title-row">
          <div>
            <h3>{pick(court.name)}</h3>
            <p className="court-description">{pick(court.description)}</p>
          </div>
          <span className="rating">★ {court.rating}</span>
        </div>

        <div className="court-meta-grid">
          <div>
            <small>{t("details.price")}</small>
            <strong>{court.price} {t("common.cash")}</strong>
          </div>
          <div>
            <small>{t("details.duration")}</small>
            <strong>{court.duration} min</strong>
          </div>
          <div>
            <small>{t("details.capacity")}</small>
            <strong>{pick(court.capacity)}</strong>
          </div>
        </div>

        <ul className="feature-list">
          {pick(court.features)?.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>

        <div className="card-actions">
          <Link className="btn btn-primary full-width" to={trainingUrl}>
            تسجيل تمرين
          </Link>
        </div>
      </div>
    </article>
  );
}
