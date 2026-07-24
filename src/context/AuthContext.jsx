import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

const AuthContext = createContext(null);

const API_BASE_URL = String(
  import.meta.env.VITE_API_BASE_URL ?? ""
).replace(/\/$/, "");

const ACCESS_TOKEN_KEY = "accessToken";
const SESSION_USER_KEY = "khub-user";

function normalizeEmail(email) {
  return String(email ?? "")
    .trim()
    .toLowerCase();
}

function readSavedToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function readSavedUser() {
  try {
    const savedUser =
      localStorage.getItem(SESSION_USER_KEY);

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  } catch {
    return null;
  }
}

function getTokenFromResponse(data) {
  return (
    data?.accessToken ??
    data?.token ??
    data?.value?.accessToken ??
    data?.value?.token ??
    null
  );
}

function decodeJwtPayload(token) {
  try {
    const payloadPart = token.split(".")[1];

    if (!payloadPart) {
      return null;
    }

    const normalizedPayload = payloadPart
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const padding =
      "=".repeat(
        (4 - (normalizedPayload.length % 4)) % 4
      );

    const json = window.atob(
      normalizedPayload + padding
    );

    const decoded = decodeURIComponent(
      Array.from(json)
        .map(
          (character) =>
            `%${character
              .charCodeAt(0)
              .toString(16)
              .padStart(2, "0")}`
        )
        .join("")
    );

    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function isTokenExpired(token) {
  const payload = decodeJwtPayload(token);

  if (!payload?.exp) {
    return true;
  }

  const expirationTime = payload.exp * 1000;

  return Date.now() >= expirationTime;
}

function createUserFromToken(token) {
  const payload = decodeJwtPayload(token);

  if (!payload) {
    return null;
  }

  const nameClaim =
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";

  const emailClaim =
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";

  const roleClaim =
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

  const idClaim =
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";

  return {
    id:
      payload[idClaim] ??
      payload.sub ??
      null,

    name:
      payload[nameClaim] ??
      payload.name ??
      "K-HUB User",

    email:
      payload[emailClaim] ??
      payload.email ??
      "",

    role:
      payload[roleClaim] ??
      payload.role ??
      "User",
  };
}

async function fetchApi(path, options) {
  try {
    return await fetch(`${API_BASE_URL}${path}`, options);
  } catch {
    throw new Error(
      "تعذر الاتصال بالسيرفر. تأكد إن الـ Backend شغال على https://localhost:7187 ثم حاول مرة ثانية."
    );
  }
}

async function readResponse(response) {
  const data = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    const validationErrors = data?.errors
      ? Object.values(data.errors)
          .flat()
          .join(" ")
      : null;

    throw new Error(
      data?.error ??
        data?.detail ??
        validationErrors ??
        data?.title ??
        "حدث خطأ أثناء تنفيذ الطلب."
    );
  }

  return data;
}

function getInitialSession() {
  const token = readSavedToken();
  const savedUser = readSavedUser();

  if (
    !token ||
    !savedUser ||
    isTokenExpired(token)
  ) {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(SESSION_USER_KEY);

    return {
      user: null,
      accessToken: null,
    };
  }

  return {
    user: savedUser,
    accessToken: token,
  };
}

export function AuthProvider({ children }) {
  const [initialSession] =
    useState(getInitialSession);

  const [user, setUser] = useState(
    initialSession.user
  );

  const [accessToken, setAccessToken] =
    useState(initialSession.accessToken);

  const [isLoading, setIsLoading] =
    useState(false);

  function saveSession(token, sessionUser) {
    localStorage.setItem(
      ACCESS_TOKEN_KEY,
      token
    );

    localStorage.setItem(
      SESSION_USER_KEY,
      JSON.stringify(sessionUser)
    );

    setAccessToken(token);
    setUser(sessionUser);
  }

  async function login(credentials) {
    const email = normalizeEmail(
      credentials.email
    );

    const password = String(
      credentials.password ?? ""
    );

    if (!email || !password) {
      throw new Error(
        "اكتب الإيميل والباسورد."
      );
    }

    setIsLoading(true);

    try {
      const response = await fetchApi(
        "/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await readResponse(response);

      const token =
        getTokenFromResponse(data);

      if (!token) {
        throw new Error(
          "السيرفر لم يرجع Access Token."
        );
      }

      if (isTokenExpired(token)) {
        throw new Error(
          "التوكن المستلمة من السيرفر منتهية."
        );
      }

      const sessionUser =
        createUserFromToken(token);

      if (!sessionUser) {
        throw new Error(
          "تعذر قراءة بيانات المستخدم من التوكن."
        );
      }

      saveSession(token, sessionUser);

      return sessionUser;
    } finally {
      setIsLoading(false);
    }
  }

  async function register(userData) {
    const fullName = String(
      userData.fullName ??
        userData.name ??
        ""
    ).trim();

    const email = normalizeEmail(
      userData.email
    );

    const password = String(
      userData.password ?? ""
    );

    const phoneNumber = String(
      userData.phoneNumber ??
        userData.phone ??
        ""
    ).trim();

    if (
      !fullName ||
      !email ||
      !password ||
      !phoneNumber
    ) {
      throw new Error(
        "كمّل الاسم والإيميل ورقم الموبايل والباسورد."
      );
    }

    setIsLoading(true);

    try {
      const response = await fetchApi(
        "/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            fullName,
            email,
            password,
            phoneNumber,
          }),
        }
      );

      await readResponse(response);
    } finally {
      setIsLoading(false);
    }

    return login({
      email,
      password,
    });
  }

  function logout() {
    localStorage.removeItem(
      ACCESS_TOKEN_KEY
    );

    localStorage.removeItem(
      SESSION_USER_KEY
    );

    setAccessToken(null);
    setUser(null);
  }

  const isAuthenticated =
    Boolean(user && accessToken);

  const isAdmin =
    user?.role === "Admin";

  const value = useMemo(
    () => ({
      user,
      accessToken,
      login,
      register,
      logout,
      isAdmin,
      isAuthenticated,
      isLoading,
    }),
    [
      user,
      accessToken,
      isAdmin,
      isAuthenticated,
      isLoading,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}