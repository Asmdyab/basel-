import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./AuthContext.jsx";
import {
  getMyProfile,
  getProfile as apiGetProfile,
  updateProfile as apiUpdateProfile,
  adjustPoints as apiAdjustPoints,
} from "../services/profileService.js";
import {
  getMyTrainingRegistrations,
  getAllTrainingRegistrations,
  createTrainingRegistration as apiCreateTrainingRegistration,
  reviewTrainingRegistration as apiReviewTrainingRegistration,
} from "../services/trainingRegistrationService.js";

const UserProfileContext = createContext(null);

export function UserProfileProvider({ children }) {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState({});
  const [trainingRegistrations, setTrainingRegistrations] = useState([]);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingRegistrations, setIsLoadingRegistrations] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      setProfiles({});
      setTrainingRegistrations([]);
      return;
    }

    let cancelled = false;

    setIsLoadingProfile(true);
    getMyProfile()
      .then((profile) => {
        if (!cancelled && profile) {
          setProfiles((current) => ({
            ...current,
            [profile.userId]: profile,
          }));
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoadingProfile(false);
      });

    setIsLoadingRegistrations(true);
    const fetchRegs = user.role === "Admin"
      ? getAllTrainingRegistrations()
      : getMyTrainingRegistrations();

    fetchRegs
      .then((data) => {
        if (!cancelled) setTrainingRegistrations(data ?? []);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoadingRegistrations(false);
      });

    return () => { cancelled = true; };
  }, [user?.id]);

  const fetchProfile = useCallback(async (userId) => {
    try {
      const profile = await apiGetProfile(userId);
      if (profile) {
        setProfiles((current) => ({
          ...current,
          [userId]: profile,
        }));
      }
      return profile;
    } catch {
      return null;
    }
  }, []);

  const getProfile = useCallback(
    (userId) => {
      if (!userId) return null;
      return profiles[userId] ?? null;
    },
    [profiles]
  );

  const upsertProfile = useCallback(
    async (userId, formData) => {
      try {
        const updated = await apiUpdateProfile(userId, formData);
        setProfiles((current) => ({
          ...current,
          [userId]: updated,
        }));
        return updated;
      } catch {
        return null;
      }
    },
    []
  );

  const submitTrainingRegistration = useCallback(
    async (formData) => {
      if (!(formData instanceof FormData)) {
        throw new Error("FormData is required for training registration.");
      }

      const result = await apiCreateTrainingRegistration(formData);
      setTrainingRegistrations((current) => [result, ...current]);
      return result;
    },
    []
  );

  const updateTrainingStatus = useCallback(
    async (registrationId, status, review = {}) => {
      const result = await apiReviewTrainingRegistration(registrationId, {
        status,
        ...review,
      });
      setTrainingRegistrations((current) =>
        current.map((r) =>
          r.id === registrationId ? result : r
        )
      );
      return result;
    },
    []
  );

  const adjustPoints = useCallback(
    async ({ userId, amount, note }) => {
      const updated = await apiAdjustPoints(userId, amount, note);
      setProfiles((current) => ({
        ...current,
        [userId]: updated,
      }));
      return updated;
    },
    []
  );

  const refreshRegistrations = useCallback(async () => {
    try {
      const data = await getMyTrainingRegistrations();
      setTrainingRegistrations(data ?? []);
    } catch {
      // silent
    }
  }, []);

  const knownUsers = useMemo(() => {
    const usersMap = new Map();

    Object.values(profiles).forEach((profile) => {
      usersMap.set(profile.userId, profile);
    });

    trainingRegistrations.forEach((reg) => {
      if (!usersMap.has(reg.userId)) {
        usersMap.set(reg.userId, {
          userId: reg.userId,
          name: reg.participantName,
          email: reg.userEmail,
          phone: reg.phone,
          role: "User",
          points: 0,
        });
      }
    });

    return Array.from(usersMap.values()).sort((a, b) =>
      a.name?.localeCompare?.(b.name, "ar") ?? 0
    );
  }, [profiles, trainingRegistrations]);

  const value = useMemo(
    () => ({
      profiles,
      trainingRegistrations,
      knownUsers,
      getProfile,
      fetchProfile,
      upsertProfile,
      submitTrainingRegistration,
      updateTrainingStatus,
      adjustPoints,
      refreshRegistrations,
      isLoadingProfile,
      isLoadingRegistrations,
    }),
    [
      profiles,
      trainingRegistrations,
      knownUsers,
      getProfile,
      fetchProfile,
      upsertProfile,
      submitTrainingRegistration,
      updateTrainingStatus,
      adjustPoints,
      refreshRegistrations,
      isLoadingProfile,
      isLoadingRegistrations,
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
