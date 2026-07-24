import { useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { getCourt, getCourtTrainingSportId } from "../data/courts.js";
import {
  getSportCoaches,
  getTrainingSport,
} from "../data/trainingCatalog.js";
import "./TrainingCatalog.css";

export default function TrainingSportDetailsPage() {
  const { sportId } = useParams();
  const [searchParams] = useSearchParams();
  const courtId = searchParams.get("court") || "";

  const sport = getTrainingSport(sportId);
  const court = getCourt(courtId);
  const coaches = useMemo(() => getSportCoaches(sportId), [sportId]);

  const courtMatchesSport =
    court && sport && getCourtTrainingSportId(court) === sport.id;

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

  const registrationUrl = `/training/register/${sport.id}?court=${encodeURIComponent(
    court.id
  )}`;

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
            → الرجوع إلى {court.name.ar}
          </Link>
          <span>{sport.englishName}</span>
          <h1>تدريب {sport.name}</h1>
          <p>{sport.fullDescription}</p>
          <div className="training-sport-hero__stats">
            <div>
              <small>الملعب</small>
              <strong>{court.name.ar}</strong>
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

          <article className="training-detail-panel" id="times">
            <div className="training-catalog-heading compact">
              <div>
                <p>AVAILABLE TIMES</p>
                <h2>المواعيد المتاحة</h2>
              </div>
              <span className="training-view-only-pill">للعرض فقط</span>
            </div>

            <p className="training-times-note">
              المواعيد دي للمعرفة فقط. المستخدم مش بيختار موعد أثناء التسجيل،
              والإدارة بتحدد الموعد النهائي بعد مراجعة الطلب والتواصل معاه.
            </p>

            <div className="training-slots-grid">
              {sport.availableSlots.map((slot) => (
                <div key={slot.id} className="training-slot-card view-only">
                  <span>{slot.day}</span>
                  <strong>{slot.time}</strong>
                  <small>{slot.seats} أماكن متاحة</small>
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

            <p className="training-times-note">
              تقدر تشوف صورة كل كابتن وخبراته وبطولاته وشهاداته. اختيار
              الكابتن مش مطلوب أثناء التسجيل، والإدارة هي اللي بتحدد الكابتن
              المناسب بعد مراجعة الطلب.
            </p>

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
                        <Link
                          className="training-secondary-button full"
                          to={coachUrl}
                        >
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
              <dd>{court.name.ar}</dd>
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
