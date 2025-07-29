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
  Trash2,
  Eye,
  Activity,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import Link from "next/link";

// Next.js 13 uses props params for dynamic routes
interface ProviderNotificationsPageProps {
  params: {
    requestId: string;
  };
}

export default function ProviderNotificationsPage({
  params,
}: ProviderNotificationsPageProps) {
  const { requestId } = params;
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!requestId) return;

    async function fetchNotifications() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `http://localhost:5000/api/requests/${requestId}/notifications`
        );
        if (!res.ok) throw new Error("Failed to fetch notifications");
        const data = await res.json();
        setNotifications(data);
      } catch (e: any) {
        setError(e.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, [requestId]);

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
    // Call backend to mark read
    try {
      await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: "POST",
      });
      setNotifications((n) =>
        n.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
      );
    } catch (error) {
      console.error("Failed to mark read", error);
    }
  };

  const markUnread = (id: number) => {
    // No backend API for mark unread? If there is, call it.
    setNotifications((n) =>
      n.map((notif) => (notif.id === id ? { ...notif, read: false } : notif))
    );
  };

  const deleteNotif = (id: number) => {
    // No backend API for delete? If yes, call it here.
    setNotifications((n) => n.filter((notif) => notif.id !== id));
  };

  const unread = notifications.filter((n) => !n.read);
  const read = notifications.filter((n) => n.read);

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
              Manage API requests, approvals, and alerts for request {requestId}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-sm">
              {unread.length} unread
            </Badge>
            <Button
              variant="outline"
              onClick={() =>
                setNotifications((n) =>
                  n.map((notif) => ({ ...notif, read: true }))
                )
              }
            >
              Mark All as Read
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading notifications...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">Error: {error}</div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No notifications
            </h3>
            <p className="text-gray-500">You're all caught up!</p>
          </div>
        ) : (
          <Tabs defaultValue="unread" className="space-y-6">
            {/* ... Keep your Tabs & content here exactly as before, but now using notifications from API ... */}
            {/* To save space, you can reuse your existing render code, just replace notifications with this state */}
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
}
