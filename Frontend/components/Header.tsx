"use client";
import { useState, useEffect } from "react";
import { useNotifications } from "./NotificationsContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
  Bell,
  Building2,
  FileText,
  RefreshCw,
  Settings,
  Shield,
  BarChart3,
  LogOut,
  User,
  AlertTriangle,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useIsMobile } from "@/components/ui/use-mobile";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: Settings },
  { name: "Requests", href: "/requests", icon: FileText },
  { name: "Institutions", href: "/institutions", icon: Building2 },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "nuu", href: "/notifications", icon: Bell },
];

import { useSearchParams } from "next/navigation";

export default function Header() {
  const searchParams = useSearchParams();
  const requestId = searchParams.get("requestId");
  const pathname = usePathname();
  const router = useRouter();
  const { notifications, setNotifications } = useNotifications();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [openSheet, setOpenSheet] = useState(false);
  const [userData] = useState({
    firstName: "Admin",
    lastName: "User",
    email: "admin@system.com",
    role: "Admin",
  });
  const unreadCount = notifications.filter((n) => !n.read).length;
  const isMobile = useIsMobile();

  // Fetch notifications from backend for specific request
  const fetchAllNotifications = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/notifications/unread`);
      if (!res.ok) throw new Error("Failed to fetch notifications");

      const data = await res.json();

      const formatted = data.map((n: any) => ({
        id: n.id,
        title: `Request ${n.requestId}`,
        message: n.message,
        read: n.isRead === 1,
        time: new Date(n.createdAt).toLocaleString(),
        type: "info",
      }));

      setNotifications(formatted);
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  const fetchRequestNotifications = async (requestId: string | null) => {
    if (!requestId) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/requests/${requestId}/notifications`
      );
      if (!res.ok) throw new Error("Failed to fetch request notifications");

      const data = await res.json();

      const formatted = data.map((n: any) => ({
        id: n.id,
        title: `Request ${n.requestId}`,
        message: n.message,
        read: n.isRead === 1,
        time: new Date(n.createdAt).toLocaleString(),
        type: "info",
      }));

      setNotifications(formatted);
    } catch (error) {
      console.error("Error loading request notifications:", error);
    }
  };

  // Add notification to backend for specific request
  const addNotificationToRequest = async (
    requestId: string,
    message: string
  ) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/requests/${requestId}/notifications`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        }
      );

      if (!res.ok) throw new Error("Failed to add notification");

      const newNotification = await res.json();

      const formattedNotification = {
        id: newNotification.id,
        title: `Request ${newNotification.requestId}`,
        message: newNotification.message,
        read: newNotification.isRead === 1,
        time: new Date(newNotification.createdAt).toLocaleString(),
        type: "info",
      };

      setNotifications((prev) => [formattedNotification, ...prev]);
    } catch (error) {
      console.error("Error adding notification:", error);
    }
  };

  // On mount, fetch notifications for example requestId "REQ-2024-001"
  useEffect(() => {
    if (requestId) {
      fetchRequestNotifications(requestId);
    } else {
      fetchAllNotifications();
    }
  }, [requestId]);

  // Mark single notification as read/unread
  const handleMarkAsRead = async (notificationId: number) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        {
          method: "PATCH",
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        throw new Error("Failed to mark notification as read: " + errText);
      }

      // Remove from UI
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== notificationId)
      );
    } catch (error) {
      console.error("Error in handleMarkAsRead:", error);
    }
  };

  // Delete notification locally
  const handleDeleteNotification = async (notificationId: number) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/notifications/${notificationId}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Failed to delete notification");

      // Optionally update local state:
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  // Mark all notifications as read locally
  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  // Refresh notifications by refetching from backend
  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (requestId) {
      await fetchRequestNotifications(requestId);
    } else {
      await fetchAllNotifications();
    }

    window.dispatchEvent(new Event("global-refresh"));

    setIsRefreshing(false);
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Logout failed");
    }
  };

  // Icon by notification type
  const getNotificationIcon = (type: any) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case "warning":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "info":
        return <Bell className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  // Notification card UI
  const getNotificationCard = (n: any) => {
    let dotColor = "bg-blue-500";
    if (n.type === "error") dotColor = "bg-red-500";
    else if (n.type === "warning") dotColor = "bg-yellow-400";
    else if (n.type === "success") dotColor = "bg-green-500";

    return (
      <div className="py-4 px-2 border-b last:border-b-0 bg-white" key={n.id}>
        <div className="flex items-start gap-3">
          <span className={`w-3 h-3 rounded-full mt-1 ${dotColor}`}></span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-base text-gray-900">
                {n.title}
              </span>
              {!n.read && (
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
              )}
            </div>
            <div className="text-sm text-gray-700 mb-1">{n.message}</div>
            <div className="text-xs text-gray-500">{n.time}</div>
            <div className="mt-2 flex gap-2">
              {!n.read && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleMarkAsRead(n.id)}
                >
                  Mark as read
                </Button>
              )}
              {n.read && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleMarkAsRead(n.id, false)}
                >
                  Mark as unread
                </Button>
              )}
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDeleteNotification(n.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between w-full">
        {/* Left: Logo and nav */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-black">AdminPanel</span>
          </div>
          <nav className="flex items-center gap-1 whitespace-nowrap min-w-0 text-base">
            <Link
              href="/admin"
              className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                pathname === "/dashboard"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="whitespace-nowrap">Dashboard</span>
            </Link>
            <Link
              href="/admin/requests"
              className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap min-w-0 text-sm ${
                pathname === "/requests"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              <FileText className="w-5 h-5" />
              <span className="whitespace-nowrap">Manage Requests</span>
            </Link>
            <Link
              href="/admin/institutions"
              className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                pathname === "/institutions"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              <Building2 className="w-5 h-5" />
              <span className="whitespace-nowrap">Institutions</span>
            </Link>
            <Link
              href="/admin/analytics"
              className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                pathname === "/analytics"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span className="whitespace-nowrap">Analytics</span>
            </Link>
            <button
              onClick={() => setOpenSheet(true)}
              className={`relative flex items-center px-2 sm:px-4 py-2 rounded-lg font-medium transition-colors bg-transparent border-0 outline-none ${
                pathname === "/notifications"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
              aria-label="Notifications"
            >
              <Bell className="w-6 h-6 sm:w-5 sm:h-5" />
              {!isMobile && <span className="ml-1">Notifications</span>}
              {unreadCount > 0 && (
                <span
                  className={`absolute ${
                    isMobile
                      ? "-top-1 right-0 w-4 h-4 text-[10px]"
                      : "-top-2 right-2 w-6 h-6 text-xs"
                  } bg-red-500 text-white rounded-full flex items-center justify-center font-bold`}
                >
                  {unreadCount}
                </span>
              )}
            </button>
          </nav>
        </div>
        {/* Right: Refresh, Avatar dropdown */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="rounded-xl flex items-center p-2 shadow-none border bg-white hover:bg-gray-50"
            onClick={handleRefresh}
            disabled={isRefreshing}
            aria-label="Refresh"
          >
            <RefreshCw
              className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="rounded-xl flex items-center gap-2 px-4 py-2 border bg-white hover:bg-gray-50"
              >
                <span className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
                  {userData.firstName.charAt(0)}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <div className="px-4 py-3">
                <div className="font-semibold text-lg text-gray-900">
                  {userData.firstName} {userData.lastName}
                </div>
                <div className="text-sm text-gray-500">{userData.email}</div>
                <Badge
                  variant="secondary"
                  className="mt-2 bg-gray-100 text-gray-800"
                >
                  {userData.role}
                </Badge>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={() => router.push("/admin/profile")}
              >
                <User className="w-5 h-5" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Notification Sheet */}
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetContent side="right" className="w-full max-w-md p-0">
          <SheetTitle className="border-b border-gray-100 p-4 text-lg font-semibold">
            Notifications
          </SheetTitle>
          {notifications.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No notifications available
            </div>
          )}
          {notifications.length > 0 && (
            <div className="overflow-y-auto max-h-[calc(100vh-96px)]">
              {notifications.map(getNotificationCard)}
            </div>
          )}
          <div className="sticky bottom-0 bg-white border-t border-gray-100 flex items-center justify-between p-4 gap-3">
            <Button
              onClick={handleMarkAllAsRead}
              variant="outline"
              className="flex-1"
              aria-label="Mark all notifications as read"
            >
              Mark all as read
            </Button>
            <Button
              onClick={() => setNotifications([])}
              variant="destructive"
              className="flex-1"
              aria-label="Clear all notifications"
            >
              Clear all
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
