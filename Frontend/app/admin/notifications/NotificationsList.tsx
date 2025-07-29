"use client";

import React from "react";
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  FileText,
  Bell,
} from "lucide-react";

export type Notification = {
  id: number;
  type: "success" | "warning" | "error" | "info" | string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  details: string;
};

export const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "error":
      return <AlertTriangle className="w-5 h-5 text-red-600" />;
    case "warning":
      return <Clock className="w-5 h-5 text-yellow-600" />;
    case "success":
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    case "info":
      return <FileText className="w-5 h-5 text-blue-600" />;
    default:
      return <Bell className="w-5 h-5 text-gray-600" />;
  }
};

export default function NotificationsList({
  notifications,
}: {
  notifications: Notification[];
}): React.ReactElement {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4">nnnnn</h2>
      <ul className="space-y-4">
        {notifications.length === 0 ? (
          <li className="text-gray-500 text-center py-8">
            <Bell className="w-6 h-6 mx-auto mb-2 text-gray-400" />
            <p>No notifications available.</p>
          </li>
        ) : (
          notifications.map((n) => (
            <li
              key={n.id}
              className="flex flex-wrap items-baseline justify-between border-b pb-4 mb-4"
            >
              <div className="flex items-center gap-2 flex-grow min-w-0">
                {getNotificationIcon(n.type)}
                <strong className="text-lg font-semibold">{n.title}</strong>
                <span className="text-gray-700 text-base truncate">
                  {" "}
                  - {n.message}
                </span>
              </div>
              <span className="text-sm text-gray-500 ml-auto whitespace-nowrap">
                ({n.time})
              </span>
              <div className="text-xs text-gray-600 w-full mt-1">
                {n.details}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
