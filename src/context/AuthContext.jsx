import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import { loginApi, registerApi } from "../services/authService.js";

const AuthContext = createContext(null);

const ACCESS_TOKEN_KEY = "accessToken";
const SESSION_USER_KEY = "khub-user";

const NAME_CLAIM =
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";

const EMAIL_CLAIM =
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";

const ROLE_CLAIM =
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

const ID_CLAIM =
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";

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

function decodeJwtPayload(token) {
  try {
    const payloadPart = token.split(".")[1];

    if (!payloadPart) {
      return null;
    }

    const normalizedPayload = payloadPart
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const padding = "=".repeat(
      (4 - (normalizedPayload.length % 4)) % 4
    );

    const binaryValue = window.atob(
      normalizedPayload + padding
    );

    const bytes = Uint8Array.from(
      binaryValue,
      (character) => character.charCodeAt(0)
    );

    const decodedValue =
      new TextDecoder().decode(bytes);

    return JSON.parse(decodedValue);
  } catch {
    return null;
  }
}

function isTokenExpired(token) {
  const payload = decodeJwtPayload(token);

  if (!payload?.exp) {
    return true;
  }

  return Date.now() >= payload.exp * 1000;
}

function createUserFromToken(token) {
  const payload = decodeJwtPayload(token);

  if (!payload) {
    return null;
  }

  return {
    id:
      payload[ID_CLAIM] ??
      payload.sub ??
      null,

    name:
      payload[NAME_CLAIM] ??
      payload.name ??
      "K-HUB User",

    email:
      payload[EMAIL_CLAIM] ??
      payload.email ??
      "",

    role:
      payload[ROLE_CLAIM] ??
      payload.role ??
      "User",
  };
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
    const email = String(
      credentials.email ?? ""
    ).trim().toLowerCase();

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
      const data = await loginApi({
        email,
        password,
      });

      const token = data?.accessToken;

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
    setIsLoading(true);

    try {
      await registerApi(userData);

      return await login({
        email:
          userData.email,
        password:
          userData.password,
      });
    } finally {
      setIsLoading(false);
    }
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
    String(user?.role ?? "").toLowerCase() ===
    "admin";

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