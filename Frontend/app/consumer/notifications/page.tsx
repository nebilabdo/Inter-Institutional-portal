"use client";

import React, { useState } from "react";
import { NotificationsProvider, useNotifications, Notification } from "@/components/NotificationsContext";
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
  Eye,
  FileText,
  X,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { jsPDF } from "jspdf";

// Wrap the page with NotificationsProvider
export default function NotificationsPage() {
  return (
    <NotificationsProvider>
      <NotificationsPageContent />
    </NotificationsProvider>
  );
}

// Actual page content
function NotificationsPageContent() {
  const { notifications, setNotifications, fetchNotifications } =
    useNotifications();
  const [viewingNotification, setViewingNotification] =
    useState<Notification | null>(null);

  const unreadNotifications = notifications.filter((n) => !n.read);
  const readNotifications = notifications.filter((n) => n.read);

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

  const markAsRead = async (id: number) => {
    try {
      await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      await fetchNotifications();
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const markAsUnread = async (id: number) => {
    try {
      await fetch(`http://localhost:5000/api/notifications/${id}/unread`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      await fetchNotifications();
    } catch (error) {
      console.error("Failed to mark as unread", error);
    }
  };

  const exportNotificationToPdf = (notification: Notification) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(notification.title, 15, 20);
    doc.setFontSize(12);
    doc.text(`Type: ${notification.type.toUpperCase()}`, 15, 30);
    doc.text(
      `Date: ${new Date(notification.timestamp).toLocaleString()}`,
      15,
      40
    );
    doc.setFontSize(14);
    const splitMessage = doc.splitTextToSize(notification.message, 180);
    doc.text(splitMessage, 15, 50);
    doc.save(`notification-${notification.id}.pdf`);
  };

  return (
    <DashboardLayout userRole="consumer">
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Notifications
            </h1>
            <p className="text-gray-600 mt-2">
              Stay updated on your API requests and system updates
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-sm">
              {unreadNotifications.length} unread
            </Badge>
          </div>
        </div>

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

          <TabsContent value="unread" className="space-y-4">
            {unreadNotifications.length > 0 ? (
              unreadNotifications.map((notif) => (
                <NotificationCard
                  key={notif.id}
                  notification={notif}
                  onView={setViewingNotification}
                  markAsRead={markAsRead}
                  exportPdf={exportNotificationToPdf}
                />
              ))
            ) : (
              <p className="text-center text-gray-600">
                No unread notifications
              </p>
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <NotificationCard
                  key={notif.id}
                  notification={notif}
                  onView={setViewingNotification}
                  markAsRead={markAsRead}
                  exportPdf={exportNotificationToPdf}
                />
              ))
            ) : (
              <p className="text-center text-gray-600">No notifications</p>
            )}
          </TabsContent>

          <TabsContent value="read" className="space-y-4">
            {readNotifications.length > 0 ? (
              readNotifications.map((notif) => (
                <NotificationCard
                  key={notif.id}
                  notification={notif}
                  onView={setViewingNotification}
                  markAsRead={markAsRead}
                  exportPdf={exportNotificationToPdf}
                />
              ))
            ) : (
              <p className="text-center text-gray-600">No read notifications</p>
            )}
          </TabsContent>
        </Tabs>

        {viewingNotification && (
          <NotificationModal
            notification={viewingNotification}
            onClose={() => setViewingNotification(null)}
            markAsRead={markAsRead}
            markAsUnread={markAsUnread}
            exportPdf={exportNotificationToPdf}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

// Small Notification Card component
function NotificationCard({
  notification,
  onView,
  markAsRead,
  exportPdf,
}: {
  notification: Notification;
  onView: (notif: Notification) => void;
  markAsRead: (id: number) => void;
  exportPdf: (notif: Notification) => void;
}) {
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
  return (
    <Card
      className={`border rounded-xl p-6 ${
        notification.read
          ? "bg-gray-50"
          : "bg-gradient-to-r from-blue-50 to-white"
      } hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between">
            <h4 className={`font-semibold text-lg ${notification.read ? "text-gray-600" : ""}`}>
              {notification.title}
            </h4>
            <Badge variant={getNotificationBadgeColor(notification.type)} className="text-xs">
              {notification.type}
            </Badge>
          </div>
          <p className={notification.read ? "text-gray-600" : "text-gray-700"}>{notification.message}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {new Date(notification.timestamp).toLocaleString()}
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-4 gap-2">
        <Button variant="outline" size="sm" onClick={() => onView(notification)} className="flex items-center gap-1">
          <Eye className="h-4 w-4" /> View
        </Button>
        <Button variant="outline" size="sm" onClick={() => exportPdf(notification)} className="flex items-center gap-1">
          <FileText className="h-4 w-4" /> Export PDF
        </Button>
        <Button variant="outline" size="sm" onClick={() => markAsRead(notification.id)} className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4" /> Mark as Read
        </Button>
      </div>
    </Card>
  );
}

// Notification Modal Component
function NotificationModal({
  notification,
  onClose,
  markAsRead,
  markAsUnread,
  exportPdf,
}: {
  notification: Notification;
  onClose: () => void;
  markAsRead: (id: number) => void;
  markAsUnread: (id: number) => void;
  exportPdf: (notif: Notification) => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-bold">{notification.title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="space-y-6">
          <p className="text-gray-700 text-lg">{notification.message}</p>

          <div className="flex gap-3 pt-4">
            <Button onClick={() => exportPdf(notification)} className="flex items-center gap-2">
              <FileText size={18} /> Export as PDF
            </Button>

            {notification.read ? (
              <Button
                variant="outline"
                onClick={() => {
                  markAsUnread(notification.id);
                  onClose();
                }}
                className="flex items-center gap-2"
              >
                Mark as Unread
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => {
                  markAsRead(notification.id);
                  onClose();
                }}
                className="flex items-center gap-2"
              >
                Mark as Read
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
