import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import * as signalR from "@microsoft/signalr";
import { useAuth } from "./AuthContext.jsx";
import {
  getNotifications as fetchNotifications,
  getUnreadCount as fetchUnreadCount,
  markAsRead as apiMarkAsRead,
  markAllAsRead as apiMarkAllAsRead,
  deleteNotification as apiDeleteNotification,
  deleteAllNotifications as apiDeleteAllNotifications,
} from "../services/notificationService.js";

const NotificationContext = createContext(null);

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? ""
).replace(/\/$/, "");

export function NotificationProvider({ children }) {
  const { user, accessToken } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      setNotifications([]);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    fetchNotifications()
      .then((data) => {
        if (!cancelled) setNotifications(data ?? []);
      })
      .catch(() => {
        if (!cancelled) setNotifications([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [user?.id]);

  const addNotification = useCallback((notification) => {
    setNotifications((current) => {
      const exists = current.some((n) => n.id === notification.id);
      if (exists) return current;
      return [notification, ...current];
    });
  }, []);

  const markAsRead = useCallback(
    async (notificationId) => {
      try {
        const updated = await apiMarkAsRead(notificationId);
        setNotifications((current) =>
          current.map((n) =>
            n.id === notificationId ? { ...n, isRead: true, readAt: updated?.readAt ?? new Date().toISOString() } : n
          )
        );
      } catch {
        setNotifications((current) =>
          current.map((n) =>
            n.id === notificationId ? { ...n, isRead: true } : n
          )
        );
      }
    },
    []
  );

  const markAllAsRead = useCallback(async () => {
    try {
      await apiMarkAllAsRead();
    } catch {
      // silent
    }
    setNotifications((current) =>
      current.map((n) => ({ ...n, isRead: true, readAt: n.readAt ?? new Date().toISOString() }))
    );
  }, []);

  const removeNotification = useCallback(
    async (notificationId) => {
      try {
        await apiDeleteNotification(notificationId);
      } catch {
        // silent
      }
      setNotifications((current) =>
        current.filter((n) => n.id !== notificationId)
      );
    },
    []
  );

  const clearMyNotifications = useCallback(async () => {
    try {
      await apiDeleteAllNotifications();
    } catch {
      // silent
    }
    setNotifications([]);
  }, []);

  useEffect(() => {
    if (!user?.id || !accessToken) {
      return undefined;
    }

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_BASE_URL || "https://localhost:7187"}/hubs/notifications`, {
        accessTokenFactory: () => accessToken,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection.on("NotificationReceived", (notification) => {
      addNotification(notification);
    });

    connection.start().catch((error) => {
      console.error("SignalR connection failed:", error);
    });

    return () => {
      connection.off("NotificationReceived");
      connection.stop().catch((error) => {
        console.error("SignalR stop failed:", error);
      });
    };
  }, [accessToken, addNotification, user?.id]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const userNotifications = useMemo(
    () =>
      [...notifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [notifications]
  );

  const value = useMemo(
    () => ({
      notifications,
      userNotifications,
      unreadCount,
      isLoading,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearMyNotifications,
    }),
    [
      notifications,
      userNotifications,
      unreadCount,
      isLoading,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearMyNotifications,
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
