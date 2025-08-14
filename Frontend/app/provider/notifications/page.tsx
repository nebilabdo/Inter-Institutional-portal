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
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  Clock,
  BookMarkedIcon as MarkAsUnread,
  Eye,
  FileText,
  X,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { jsPDF } from "jspdf";

type Notification = {
  id: number;
  title: string;
  message: string;
  type: "success" | "warning" | "error" | "info";
  timestamp: string;
  read: boolean;
  requestId?: number;
  provider: string;
  isRead?: number; // For API compatibility
};

type Request = {
  id: number;
  title: string;
  // Add other request fields as needed
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewingNotification, setViewingNotification] =
    useState<Notification | null>(null);

  useEffect(() => {
    let isMounted = true; // so we don't set state after unmount

    async function fetchData() {
      setLoading(true);

      try {
        // Fetch notifications
        const notifRes = await fetch(
          "http://localhost:5000/api/notifications",
          {
            credentials: "include",
          }
        );
        const notifData = await notifRes.json();
        const mappedNotifications = notifData.map((notif: any) => ({
          ...notif,
          read: notif.isRead === 1,
        }));

        // Fetch universal requests
        const requestsRes = await fetch(
          "http://localhost:5000/api/requests/universal-requests",
          { credentials: "include" }
        );
        const requestsData = await requestsRes.json();

        if (isMounted) {
          setNotifications(mappedNotifications);
          setRequests(requestsData.requests || []);
        }
      } catch (error) {
        console.error("Error fetching:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const deleteNotification = async (id: number) => {
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

      setNotifications((n) => n.map((notif) => ({ ...notif, read: true })));
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  const getNotificationIcon = (type: string) => {
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

  const getNotificationBadgeColor = (type: string) => {
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

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  };

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAsUnread = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: false } : notif))
    );
  };

  const exportNotificationToPdf = (notification: Notification) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(notification.title, 15, 20);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Type: ${notification.type.toUpperCase()}`, 15, 30);
    doc.text(`Provider: ${notification.provider}`, 15, 35);
    doc.text(
      `Date: ${new Date(notification.timestamp).toLocaleString()}`,
      15,
      40
    );
    doc.setFontSize(14);
    doc.setTextColor(0);
    const splitMessage = doc.splitTextToSize(notification.message, 180);
    doc.text(splitMessage, 15, 50);
    doc.save(`notification-${notification.id}.pdf`);
  };

  const unreadNotifications = notifications.filter((n) => !n.read);
  const readNotifications = notifications.filter((n) => n.read);

  if (loading) {
    return (
      <DashboardLayout userRole="consumer">
        <div className="flex justify-center py-24">
          <p className="text-gray-500 animate-pulse">
            Loading notifications...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout userRole="consumer">
        <div className="text-center py-24 text-red-600">
          <p>Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="consumer">
      <div className="space-y-8">
        {/* Header and stats cards remain the same */}
        {/* ... */}

        {/* Notification Modal */}
        {viewingNotification && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  {getNotificationIcon(viewingNotification.type)}
                  <h3 className="text-2xl font-bold">
                    {viewingNotification.title}
                  </h3>
                </div>
                <button
                  onClick={() => setViewingNotification(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <p className="text-gray-700 text-lg">
                  {viewingNotification.message}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-gray-500">
                  <span>
                    <strong>Provider:</strong> {viewingNotification.provider}
                  </span>
                  <span>•</span>
                  <span>
                    <strong>Date:</strong>{" "}
                    {new Date(viewingNotification.timestamp).toLocaleString()}
                  </span>
                  <span>•</span>
                  <span>
                    <strong>Status:</strong>{" "}
                    {viewingNotification.read ? "Read" : "Unread"}
                  </span>
                  {viewingNotification.requestId && (
                    <>
                      <span>•</span>
                      <span>
                        <strong>Request ID:</strong>{" "}
                        {viewingNotification.requestId}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => exportNotificationToPdf(viewingNotification)}
                    className="flex items-center gap-2"
                  >
                    <FileText size={18} />
                    Export as PDF
                  </Button>

                  {viewingNotification.read ? (
                    <Button
                      variant="outline"
                      onClick={() => {
                        markAsUnread(viewingNotification.id);
                        setViewingNotification(null);
                      }}
                      className="flex items-center gap-2"
                    >
                      <MarkAsUnread size={18} />
                      Mark as Unread
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => {
                        markAsRead(viewingNotification.id);
                        setViewingNotification(null);
                      }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle size={18} />
                      Mark as Read
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notification Tabs */}
        <Tabs defaultValue="unread" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="unread">
              Unread ({unreadNotifications.length})
            </TabsTrigger>
            <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
            <TabsTrigger value="read">
              Read ({readNotifications.length})
            </TabsTrigger>
          </TabsList>

          {/* Unread Tab */}
          <TabsContent value="unread" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Unread Notifications
                </CardTitle>
                <CardDescription>
                  Notifications that require your attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                {unreadNotifications.length > 0 ? (
                  <div className="space-y-4">
                    {unreadNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="border rounded-xl p-6 bg-gradient-to-r from-blue-50 to-white hover:shadow-md transition-shadow"
                      >
                        {/* Notification content */}
                        <div className="flex justify-end mt-4 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setViewingNotification(notification)}
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              exportNotificationToPdf(notification)
                            }
                            className="flex items-center gap-1"
                          >
                            <FileText className="h-4 w-4" />
                            Export PDF
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Mark as Read
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      All caught up!
                    </h3>
                    <p className="text-gray-500">
                      You have no unread notifications
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* All and Read tabs follow similar pattern */}
          {/* ... */}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
