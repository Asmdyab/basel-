import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { getCoach as getFallbackCoach, getTrainingSport } from "../data/trainingCatalog.js";
import { getCoach } from "../services/coachService.js";
import { getCourt as getFallbackCourt, getCourtTrainingSportId } from "../data/courts.js";
import { getCourt } from "../services/courtService.js";
import "./TrainingCatalog.css";

export default function CoachProfilePage() {
  const { coachId } = useParams();
  const [searchParams] = useSearchParams();
  const [coach, setCoach] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const sportId = searchParams.get("sport") || coach?.sportId;
  const courtId = searchParams.get("court") || "";
  const sport = getTrainingSport(sportId);
  const [court, setCourt] = useState(null);

  useEffect(() => {
    let cancelled = false;

    getCoach(coachId)
      .then((data) => { if (!cancelled) setCoach(data); })
      .catch(() => {
        const fallback = getFallbackCoach(coachId);
        if (!cancelled) setCoach(fallback ?? null);
      })
      .finally(() => { if (!cancelled) setIsLoading(false); });

    if (courtId) {
      getCourt(courtId)
        .then((data) => { if (!cancelled) setCourt(data); })
        .catch(() => { if (!cancelled) setCourt(getFallbackCourt(courtId)); });
    }

    return () => { cancelled = true; };
  }, [coachId, courtId]);

  const courtMatchesSport = court && sport && getCourtTrainingSportId(court) === sport.id;

  if (isLoading) {
    return (
      <div className="training-catalog-page" dir="rtl">
        <div className="training-catalog-empty">
          <h1>جاري تحميل بيانات الكابتن...</h1>
        </div>
      </div>
    );
  }

  if (!coach || !sport || !court || !courtMatchesSport) {
    return (
      <div className="training-catalog-page" dir="rtl">
        <div className="training-catalog-empty">
          <h1>بيانات الكابتن أو الملعب غير مكتملة</h1>
          <p>اختار الملعب أولًا، وبعدها افتح الكباتن المتاحين للتدريب عليه.</p>
          <Link className="training-action-button" to="/courts">
            الرجوع للملاعب
          </Link>
        </div>
      </div>
    );
  }

  const trainingDetailsUrl = `/training/${sport.id}?court=${court.id}#coaches`;

  return (
    <div className="training-catalog-page" dir="rtl">
      <section className="coach-profile-hero">
        <div className="coach-profile-hero__image">
          <img src={coach.image} alt={coach.name} />
        </div>

        <div className="coach-profile-hero__content">
          <Link className="training-back-link dark" to={trainingDetailsUrl}>
            → الرجوع لمدربي {sport.name}
          </Link>
          <span>{coach.title}</span>
          <h1>{coach.name}</h1>
          <p>{coach.bio}</p>
          <div className="coach-profile-chips">
            {(coach.specialties ?? []).map((specialty) => (
              <span key={specialty}>{specialty}</span>
            ))}
          </div>
        </div>

        <div className="coach-profile-hero__side">
          <div>
            <small>التقييم</small>
            <strong>⭐ {coach.rating}</strong>
          </div>
          <div>
            <small>الخبرة</small>
            <strong>{coach.experienceYears} سنوات</strong>
          </div>
          <div>
            <small>الحصص</small>
            <strong>{coach.sessions}+</strong>
          </div>
          <div>
            <small>سعر الحصة</small>
            <strong>{coach.price} ج.م</strong>
          </div>
        </div>
      </section>

      <section className="coach-profile-layout">
        <main className="coach-profile-main">
          <article className="coach-profile-panel">
            <p className="coach-profile-eyebrow">CHAMPIONSHIPS</p>
            <h2>البطولات والإنجازات</h2>
            <div className="coach-achievements-list">
              {(coach.championships ?? []).map((championship, index) => (
                <div key={championship}>
                  <span>🏆</span>
                  <div>
                    <small>إنجاز {index + 1}</small>
                    <strong>{championship}</strong>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="coach-profile-panel">
            <p className="coach-profile-eyebrow">EXPERIENCE</p>
            <h2>الخبرات العملية</h2>
            <div className="coach-timeline">
              {(coach.experience ?? []).map((item) => (
                <div key={`${item.place}-${item.period}`}>
                  <span />
                  <div>
                    <small>{item.period}</small>
                    <h3>{item.role}</h3>
                    <p>{item.place}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="coach-profile-panel">
            <p className="coach-profile-eyebrow">CERTIFICATES</p>
            <h2>الشهادات والدورات</h2>
            <div className="coach-certificates-grid">
              {(coach.certificates ?? []).map((certificate) => (
                <div key={certificate}>
                  <span>✓</span>
                  <strong>{certificate}</strong>
                </div>
              ))}
            </div>
          </article>
        </main>

        <aside className="coach-contact-card">
          <span>ملف الكابتن</span>
          <h2>التفاصيل والـ CV للعرض فقط</h2>
          <p>
            تقدر تشوف خبرات الكابتن وبطولاته وشهاداته وبياناته. اختيار الكابتن
            مش مطلوب أثناء التسجيل، والإدارة هي اللي بتحدد الكابتن المناسب بعد
            مراجعة الطلب.
          </p>

          <div className="coach-masked-phone">
            <small>رقم الموبايل</small>
            <strong>{coach.phoneMasked}</strong>
          </div>

          <div className="coach-selected-slot">
            <small>الملعب</small>
            <strong>{court.name}</strong>
          </div>

          <div className="coach-selected-slot">
            <small>مواعيد التدريب</small>
            <strong>تظهر في صفحة تفاصيل اللعبة — للعرض فقط</strong>
          </div>

          <Link className="training-action-button full" to={trainingDetailsUrl}>
            الرجوع لتفاصيل التدريب
          </Link>
        </aside>
      </section>
    </div>
  );
}
