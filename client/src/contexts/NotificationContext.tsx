import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { useAuthContext } from "./AuthContext";
import { Notification } from "../types";
import {
  fetchNotifications,
  markNotification,
} from "../services/notifications";
import { api } from "../services/api";

type NotificationContextValue = {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: number) => Promise<void>;
};

const NotificationContext = createContext<
  NotificationContextValue | undefined
>(undefined);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? api.defaults.baseURL!;

export const NotificationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { user } = useAuthContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }
    fetchNotifications().then(setNotifications).catch(() => undefined);
  }, [user]);

  useEffect(() => {
    if (!user) return;

    let socket: Socket | null = null;
    socket = io(SOCKET_URL, {
      auth: { userId: user.id },
    });

    socket.on("order:update", (payload) => {
      setNotifications((prev) => [
        {
          id: Date.now(),
          message: payload.message,
          orderId: payload.orderId,
          status: "UNREAD",
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    });

    return () => {
      socket?.disconnect();
    };
  }, [user]);

  const markAsRead = async (id: number) => {
    await markNotification(id);
    setNotifications((prev) =>
    prev.map((notif) =>
        notif.id === id ? { ...notif, status: "READ" } : notif
      )
    );
  };

  const value = useMemo(
    () => ({
      notifications,
      unreadCount: notifications.filter((n) => n.status === "UNREAD").length,
      markAsRead,
    }),
    [notifications]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error(
      "useNotifications must be used within NotificationProvider"
    );
  }
  return ctx;
};
