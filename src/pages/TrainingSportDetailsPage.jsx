import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { getCourt as getFallbackCourt, getCourtTrainingSportId } from "../data/courts.js";
import { getSportCoaches, getTrainingSport } from "../data/trainingCatalog.js";
import { getCourt } from "../services/courtService.js";
import { getCoaches } from "../services/coachService.js";
import "./TrainingCatalog.css";

export default function TrainingSportDetailsPage() {
  const { sportId } = useParams();
  const [searchParams] = useSearchParams();
  const courtId = searchParams.get("court") || "";

  const sport = getTrainingSport(sportId);
  const [court, setCourt] = useState(null);
  const [coaches, setCoaches] = useState([]);

  useEffect(() => {
    let cancelled = false;

    if (courtId) {
      getCourt(courtId)
        .then((data) => { if (!cancelled) setCourt(data); })
        .catch(() => { if (!cancelled) setCourt(getFallbackCourt(courtId)); });
    }

    if (sport?.value) {
      getCoaches(sport.value)
        .then((data) => { if (!cancelled) setCoaches(data); })
        .catch(() => {
          if (!cancelled) {
            const fallbackCoaches = getSportCoaches(sportId);
            setCoaches(fallbackCoaches);
          }
        });
    }

    return () => { cancelled = true; };
  }, [courtId, sport?.value, sportId]);

  const courtMatchesSport = court && sport && getCourtTrainingSportId(court) === sport.id;

  if (!sport) {
    return (
      <div className="training-catalog-page" dir="rtl">
        <div className="training-catalog-empty">
          <h1>اللعبة غير موجودة</h1>
          <Link className="training-action-button" to="/courts">
            الرجوع للملاعب
          </Link>
        </div>
      </div>
    );
  }

  if (!court || !courtMatchesSport) {
    return (
      <div className="training-catalog-page" dir="rtl">
        <div className="training-catalog-empty">
          <h1>اختار الملعب أولًا</h1>
          <p>
            التسجيل في التدريب يبدأ من صفحة الملاعب. اختار الملعب المناسب ثم
            افتح تفاصيل التدريب والكباتن.
          </p>
          <Link className="training-action-button" to="/courts">
            عرض الملاعب
          </Link>
        </div>
      </div>
    );
  }

  const registrationUrl = `/training/register/${sport.id}?court=${encodeURIComponent(court.id)}`;

  return (
    <div className="training-catalog-page" dir="rtl">
      <section
        className="training-sport-hero"
        style={{ "--sport-accent": sport.accent }}
      >
        <img src={sport.image} alt={sport.name} />
        <div className="training-sport-hero__overlay" />
        <div className="training-sport-hero__content">
          <Link to={`/courts/${court.id}`} className="training-back-link">
            → الرجوع إلى {court.name?.ar ?? court.name}
          </Link>
          <span>{sport.englishName}</span>
          <h1>تدريب {sport.name}</h1>
          <p>{sport.fullDescription}</p>
          <div className="training-sport-hero__stats">
            <div>
              <small>الملعب</small>
              <strong>{court.name}</strong>
            </div>
            <div>
              <small>مدة الحصة</small>
              <strong>{sport.duration} دقيقة</strong>
            </div>
            <div>
              <small>الفئة العمرية</small>
              <strong>{sport.ageRange}</strong>
            </div>
            <div>
              <small>المستوى</small>
              <strong>{sport.level}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="training-detail-layout">
        <div className="training-detail-main">
          <article className="training-detail-panel">
            <div className="training-catalog-heading compact">
              <div>
                <p>PROGRAM DETAILS</p>
                <h2>ماذا يشمل التدريب؟</h2>
              </div>
            </div>
            <div className="training-features-grid">
              {sport.features.map((feature, index) => (
                <div key={feature}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{feature}</strong>
                </div>
              ))}
            </div>
          </article>


          <article className="training-detail-panel" id="coaches">
            <div className="training-catalog-heading compact">
              <div>
                <p>PROFESSIONAL COACHES</p>
                <h2>تعرف على الكباتن</h2>
              </div>
              <span className="training-view-only-pill">للعرض فقط</span>
            </div>

            <div className="training-coaches-grid">
              {coaches.map((coach) => {
                const coachUrl = `/training/coaches/${coach.id}?sport=${sport.id}&court=${court.id}`;

                return (
                  <article className="training-coach-card" key={coach.id}>
                    <Link
                      className="training-coach-card__image"
                      to={coachUrl}
                      aria-label={`عرض الملف الكامل للكابتن ${coach.name}`}
                    >
                      <img src={coach.image} alt={coach.name} loading="lazy" />
                      <span>⭐ {coach.rating}</span>
                    </Link>

                    <div className="training-coach-card__body">
                      <small>{coach.title}</small>
                      <h3>
                        <Link to={coachUrl}>{coach.name}</Link>
                      </h3>
                      <p>{coach.bio}</p>

                      <div className="training-coach-card__meta">
                        <span>{coach.experienceYears} سنوات خبرة</span>
                        <span>{coach.sessions}+ حصة</span>
                        <span>{coach.phoneMasked}</span>
                      </div>

                      <div className="training-coach-card__actions">
                        <Link className="training-secondary-button full" to={coachUrl}>
                          عرض التفاصيل والـ CV
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </article>
        </div>

        <aside className="training-booking-summary">
          <span>ملخص التسجيل</span>
          <h2>{sport.name}</h2>
          <dl>
            <div>
              <dt>الملعب</dt>
              <dd>{court.name?.ar ?? court.name}</dd>
            </div>
            <div>
              <dt>المواعيد</dt>
              <dd>للعرض فقط</dd>
            </div>
            <div>
              <dt>الكابتن</dt>
              <dd>تحدده الإدارة</dd>
            </div>
            <div>
              <dt>السعر</dt>
              <dd>{sport.price} ج.م</dd>
            </div>
          </dl>

          <Link className="training-action-button full" to={registrationUrl}>
            استكمال التسجيل
          </Link>

          <p>
            مش مطلوب تختار كابتن أو موعد. الإدارة هتحددهم بعد مراجعة الطلب.
          </p>
        </aside>
      </section>
    </div>
  );
}
