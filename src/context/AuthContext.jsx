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

const IS_DEMO_MODE = true;

const ACCESS_TOKEN_KEY = "accessToken";
const SESSION_USER_KEY = "khub-user";
const DEMO_USERS_KEY = "khub-demo-users";

const NAME_CLAIM =
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";

const EMAIL_CLAIM =
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";

const ROLE_CLAIM =
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

const ID_CLAIM =
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";

const initialDemoUsers = [
  {
    id: "admin-1",
    name: "K-HUB Admin",
    email: "admin@khub.com",
    phone: "01000000000",
    password: "Admin123!",
    role: "Admin",
  },
  {
    id: "user-1",
    name: "Demo User",
    email: "user@khub.com",
    phone: "01111111111",
    password: "User123!",
    role: "User",
  },
];

function normalizeEmail(email) {
  return String(email ?? "")
    .trim()
    .toLowerCase();
}

function createId() {
  if (typeof crypto?.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `user-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
}

function readDemoUsers() {
  try {
    const savedUsers =
      localStorage.getItem(DEMO_USERS_KEY);

    if (!savedUsers) {
      localStorage.setItem(
        DEMO_USERS_KEY,
        JSON.stringify(initialDemoUsers)
      );

      return [...initialDemoUsers];
    }

    const parsedUsers = JSON.parse(savedUsers);

    if (!Array.isArray(parsedUsers)) {
      throw new Error("Invalid demo users.");
    }

    return parsedUsers;
  } catch {
    localStorage.setItem(
      DEMO_USERS_KEY,
      JSON.stringify(initialDemoUsers)
    );

    return [...initialDemoUsers];
  }
}

function saveDemoUsers(users) {
  localStorage.setItem(
    DEMO_USERS_KEY,
    JSON.stringify(users)
  );
}

function encodeBase64Url(value) {
  const bytes = new TextEncoder().encode(value);

  let binaryValue = "";

  bytes.forEach((byte) => {
    binaryValue += String.fromCharCode(byte);
  });

  return window
    .btoa(binaryValue)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function createDemoToken(user) {
  const nowInSeconds = Math.floor(Date.now() / 1000);

  const header = {
    alg: "none",
    typ: "JWT",
  };

  const payload = {
    sub: user.id,
    exp: nowInSeconds + 60 * 60 * 24 * 7,

    [ID_CLAIM]: user.id,
    [NAME_CLAIM]: user.name,
    [EMAIL_CLAIM]: user.email,
    [ROLE_CLAIM]: user.role,

    name: user.name,
    email: user.email,
    role: user.role,
  };

  return [
    encodeBase64Url(JSON.stringify(header)),
    encodeBase64Url(JSON.stringify(payload)),
    "demo-signature",
  ].join(".");
}

function createSafeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone ?? "",
    role: user.role ?? "User",
  };
}

function wait(milliseconds = 450) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

async function demoLogin(credentials) {
  await wait();

  const email = normalizeEmail(credentials.email);
  const password = String(credentials.password ?? "");

  const users = readDemoUsers();

  const matchedUser = users.find(
    (user) =>
      normalizeEmail(user.email) === email &&
      user.password === password
  );

  if (!matchedUser) {
    throw new Error(
      "الإيميل أو كلمة المرور غير صحيحة."
    );
  }

  const safeUser = createSafeUser(matchedUser);

  return {
    user: safeUser,
    accessToken: createDemoToken(safeUser),
  };
}

async function demoRegister(userData) {
  await wait();

  const fullName = String(
    userData.fullName ?? userData.name ?? ""
  ).trim();

  const email = normalizeEmail(userData.email);

  const phone = String(
    userData.phoneNumber ?? userData.phone ?? ""
  ).trim();

  const password = String(
    userData.password ?? ""
  );

  if (!fullName || !email || !phone || !password) {
    throw new Error(
      "كمّل الاسم والإيميل ورقم الموبايل والباسورد."
    );
  }

  const users = readDemoUsers();

  const emailAlreadyExists = users.some(
    (user) =>
      normalizeEmail(user.email) === email
  );

  if (emailAlreadyExists) {
    throw new Error(
      "يوجد حساب مسجل بهذا الإيميل."
    );
  }

  const newUser = {
    id: createId(),
    name: fullName,
    email,
    phone,
    password,
    role: "User",
  };

  users.push(newUser);
  saveDemoUsers(users);

  const safeUser = createSafeUser(newUser);

  return {
    user: safeUser,
    accessToken: createDemoToken(safeUser),
  };
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

async function fetchApi(path, options) {
  try {
    return await fetch(
      `${API_BASE_URL}${path}`,
      options
    );
  } catch {
    throw new Error(
      "تعذر الاتصال بالسيرفر. فعّل Demo Mode أو تأكد أن الـBackend يعمل."
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
      if (IS_DEMO_MODE) {
        const result = await demoLogin({
          email,
          password,
        });

        saveSession(
          result.accessToken,
          result.user
        );

        return result.user;
      }

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
    setIsLoading(true);

    try {
      if (IS_DEMO_MODE) {
        const result =
          await demoRegister(userData);

        saveSession(
          result.accessToken,
          result.user
        );

        return result.user;
      }

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

      return await login({
        email,
        password,
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
      isDemoMode: IS_DEMO_MODE,
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