"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, CheckCircle, AlertCircle, Info } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";

type ProviderNotificationsPageProps = {
  params: {
    providerId: number;
  };
};

export default function ProviderNotificationsPage({
  params,
}: ProviderNotificationsPageProps) {
  const { providerId } = params;
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNotifications() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:5000/api/notifications", {
          credentials: "include", // send cookies for auth
        });

        if (!res.ok) throw new Error("Failed to fetch notifications");

        const data = await res.json();

        setNotifications(
          data.map((notif: any) => ({
            ...notif,
            read: notif.isRead === 1,
          }))
        );
      } catch (e: any) {
        setError(e.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, []);

  const deleteNotif = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:5000/api/notifications/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete notification");
      setNotifications((n) => n.filter((notif) => notif.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("http://localhost:5000/api/notifications/mark-all-read", {
        method: "PATCH",
      });

      setNotifications((n) =>
        n.map((notif) => ({ ...notif, read: true, isRead: 1 }))
      );
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  // Other utility functions (getIcon, getBadgeVariant, formatTime) same as before ...

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "success":
        return "default";
      case "warning":
        return "secondary";
      case "error":
        return "destructive";
      default:
        return "outline";
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffHours < 1) return "Just now";
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  // Mark read/unread and delete functions should call backend APIs here, but for now,
  // just update local state (we will improve later)
  const markRead = async (id: number) => {
    try {
      await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: "PATCH", // <-- PATCH here
      });
      setNotifications((n) =>
        n.map((notif) =>
          notif.id === id ? { ...notif, read: true, isRead: 1 } : notif
        )
      );
    } catch (error) {
      console.error("Failed to mark read", error);
    }
  };

  const markUnread = (id: number) => {
    // Ideally, call backend if API available to mark unread
    setNotifications((n) =>
      n.map((notif) =>
        notif.id === id ? { ...notif, read: false, isRead: 0 } : notif
      )
    );
  };

  const deleteNotification = async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/notifications/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }

      // Remove notification from local state
      setNotifications((n) => n.filter((notif) => notif.id !== id));
    } catch (error) {
      console.error("Failed to delete notification", error);
    }
  };

  const unread = notifications.filter((n) => n.isRead === 0);
  const read = notifications.filter((n) => n.isRead === 1);

  return (
    <DashboardLayout userRole="provider">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Provider Notifications
            </h1>
            <p className="text-gray-600 mt-2">
              Manage API requests, approvals, and alerts for request{" "}
              {providerId}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-sm">
              {unread.length} unread
            </Badge>
            <Button variant="outline" onClick={markAllAsRead}>
              Mark All as Read
            </Button>
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No notifications
            </h3>
            <p className="text-gray-500">You're all caught up!</p>
          </div>
        ) : (
          <Tabs defaultValue="unread" className="space-y-6">
            <TabsList>
              <TabsTrigger value="unread">
                <Bell className="mr-2 h-4 w-4" />
                Unread ({unread.length})
              </TabsTrigger>
              <TabsTrigger value="read">
                <CheckCircle className="mr-2 h-4 w-4" />
                Read ({read.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="unread" className="space-y-4">
              {unread.map((notif) => (
                <Card
                  key={notif.id}
                  className="p-4 flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    {getIcon(notif.type)}
                    <div>
                      <p>{notif.message}</p>
                      <p className="text-xs text-gray-500">
                        {formatTime(notif.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => markRead(notif.id)}
                    >
                      Mark Read
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteNotification(notif.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
              {unread.length === 0 && (
                <p className="text-center text-gray-500">
                  No unread notifications.
                </p>
              )}
            </TabsContent>

            <TabsContent value="read" className="space-y-4">
              {read.map((notif) => (
                <Card
                  key={notif.id}
                  className="p-4 flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    {getIcon(notif.type)}
                    <div>
                      <p>{notif.message}</p>
                      <p className="text-xs text-gray-500">
                        {formatTime(notif.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => markUnread(notif.id)}
                    >
                      Mark Unread
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteNotif(notif.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
              {read.length === 0 && (
                <p className="text-center text-gray-500">
                  No read notifications.
                </p>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
}
