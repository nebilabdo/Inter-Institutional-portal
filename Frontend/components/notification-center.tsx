"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useSearchParams } from "next/navigation";

interface Notification {
  id: number;
  type: "error" | "warning" | "success" | "info" | "default";
  title: string;
  message: string;
  details: string;
  time: string;
  read: boolean;
}

interface NotificationsContextType {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined);

export const NotificationsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const searchParams = useSearchParams();
  const requestId = searchParams.get("requestId");

  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!requestId) return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/requests/${requestId}/notifications`
        );
        if (!res.ok) throw new Error("Failed to fetch notifications");

        const raw = await res.json();

        const transformed: Notification[] = raw.map(
          (n: any, index: number) => ({
            id: n.id,
            type: "info", // You can customize this based on message or type logic
            title: `Notification #${index + 1}`,
            message: n.message,
            details: "", // Add if backend includes more details later
            time: new Date(n.createdAt).toLocaleString(),
            read: n.isRead === 1,
          })
        );

        setNotifications(transformed);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [requestId]);

  return (
    <NotificationsContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider"
    );
  }
  return context;
};
