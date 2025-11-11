import { api } from "./api";
import { Notification } from "../types";

export const fetchNotifications = async () => {
  const { data } = await api.get<{ notifications: Notification[] }>(
    "/notifications"
  );
  return data.notifications;
};

export const markNotification = async (id: number) => {
  const { data } = await api.patch<{ notification: Notification }>(
    `/notifications/${id}/read`
  );
  return data.notification;
};
