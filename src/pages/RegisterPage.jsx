import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useUserProfiles } from "../context/UserProfileContext.jsx";

export default function RegisterPage() {
  const { register } = useAuth();
  const { upsertProfile } = useUserProfiles();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("تأكيد الباسورد مش مطابق للباسورد.");
      return;
    }

    try {
      setIsSubmitting(true);
      const registeredUser = await register(form);

      upsertProfile(registeredUser.id, {
        name: registeredUser.name ?? form.name.trim(),
        email: registeredUser.email ?? form.email.trim(),
        phone: form.phone.trim(),
      });

      navigate(
        registeredUser.role === "Admin" ? "/admin" : "/courts",
        { replace: true }
      );
    } catch (registrationError) {
      setError(
        registrationError instanceof Error
          ? registrationError.message
          : "تعذر إنشاء الحساب."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-card auth-card-v2">
        <div className="auth-intro">
          <img className="auth-logo-img" src="/k-hub-logo.png" alt="K-HUB logo" />
          <p className="eyebrow">تسجيل مستخدم جديد</p>
          <h1>اعمل حساب جديد واحجز ملعبك</h1>
          <p>سجل بياناتك مرة واحدة، وبعد كده تقدر تدخل وتتابع حجوزاتك وصفحتك الخاصة.</p>

          <div className="auth-benefits">
            <span>✓ إنشاء حساب جديد</span>
            <span>✓ صفحة شخصية خاصة</span>
            <span>✓ متابعة الحجوزات والنقاط</span>
          </div>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-title">
            <h2>بيانات التسجيل</h2>
            <p>اكتب بيانات المستخدم الجديد.</p>
          </div>

          <label>
            الاسم
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="مثال: محمد أحمد" autoComplete="name" disabled={isSubmitting} />
          </label>
          <label>
            الإيميل
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="example@email.com" autoComplete="email" disabled={isSubmitting} />
          </label>
          <label>
            رقم الموبايل
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="01012345678" autoComplete="tel" disabled={isSubmitting} />
          </label>
          <label>
            الباسورد
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="6 حروف أو أرقام على الأقل" autoComplete="new-password" disabled={isSubmitting} />
          </label>
          <label>
            تأكيد الباسورد
            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="اكتب الباسورد تاني" autoComplete="new-password" disabled={isSubmitting} />
          </label>

          {error && <p className="error-text">⚠ {error}</p>}

          <button className="btn btn-primary full-width" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
          </button>

          <div className="auth-switch-row">
            <span>عندك حساب بالفعل؟</span>
            <Link className="link-btn" to="/login">تسجيل الدخول</Link>
          </div>

          <Link className="muted-link" to="/">رجوع للرئيسية</Link>
        </form>
      </section>
    </div>
  );
}
