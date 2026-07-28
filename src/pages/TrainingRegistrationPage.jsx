import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useUserProfiles } from "../context/UserProfileContext.jsx";
import { getCourt as getFallbackCourt, getCourtTrainingSportId } from "../data/courts.js";
import { getTrainingSport } from "../data/trainingCatalog.js";
import { getCourt } from "../services/courtService.js";

import {
  validateImageFile,
} from "../utils/imageUtils.js";
import { convertImageToJpeg } from "../utils/convertImageToJpeg.js";
import "./TrainingRegistrationPage.css";

const paymentMethods = [
  { value: "InstaPay", label: "InstaPay" },
  { value: "VodafoneCash", label: "Vodafone Cash" },
];

function useImagePreview(file) {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return undefined;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return preview;
}

export default function TrainingRegistrationPage() {
  const navigate = useNavigate();
  const { sportId } = useParams();
  const [searchParams] = useSearchParams();
  const courtId = searchParams.get("court") || "";

  const sport = getTrainingSport(sportId);
  const [court, setCourt] = useState(null);
  const [apiCourt, setApiCourt] = useState(null);

  useEffect(() => {
    let cancelled = false;

    getCourt(courtId)
      .then((data) => {
        if (!cancelled) {
          setApiCourt(data);
          setCourt(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          const fallback = getFallbackCourt(courtId);
          setApiCourt(null);
          setCourt(fallback);
        }
      });

    return () => { cancelled = true; };
  }, [courtId]);

  const courtMatchesSport =
    court && sport && getCourtTrainingSportId(court) === sport.id;

  const { user, accessToken } = useAuth();
  const { getProfile, submitTrainingRegistration } = useUserProfiles();
  const existingProfile = getProfile(user?.id);

  const [form, setForm] = useState({
    participantName: existingProfile?.name ?? user?.name ?? "",
    age: existingProfile?.age ? String(existingProfile.age) : "",
    paymentMethod: "",
    transactionReference: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [paymentProofImage, setPaymentProofImage] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const profilePreview = useImagePreview(profileImage);
  const paymentPreview = useImagePreview(paymentProofImage);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError("");
    setSuccess("");
  }

  async function handleImageChange(event, setter, label) {
    const selectedFile = event.target.files?.[0] ?? null;

    if (!selectedFile) {
      setter(null);
      return;
    }

    try {
      setError("");
      setSuccess("");

      const convertedFile = await convertImageToJpeg(selectedFile);
      const validationError = validateImageFile(convertedFile, label);

      if (validationError) {
        event.target.value = "";
        setter(null);
        setError(validationError);
        return;
      }

      setter(convertedFile);
    } catch (error) {
      event.target.value = "";
      setter(null);

      setError(
        error instanceof Error
          ? error.message
          : "تعذر تجهيز الصورة."
      );
    }
  }

  function validateForm() {
    if (!sport || !court || !courtMatchesSport) {
      return "اختار الملعب قبل التسجيل.";
    }

    if (form.participantName.trim().length < 2) {
      return "اكتب اسم اللاعب بشكل صحيح.";
    }

    const age = Number(form.age);

    if (!Number.isInteger(age) || age < 5 || age > 100) {
      return "اكتب سن صحيح من 5 إلى 100 سنة.";
    }

    if (!form.paymentMethod) {
      return "اختار طريقة الدفع.";
    }

    if (!form.transactionReference.trim()) {
      return "اكتب رقم أو مرجع عملية الدفع.";
    }

    if (!profileImage && !existingProfile?.profileImage) {
      return "الصورة الشخصية مطلوبة.";
    }

    if (!paymentProofImage) {
      return "صورة إثبات الدفع مطلوبة.";
    }

    return validateImageFile(paymentProofImage, "صورة إثبات الدفع");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const returnUrl = `/training/register/${sportId}?court=${encodeURIComponent(courtId)}`;

    if (!user || !accessToken) {
      navigate("/login", {
        replace: true,
        state: { from: returnUrl },
      });
      return;
    }

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("courtId", apiCourt?.id ?? court.id);
      formData.append("participantName", form.participantName.trim());
      formData.append("age", String(Number(form.age)));
      formData.append("phone", existingProfile?.phone ?? user.phone ?? "");
      formData.append("paymentMethod", form.paymentMethod);
      formData.append("transactionReference", form.transactionReference.trim());

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      if (paymentProofImage) {
        formData.append("paymentProofImage", paymentProofImage);
      }

      await submitTrainingRegistration(formData);

      setSuccess(
        "تم إرسال طلب التدريب للإدارة بنجاح. الإدارة هتحدد الكابتن والموعد النهائي بعد مراجعة الطلب."
      );
      setPaymentProofImage(null);
      setProfileImage(null);

      window.setTimeout(() => {
        navigate("/profile", { replace: true });
      }, 900);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "حدث خطأ أثناء حفظ الطلب."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!sport || !court || !courtMatchesSport) {
    return (
      <main className="training-registration-page" dir="rtl">
        <section className="training-registration-missing">
          <h1>اختيارات التسجيل غير مكتملة</h1>
          <p>
            التسجيل يبدأ من صفحة الملاعب. اختار الملعب، وبعدها افتح تفاصيل
            التدريب واستكمل التسجيل.
          </p>
          <Link className="registration-primary-button" to="/courts">
            الرجوع للملاعب
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="training-registration-page" dir="rtl">
      <section className="training-registration-shell">
        <header className="training-registration-header">
          <Link
            to={`/training/${sport.id}?court=${court.id}`}
            className="registration-back-link"
          >
            → الرجوع لتفاصيل التدريب
          </Link>
          <span>K-HUB TRAINING REQUEST</span>
          <h1>استكمال تسجيل التدريب</h1>
          <p>
            راجع الملعب واللعبة، ثم أدخل بيانات اللاعب والدفع. الكابتن والموعد
            النهائي تحددهما الإدارة بعد مراجعة الطلب.
          </p>
        </header>

        <section className="training-selection-summary">
          <div className="training-selection-sport">
            <img src={sport.image} alt={sport.name} />
            <div>
              <small>اللعبة المختارة</small>
              <strong>{sport.name}</strong>
              <span>
                {sport.duration} دقيقة • {sport.level}
              </span>
            </div>
          </div>

          <div className="training-selection-detail">
            <small>الملعب</small>
            <strong>{court.name?.ar ?? court.name}</strong>
          </div>

          <div className="training-selection-detail">
            <small>الكابتن</small>
            <strong>تحدده الإدارة</strong>
          </div>

          <div className="training-selection-detail">
            <small>قيمة التدريب</small>
            <strong>{sport.price} ج.م</strong>
          </div>
        </section>

        <div className="registration-schedule-notice">
          <strong>الكابتن والمواعيد تحددهما الإدارة</strong>
          <span>
            المواعيد والكباتن المعروضين في صفحة التفاصيل للمشاهدة فقط. الإدارة
            هتختار الكابتن والموعد المتاح وتؤكدهما معاك بعد مراجعة التسجيل
            والدفع.
          </span>
        </div>

        <form
          className="training-registration-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <section className="registration-form-section">
            <div className="registration-section-title">
              <span>01</span>
              <div>
                <small>PLAYER INFORMATION</small>
                <h2>بيانات اللاعب</h2>
              </div>
            </div>

            <div className="registration-form-grid">
              <label className="registration-field">
                <span>اسم اللاعب</span>
                <input
                  type="text"
                  name="participantName"
                  value={form.participantName}
                  onChange={handleInputChange}
                  placeholder="اكتب الاسم بالكامل"
                  autoComplete="name"
                />
              </label>

              <label className="registration-field">
                <span>السن</span>
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleInputChange}
                  placeholder="مثال: 18"
                  min="5"
                  max="100"
                />
              </label>
            </div>

            <FileUploadField
              title="الصورة الشخصية"
              description={
                existingProfile?.profileImage
                  ? "اختار صورة جديدة أو احتفظ بالصورة الحالية."
                  : "ارفع صورة واضحة للاعب."
              }
              inputName="profileImage"
              preview={profilePreview || existingProfile?.profileImage || null}
              variant="profile"
              onChange={(event) =>
                handleImageChange(event, setProfileImage, "الصورة الشخصية")
              }
            />
          </section>

          <section className="registration-form-section">
            <div className="registration-section-title">
              <span>02</span>
              <div>
                <small>PAYMENT DETAILS</small>
                <h2>بيانات الدفع</h2>
              </div>
            </div>

            <div className="registration-field">
              <span>طريقة الدفع</span>
              <div className="registration-payment-grid">
                {paymentMethods.map((method) => (
                  <label
                    className={`registration-payment-card ${
                      form.paymentMethod === method.value ? "selected" : ""
                    }`}
                    key={method.value}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={form.paymentMethod === method.value}
                      onChange={handleInputChange}
                    />
                    <strong>{method.label}</strong>
                    <span>تحويل إلكتروني</span>
                  </label>
                ))}
              </div>
              <small className="registration-field-hint">
                الدفع عند الوصول غير متاح لتسجيل التدريب.
              </small>
            </div>

            <label className="registration-field">
              <span>رقم عملية الدفع</span>
              <input
                type="text"
                name="transactionReference"
                value={form.transactionReference}
                onChange={handleInputChange}
                placeholder="مثال: INSTAPAY-458921"
              />
            </label>

            <FileUploadField
              title="صورة إثبات الدفع"
              description="ارفع صورة التحويل أو إيصال الدفع بشكل واضح."
              inputName="paymentProofImage"
              preview={paymentPreview}
              variant="payment"
              onChange={(event) =>
                handleImageChange(event, setPaymentProofImage, "صورة إثبات الدفع")
              }
            />
          </section>

          {error && <div className="registration-message error">{error}</div>}
          {success && (
            <div className="registration-message success">{success}</div>
          )}

          <button
            className="registration-submit-button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "جاري حفظ الطلب..." : "إرسال طلب التدريب للإدارة"}
          </button>

          <Link className="registration-profile-link" to="/profile">
            عرض صفحتي الشخصية
          </Link>
        </form>
      </section>
    </main>
  );
}

function FileUploadField({
  title,
  description,
  inputName,
  preview,
  onChange,
  variant,
}) {
  const safePreview =
    typeof preview === "string" && preview.trim().length > 0 ? preview : null;

  return (
    <div className={`registration-field upload-field upload-field--${variant}`}>
      <span>{title}</span>
      <label className={`registration-upload registration-upload--${variant}`}>
       <input
        type="file"
        name={inputName}
        accept="image/*,.heic,.heif"
        onChange={onChange}
      />

        {safePreview ? (
          <img
            className={`registration-image-preview registration-image-preview--${variant}`}
            src={safePreview}
            alt={title}
          />
        ) : (
          <div className="registration-upload-placeholder">
            <strong>اضغط لاختيار صورة</strong>
            <small>{description}</small>
            <small> بحد أقصى 5 MB</small>
          </div>
        )}
      </label>
    </div>
  );
}
