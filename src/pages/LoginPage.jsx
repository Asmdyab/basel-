import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password) {
      setError("اكتب الإيميل والباسورد.");
      return;
    }

    try {
      setIsSubmitting(true);

      const loggedInUser = await login({
        email: form.email.trim(),
        password: form.password,
      });

      const previousLocation =
        location.state?.from;

      if (previousLocation) {
        const destination =
          typeof previousLocation === "string"
            ? previousLocation
            : previousLocation.pathname;

        navigate(destination, {
          replace: true,
        });

        return;
      }

      navigate(
        loggedInUser?.role === "Admin"
          ? "/admin"
          : "/courts",
        {
          replace: true,
        }
      );
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "تعذر تسجيل الدخول."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-card auth-card-v2">
        <div className="auth-intro">
          <img
            className="auth-logo-img"
            src="/k-hub-logo.png"
            alt="K-HUB logo"
          />

          <p className="eyebrow">
            تسجيل الدخول
          </p>

          <h1>ادخل على حسابك في K-HUB</h1>

          <p>
            استخدم الإيميل والباسورد الخاصين
            بحسابك للوصول إلى حجوزاتك ومتابعة
            حالة الدفع والحجز.
          </p>

          <div className="auth-benefits">
            <span>
              ✓ دخول آمن بإيميل وباسورد
            </span>

            <span>
              ✓ متابعة الحجوزات وحالة الدفع
            </span>

            <span>
              ✓ لوحة إدارة خاصة للمسؤولين فقط
            </span>
          </div>
        </div>

        <form
          className="form"
          onSubmit={handleSubmit}
        >
          <div className="form-title">
            <h2>تسجيل الدخول</h2>
            <p>اكتب بيانات حسابك المسجلة.</p>
          </div>

          <label>
            الإيميل

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@email.com"
              autoComplete="email"
              disabled={isSubmitting}
            />
          </label>

          <label>
            الباسورد

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="اكتب الباسورد"
              autoComplete="current-password"
              disabled={isSubmitting}
            />
          </label>

          {error && (
            <p className="error-text">
              ⚠ {error}
            </p>
          )}

          <button
            className="btn btn-primary full-width"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "جاري تسجيل الدخول..."
              : "دخول"}
          </button>

          <div className="auth-switch-row">
            <span>لسه معندكش حساب؟</span>

            <Link
              className="link-btn"
              to="/register"
            >
              سجل مستخدم جديد
            </Link>
          </div>

          <Link
            className="muted-link"
            to="/"
          >
            رجوع للرئيسية
          </Link>
        </form>
      </section>
    </div>
  );
}