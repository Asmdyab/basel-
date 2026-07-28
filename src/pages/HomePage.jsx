import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { courts as fallbackCourts, paymentMethods } from "../data/courts.js";
import CourtCard from "../components/CourtCard.jsx";
import { getCourts } from "../services/courtService.js";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function HomePage() {
  const { t, pick } = useLanguage();
  const [courts, setCourts] = useState([]);

  useEffect(() => {
    let cancelled = false;

    getCourts()
      .then((data) => {
        if (!cancelled) setCourts(data);
      })
      .catch(() => {
        if (!cancelled) setCourts(fallbackCourts);
      });

    return () => { cancelled = true; };
  }, []);

  const featuredCourts = courts.slice(0, 3);
  const sportCards = [...new Map(courts.map((court) => [court.type, court])).values()];

  return (
    <div className="page">
      <section className="hero hero-v2">
        <div className="hero-content hero-glass">
          <p className="eyebrow">K-HUB Sports Club</p>
          <h1>اختار الملعب وشوف التدريب والكباتن المتاحين</h1>
          <p>
            ابدأ من صفحة الملاعب، افتح تفاصيل الملعب، شوف مواعيد التدريب
            المتاحة وملفات الكباتن، وبعدها ابعت طلب التسجيل للإدارة.
          </p>

          <div className="hero-actions">
            <Link className="btn btn-primary" to="/courts">
              استعرض الملاعب
            </Link>
            <Link className="btn btn-outline" to="/about">
              اعرف أكثر عن النادي
            </Link>
          </div>

          <div className="hero-sports-strip" aria-label="Available sports">
            {sportCards.map((court) => (
              <span key={court.id}>{court.icon} {pick(court.typeLabel)}</span>
            ))}
          </div>
        </div>

        <div className="hero-visual-card">
          <div className="live-badge"><span /> Training programs</div>
          <div className="booking-preview">
            <div className="preview-top">
              <div>
                <small>المواعيد المتاحة</small>
                <strong>تعرض قبل التسجيل</strong>
              </div>
              <span>🏅</span>
            </div>
            <h3>اختار الكابتن المناسب</h3>
            <div className="preview-timeline">
              <span className="done">ملعب</span>
              <span className="active">مدرب</span>
              <span>بيانات</span>
              <span>مراجعة</span>
            </div>
            <div className="preview-user">
              <div className="avatar-stack">
                <i>م</i>
                <i>أ</i>
                <i>ك</i>
              </div>
              <p>الإدارة تحدد الموعد النهائي بعد مراجعة الطلب</p>
            </div>
          </div>

          <div className="floating-stat one">
            <strong>{courts.length}</strong>
            <span>ملاعب</span>
          </div>
          <div className="floating-stat two">
            <strong>CV</strong>
            <span>ملفات مدربين</span>
          </div>
        </div>
      </section>

      <section className="stats-row section compact-section">
        <div>
          <strong>{courts.length}</strong>
          <span>ملاعب متاحة</span>
        </div>
        <div>
          <strong>{sportCards.length}</strong>
          <span>ألعاب رياضية</span>
        </div>
        <div>
          <strong>08:00 - 23:00</strong>
          <span>مواعيد العمل</span>
        </div>
        <div>
          <strong>3</strong>
          <span>لغات</span>
        </div>
      </section>

      <section className="section compact-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Sports</p>
            <h2>{t("nav.courts")}</h2>
          </div>
        </div>

        <div className="sports-showcase-grid">
          {sportCards.map((court) => (
            <Link
              key={court.type}
              className="sport-showcase-card"
              to="/courts"
              style={{ "--accent": court.accent }}
            >
              <span>{court.icon}</span>
              <strong>{pick(court.typeLabel)}</strong>
              <p>{pick(court.description)}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section compact-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">طرق الدفع</p>
            <h2>اختار وسيلة الدفع المناسبة عند التسجيل</h2>
            <p>تسجيل التدريب الإلكتروني يحتاج رفع صورة واضحة لإثبات الدفع.</p>
          </div>
        </div>

        <div className="payment-grid">
          {paymentMethods.map((method) => (
            <article
              className="payment-card"
              key={method.id}
              style={{ "--payment-accent": method.accent }}
            >
              <div className="payment-badge">{method.short}</div>
              <div>
                <h3>{pick(method.name)}</h3>
                <p>{pick(method.description)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Featured Courts</p>
            <h2>ابدأ من الملعب المناسب</h2>
          </div>
          <Link to="/courts" className="link-btn">
            كل الملاعب ←
          </Link>
        </div>

        <div className="cards-grid">
          {featuredCourts.map((court) => (
            <CourtCard key={court.id} court={court} />
          ))}
        </div>
      </section>

      <section className="steps section compact-section">
        <div className="step-card">
          <span>1</span>
          <h3>اختار الملعب</h3>
          <p>شوف صور الملعب ومميزاته ومكانه داخل النادي.</p>
        </div>
        <div className="step-card featured-step">
          <span>2</span>
          <h3>شوف المواعيد والكباتن</h3>
          <p>المواعيد للعرض فقط، وتقدر تفتح الـ CV الكامل لكل كابتن.</p>
        </div>
        <div className="step-card">
          <span>3</span>
          <h3>أرسل طلب التسجيل</h3>
          <p>املأ بياناتك وارفع إثبات الدفع، والإدارة تتواصل معاك لتأكيد الموعد.</p>
        </div>
      </section>

      <section className="cta-section section compact-section">
        <div>
          <p className="eyebrow">Ready?</p>
          <h2>ابدأ من صفحة الملاعب</h2>
          <p>اختار الملعب المناسب وشوف كل تفاصيل التدريب قبل إرسال الطلب.</p>
        </div>
        <Link className="btn btn-primary" to="/courts">
          اختار ملعب
        </Link>
      </section>
    </div>
  );
}
