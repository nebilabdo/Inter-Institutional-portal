"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

import {
  Bell,
  AlertTriangle,
  Clock,
  CheckCircle,
  FileText,
  RefreshCw,
} from "lucide-react";

type NotificationType = "info" | "success" | "warning" | "error";

interface Notification {
  id: number;
  title: string;
  message: string;
  details?: string;
  type: NotificationType;
  time: string;
  read: boolean;
}

function getIcon(type: NotificationType) {
  const size = "w-6 h-6";
  switch (type) {
    case "error":
      return <AlertTriangle className={`${size} text-red-600`} />;
    case "warning":
      return <Clock className={`${size} text-yellow-600`} />;
    case "success":
      return <CheckCircle className={`${size} text-green-600`} />;
    case "info":
      return <FileText className={`${size} text-blue-600`} />;
    default:
      return <Bell className={`${size} text-gray-600`} />;
  }
}

export default function NotificationsPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  // Choose one depending on how requestId is passed
  const requestId = params.requestId || searchParams.get("requestId");

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (requestId) fetchNotifications();
  }, [requestId]);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `http://localhost:5000/api/requests/${requestId}/notifications`
      );
      if (!res.ok) throw new Error("Failed to fetch notifications");
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
      method: "POST",
    });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAsUnread = async (id: number) => {
    await fetch(`http://localhost:5000/api/notifications/${id}/unread`, {
      method: "POST",
    });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: false } : n))
    );
  };

  const refresh = async () => {
    setIsRefreshing(true);
    await fetchNotifications();
    setIsRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Notifications for Request:{" "}
            <span className="text-blue-600">{requestId}</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Manage all alerts related to this request.
          </p>
        </div>

        <div className="bg-white border rounded-2xl shadow p-6">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Bell className="w-6 h-6 text-black" />
              <span className="text-xl font-semibold text-gray-800">
                System Notifications
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={refresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white hover:bg-gray-100 text-gray-900 font-medium shadow-sm"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
              <button
                // onClick={markAllAsRead}
                className="px-4 py-2 rounded-lg bg-black text-white font-semibold hover:bg-gray-800"
              >
                Mark All as Read
              </button>
            </div>
          </div>

          {isLoading ? (
            <p className="text-gray-500 text-center">
              Loading notifications...
            </p>
          ) : notifications.length === 0 ? (
            <p className="text-center text-gray-400">No bdu found.</p>
          ) : (
            <div className="flex flex-col gap-6">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`rounded-xl border p-6 flex flex-col gap-2 ${
                    !n.read
                      ? "bg-blue-50 border-blue-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-wrap">
                    {getIcon(n.type)}
                    <span className="font-bold text-lg text-gray-800">
                      {n.title}
                    </span>
                    {!n.read && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                    <span className="text-xs text-gray-500 ml-auto">
                      {n.time}
                    </span>
                  </div>
                  <div className="text-gray-700 font-medium">{n.message}</div>
                  {n.details && (
                    <div className="text-sm text-gray-500">{n.details}</div>
                  )}
                  <div className="flex flex-col sm:flex-row gap-2 mt-2">
                    {n.read ? (
                      <button
                        className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-100 text-gray-900"
                        onClick={() => markAsUnread(n.id)}
                      >
                        Mark as Unread
                      </button>
                    ) : (
                      <button
                        className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-100 text-gray-900"
                        onClick={() => markAsRead(n.id)}
                      >
                        Mark as Read
                      </button>
                    )}
                    <button
                      className="px-4 py-2 rounded-lg border border-red-300 bg-white text-red-600 hover:text-red-700"
                      // onClick={() => deleteNotification(n.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
