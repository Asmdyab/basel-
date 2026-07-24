import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAuth } from "./AuthContext.jsx";
import { useBookings } from "./BookingContext.jsx";
import { useNotifications } from "./NotificationContext.jsx";

const UserProfileContext = createContext(null);
const PROFILES_STORAGE_KEY = "khub-user-profiles-v1";
const TRAINING_STORAGE_KEY = "khub-training-registrations-v1";

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function normalizeProfile(profile) {
  return {
    userId: profile.userId,
    name: profile.name ?? "K-HUB User",
    email: profile.email ?? "",
    phone: profile.phone ?? "",
    age: profile.age ?? "",
    profileImage: profile.profileImage ?? "",
    preferredSport: profile.preferredSport ?? "",
    role: profile.role ?? "User",
    points: Number(profile.points ?? 0),
    pointsHistory: Array.isArray(profile.pointsHistory)
      ? profile.pointsHistory
      : [],
    createdAt: profile.createdAt ?? new Date().toISOString(),
    updatedAt: profile.updatedAt ?? new Date().toISOString(),
  };
}

export function UserProfileProvider({ children }) {
  const { user } = useAuth();
  const { bookings } = useBookings();
  const { addNotification } = useNotifications();
  const [profiles, setProfiles] = useState(() =>
    readJson(PROFILES_STORAGE_KEY, {})
  );
  const [trainingRegistrations, setTrainingRegistrations] = useState(() =>
    readJson(TRAINING_STORAGE_KEY, [])
  );
  const profilesRef = useRef(profiles);

  useEffect(() => {
    profilesRef.current = profiles;
  }, [profiles]);

  const persistProfiles = useCallback((nextProfiles) => {
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(nextProfiles));
    profilesRef.current = nextProfiles;
    setProfiles(nextProfiles);
  }, []);

  const persistTraining = useCallback((nextRegistrations) => {
    localStorage.setItem(TRAINING_STORAGE_KEY, JSON.stringify(nextRegistrations));
    setTrainingRegistrations(nextRegistrations);
  }, []);

  const upsertProfile = useCallback(
    (userId, patch) => {
      if (!userId) {
        throw new Error("معرّف المستخدم غير موجود.");
      }

      const currentProfiles = profilesRef.current;
      const current = normalizeProfile(
        currentProfiles[userId] ?? {
          userId,
          createdAt: new Date().toISOString(),
        }
      );
      const updatedProfile = normalizeProfile({
        ...current,
        ...patch,
        userId,
        updatedAt: new Date().toISOString(),
      });
      const nextProfiles = {
        ...currentProfiles,
        [userId]: updatedProfile,
      };

      persistProfiles(nextProfiles);
      return updatedProfile;
    },
    [persistProfiles]
  );

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const bookingForUser = bookings.find((booking) => booking.userId === user.id);
    const currentProfile = profilesRef.current[user.id];

    upsertProfile(user.id, {
      name:
        currentProfile?.name ||
        user.name ||
        bookingForUser?.userName ||
        "K-HUB User",
      email:
        currentProfile?.email ||
        user.email ||
        bookingForUser?.userEmail ||
        "",
      phone:
        currentProfile?.phone ||
        user.phone ||
        bookingForUser?.userPhone ||
        "",
      role: user.role || currentProfile?.role || "User",
    });
  }, [bookings, upsertProfile, user]);

  const getProfile = useCallback(
    (userId) => {
      if (!userId) {
        return null;
      }

      if (profiles[userId]) {
        return normalizeProfile(profiles[userId]);
      }

      const booking = bookings.find((item) => item.userId === userId);
      const registration = trainingRegistrations.find(
        (item) => item.userId === userId
      );

      if (!booking && !registration && user?.id !== userId) {
        return null;
      }

      return normalizeProfile({
        userId,
        name:
          registration?.participantName ??
          booking?.userName ??
          (user?.id === userId ? user.name : "K-HUB User"),
        email:
          registration?.userEmail ??
          booking?.userEmail ??
          (user?.id === userId ? user.email : ""),
        phone:
          registration?.phone ??
          booking?.userPhone ??
          (user?.id === userId ? user.phone : ""),
        age: registration?.age ?? "",
        profileImage: registration?.profileImage ?? "",
        preferredSport: registration?.sportType ?? "",
      });
    },
    [bookings, profiles, trainingRegistrations, user]
  );

  const submitTrainingRegistration = useCallback(
    (registration) => {
      const now = new Date().toISOString();
      const nextRegistration = {
        id: crypto.randomUUID(),
        status: "pending",
        createdAt: now,
        ...registration,
      };

      setTrainingRegistrations((current) => {
        const next = [nextRegistration, ...current];
        localStorage.setItem(TRAINING_STORAGE_KEY, JSON.stringify(next));
        return next;
      });

      upsertProfile(registration.userId, {
        name: registration.participantName,
        email: registration.userEmail,
        phone: registration.phone ?? "",
        age: Number(registration.age),
        profileImage: registration.profileImage,
        preferredSport: registration.sportType,
      });

      return nextRegistration;
    },
    [upsertProfile]
  );

  const updateTrainingStatus = useCallback(
    (registrationId, status) => {
      const registration = trainingRegistrations.find(
        (item) => item.id === registrationId
      );

      if (!registration || registration.status === status) {
        return;
      }

      const reviewedAt = new Date().toISOString();
      const next = trainingRegistrations.map((item) =>
        item.id === registrationId
          ? { ...item, status, reviewedAt }
          : item
      );

      persistTraining(next);

      const isApproved = status === "approved";
      const sportName =
        registration.sportName ??
        registration.sportType ??
        "التمرين";
      const coachPart = registration.coachName
        ? ` مع ${registration.coachName}`
        : "";
      const courtPart = registration.courtName
        ? ` في ${registration.courtName}`
        : "";

      addNotification({
        userId: registration.userId,
        title: isApproved
          ? "تم قبول طلب التدريب"
          : "تم رفض طلب التدريب",
        message: isApproved
          ? `وافقت الإدارة على تسجيلك في ${sportName}${coachPart}${courtPart}.`
          : `لم تتم الموافقة على تسجيلك في ${sportName}. راجع بيانات الدفع أو تواصل مع الإدارة.`,
        type: isApproved ? "success" : "danger",
        link: "/profile",
        sourceType: "training",
        sourceId: registration.id,
        status,
      });
    },
    [addNotification, persistTraining, trainingRegistrations]
  );

  const adjustPoints = useCallback(
    ({ userId, amount, note, admin }) => {
      const numericAmount = Number(amount);

      if (!Number.isFinite(numericAmount) || numericAmount === 0) {
        throw new Error("اكتب عدد نقاط صحيح أكبر أو أقل من صفر.");
      }

      const current = getProfile(userId);

      if (!current) {
        throw new Error("المستخدم غير موجود.");
      }

      const nextPoints = Math.max(0, current.points + numericAmount);
      const appliedAmount = nextPoints - current.points;

      if (appliedAmount === 0) {
        throw new Error("لا توجد نقاط كافية للخصم.");
      }

      return upsertProfile(userId, {
        points: nextPoints,
        pointsHistory: [
          {
            id: crypto.randomUUID(),
            amount: appliedAmount,
            note: String(note ?? "").trim() || "تعديل نقاط من الإدارة",
            adminId: admin?.id ?? "admin",
            adminName: admin?.name ?? "Admin",
            createdAt: new Date().toISOString(),
          },
          ...current.pointsHistory,
        ],
      });
    },
    [getProfile, upsertProfile]
  );

  const knownUsers = useMemo(() => {
    const usersMap = new Map();

    Object.values(profiles).forEach((profile) => {
      usersMap.set(profile.userId, normalizeProfile(profile));
    });

    bookings.forEach((booking) => {
      if (!booking.userId) {
        return;
      }

      const current = usersMap.get(booking.userId) ?? { userId: booking.userId };
      usersMap.set(
        booking.userId,
        normalizeProfile({
          ...current,
          name: current.name ?? booking.userName,
          email: current.email ?? booking.userEmail,
          phone: current.phone ?? booking.userPhone,
        })
      );
    });

    trainingRegistrations.forEach((registration) => {
      const current = usersMap.get(registration.userId) ?? {
        userId: registration.userId,
      };

      usersMap.set(
        registration.userId,
        normalizeProfile({
          ...current,
          name: registration.participantName ?? current.name,
          email: registration.userEmail ?? current.email,
          phone: registration.phone ?? current.phone,
          age: registration.age ?? current.age,
          profileImage: registration.profileImage ?? current.profileImage,
          preferredSport: registration.sportType ?? current.preferredSport,
        })
      );
    });

    return Array.from(usersMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name, "ar")
    );
  }, [bookings, profiles, trainingRegistrations]);

  const value = useMemo(
    () => ({
      profiles,
      trainingRegistrations,
      knownUsers,
      getProfile,
      upsertProfile,
      submitTrainingRegistration,
      updateTrainingStatus,
      adjustPoints,
      persistProfiles,
      persistTraining,
    }),
    [
      adjustPoints,
      getProfile,
      knownUsers,
      persistProfiles,
      persistTraining,
      profiles,
      submitTrainingRegistration,
      trainingRegistrations,
      updateTrainingStatus,
      upsertProfile,
    ]
  );

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfiles() {
  const context = useContext(UserProfileContext);

  if (!context) {
    throw new Error("useUserProfiles must be used inside UserProfileProvider");
  }

  return context;
}
