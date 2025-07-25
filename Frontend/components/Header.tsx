"use client";
import { useState } from "react";
import { useNotifications } from "./NotificationsContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
  Users,
  BarChart3,
  LogOut,
  User,
  X,
  AlertTriangle,
  Clock,
  CheckCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useIsMobile } from "@/components/ui/use-mobile";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Settings },
  { name: "Requests", href: "/requests", icon: FileText },
  { name: "Institutions", href: "/institutions", icon: Building2 },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Notifications", href: "/notifications", icon: Bell },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { notifications, setNotifications } = useNotifications();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [openSheet, setOpenSheet] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");
  const [userData, setUserData] = useState({
    firstName: "Admin",
    lastName: "User",
    email: "admin@system.com",
    phone: "+251-11-123-4567",
    institution: "System Administration",
    bio: "System administrator with full access to manage institutions and requests.",
    role: "Admin",
    avatar: "A",
  });
  const unreadCount = notifications.filter((n) => !n.read).length;
  const isMobile = useIsMobile();

  // --- Provided utility and handler functions ---
  const handleViewAllNotifications = () => {
    // Instead of setting currentView, navigate to /notifications
    window.location.href = "/notifications";
    setOpenSheet(false);
  };

  const getNotificationIcon = (type: any) => {
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

  const handleMarkAsRead = (notificationId: any, markAsRead = true) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: markAsRead }
          : notification
      )
    );
  };

  const handleDeleteNotification = (notificationId: any) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== notificationId)
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // clear token
    router.push("/"); // or wherever you want to send user after logout
  };

  // --- Notification card rendering ---
  const getNotificationCard = (n: any) => {
    // Dot color by type
    let dotColor = "bg-blue-500";
    if (n.type === "error") dotColor = "bg-red-500";
    else if (n.type === "warning") dotColor = "bg-yellow-400";
    else if (n.type === "success") dotColor = "bg-green-500";
    // Minimal card style
    return (
      <div className="py-4 px-2 border-b last:border-b-0 bg-white">
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
          </div>
        </div>
      </div>
    );
  };

  // --- Main render ---
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between w-full">
        {/* Left: Logo and nav */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-black">AdminPanel</span>
          </div>
          {/* Nav links */}
          <nav className="flex items-center gap-1 whitespace-nowrap min-w-0 text-base">
            <Link
              href="/admin/dashboard"
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
            {/* Notifications nav link with badge */}
            <button
              onClick={() => setOpenSheet(true)}
              className={`relative flex items-center px-2 sm:px-4 py-2 rounded-lg font-medium transition-colors bg-transparent border-0 outline-none ${
                pathname === "/notifications"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
              style={{ border: "none" }}
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
        {/* Right: Refresh, Avatar (inline, no settings) */}
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
                  A
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
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetContent side="right" className="w-full max-w-md p-0">
          <SheetTitle className="sr-only">Notifications</SheetTitle>
          <div className="h-full flex flex-col">
            <div className="border-b px-6 py-4">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span className="font-semibold text-lg">
                  System Notifications
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-1">
                Important alerts and system notifications requiring attention
              </p>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-4">
                {notifications.length === 0 && (
                  <div className="text-center text-gray-500">
                    No notifications
                  </div>
                )}
                {notifications.map((n) => (
                  <div key={n.id}>{getNotificationCard(n)}</div>
                ))}
              </div>
            </div>
            <div className="border-t px-6 py-4 flex justify-between items-center">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
              >
                Mark all as read
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleViewAllNotifications}
              >
                View All
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                {isRefreshing ? (
                  <span className="flex items-center">
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Refreshing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </span>
                )}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
