import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./AuthContext.jsx";

const NotificationContext = createContext(null);
const NOTIFICATIONS_STORAGE_KEY = "khub-notifications-v1";

function readNotifications() {
  try {
    const saved = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalizeNotification(notification) {
  return {
    id: notification.id ?? crypto.randomUUID(),
    userId: String(notification.userId ?? ""),
    title: notification.title ?? "إشعار جديد",
    message: notification.message ?? "",
    type: notification.type ?? "info",
    link: notification.link ?? "/notifications",
    sourceType: notification.sourceType ?? "general",
    sourceId: notification.sourceId ?? "",
    status: notification.status ?? "",
    isRead: Boolean(notification.isRead),
    createdAt: notification.createdAt ?? new Date().toISOString(),
    readAt: notification.readAt ?? null,
  };
}

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(readNotifications);

  const persist = useCallback((nextNotifications) => {
    localStorage.setItem(
      NOTIFICATIONS_STORAGE_KEY,
      JSON.stringify(nextNotifications)
    );
    setNotifications(nextNotifications);
  }, []);

  useEffect(() => {
    function handleStorage(event) {
      if (event.key === NOTIFICATIONS_STORAGE_KEY) {
        setNotifications(readNotifications());
      }
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const addNotification = useCallback(
    (notification) => {
      if (!notification?.userId) {
        return null;
      }

      const nextNotification = normalizeNotification(notification);
      const duplicateKey = [
        nextNotification.userId,
        nextNotification.sourceType,
        nextNotification.sourceId,
        nextNotification.status,
      ].join(":");

      let createdNotification = nextNotification;

      setNotifications((current) => {
        const withoutDuplicate = current.filter((item) => {
          const itemKey = [
            String(item.userId),
            item.sourceType ?? "general",
            item.sourceId ?? "",
            item.status ?? "",
          ].join(":");

          return itemKey !== duplicateKey;
        });

        const next = [nextNotification, ...withoutDuplicate];
        localStorage.setItem(
          NOTIFICATIONS_STORAGE_KEY,
          JSON.stringify(next)
        );
        return next;
      });

      window.dispatchEvent(
        new CustomEvent("khub-notification-created", {
          detail: createdNotification,
        })
      );

      return createdNotification;
    },
    []
  );

  const markAsRead = useCallback(
    (notificationId) => {
      const now = new Date().toISOString();
      const next = notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true, readAt: notification.readAt ?? now }
          : notification
      );
      persist(next);
    },
    [notifications, persist]
  );

  const markAllAsRead = useCallback(() => {
    if (!user?.id) return;

    const now = new Date().toISOString();
    const next = notifications.map((notification) =>
      String(notification.userId) === String(user.id)
        ? { ...notification, isRead: true, readAt: notification.readAt ?? now }
        : notification
    );
    persist(next);
  }, [notifications, persist, user?.id]);

  const removeNotification = useCallback(
    (notificationId) => {
      persist(
        notifications.filter(
          (notification) => notification.id !== notificationId
        )
      );
    },
    [notifications, persist]
  );

  const clearMyNotifications = useCallback(() => {
    if (!user?.id) return;

    persist(
      notifications.filter(
        (notification) =>
          String(notification.userId) !== String(user.id)
      )
    );
  }, [notifications, persist, user?.id]);

  const userNotifications = useMemo(() => {
    if (!user?.id) return [];

    return notifications
      .filter(
        (notification) =>
          String(notification.userId) === String(user.id)
      )
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [notifications, user?.id]);

  const unreadCount = useMemo(
    () => userNotifications.filter((notification) => !notification.isRead).length,
    [userNotifications]
  );

  const value = useMemo(
    () => ({
      notifications,
      userNotifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearMyNotifications,
    }),
    [
      addNotification,
      clearMyNotifications,
      markAllAsRead,
      markAsRead,
      notifications,
      removeNotification,
      unreadCount,
      userNotifications,
    ]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider"
    );
  }

  return context;
}
