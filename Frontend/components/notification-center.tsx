"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

// ----- Notification Types -----
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

// ----- Context -----
const NotificationsContext = createContext<NotificationsContextType | undefined>(
  undefined
);

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        let raw: any[];

        // Mock data for deployment
        if (process.env.NEXT_PUBLIC_USE_MOCK === "true") {
          raw = [
            {
              id: 1,
              type: "info",
              title: "Mock Notification 1",
              message: "This is a mock notification",
              details: "",
              timestamp: new Date().toISOString(),
              read: false,
            },
          ];
        } else {
          const res = await fetch("http://localhost:5000/api/notifications");
          if (!res.ok) throw new Error("Failed to fetch notifications");
          raw = await res.json();
        }

        const transformed: Notification[] = raw.map((n: any, index: number) => ({
          id: n.id,
          type: n.type || "info",
          title: n.title || `Notification #${index + 1}`,
          message: n.message || "No message available",
          details: n.details || "",
          time: new Date(n.timestamp).toLocaleString(),
          read: n.read || false,
        }));

        setNotifications(transformed);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <NotificationsContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationsContext.Provider>
  );
};

// ----- Hook -----
export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) throw new Error(
    "useNotifications must be used within a NotificationsProvider"
  );
  return context;
};

// ----- NotificationCenter Component -----
export const NotificationCenter = () => {
  const { notifications, setNotifications } = useNotifications();

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="notification-center">
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications available</p>
      ) : (
        <ul>
          {notifications.map(n => (
            <li key={n.id} style={{ opacity: n.read ? 0.5 : 1 }}>
              <strong>{n.title}</strong> - {n.message}
              <button onClick={() => markAsRead(n.id)}>Mark as read</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
