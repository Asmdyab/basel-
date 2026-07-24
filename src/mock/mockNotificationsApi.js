import {
  getDatabase,
  saveDatabase,
} from "./mockDatabase";

export async function getUserNotifications(
  userId
) {
  const database = getDatabase();

  return database.notifications
    .filter(
      (notification) =>
        notification.userId === userId
    )
    .sort(
      (first, second) =>
        new Date(second.createdAt) -
        new Date(first.createdAt)
    );
}

export async function markNotificationAsRead({
  notificationId,
  userId,
}) {
  const database = getDatabase();

  const notification =
    database.notifications.find(
      (item) =>
        item.id === notificationId &&
        item.userId === userId
    );

  if (!notification) {
    throw new Error("الإشعار غير موجود.");
  }

  notification.isRead = true;

  saveDatabase(database);

  return notification;
}

export async function markAllNotificationsAsRead(
  userId
) {
  const database = getDatabase();

  database.notifications.forEach(
    (notification) => {
      if (notification.userId === userId) {
        notification.isRead = true;
      }
    }
  );

  saveDatabase(database);
}