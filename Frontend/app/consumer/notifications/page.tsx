"use client";

import { useState, useEffect, useMemo } from "react";
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
  MessageCircle,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import Link from "next/link";

type NotificationType = "success" | "warning" | "error" | "info";

type Notification = {
  id: number;
  title: string;
  message: string;
  provider: string;
  type: NotificationType;
  timestamp: string;
  requestId: string;
  read: boolean;
};

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

type NotificationsPageProps = {
  userId?: string;
};

export default function NotificationsPage({ userId }: NotificationsPageProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
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

  const getNotificationIcon = (type: NotificationType) => {
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

  const getNotificationBadgeColor = (type: NotificationType): BadgeVariant => {
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
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAsUnread = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: false } : n))
    );
  };

  const unreadNotifications = useMemo(
    () => notifications.filter((n) => !n.read),
    [notifications]
  );

  const readNotifications = useMemo(
    () => notifications.filter((n) => n.read),
    [notifications]
  );

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
          <p>Failed to load notifications: {error}</p>
        </div>
      </DashboardLayout>
    );
  }

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
            <Button
              variant="outline"
              onClick={() => {
                setNotifications((prev) =>
                  prev.map((n) => ({ ...n, read: true }))
                );
              }}
            >
              Mark All as Read
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <SummaryCard
            title="Total"
            icon={<Bell className="h-5 w-5 text-blue-600" />}
            color="blue"
            count={notifications.length}
            description="All notifications"
          />
          <SummaryCard
            title="Unread"
            icon={<AlertCircle className="h-5 w-5 text-yellow-600" />}
            color="yellow"
            count={unreadNotifications.length}
            description="Need attention"
          />
          <SummaryCard
            title="Approvals"
            icon={<CheckCircle className="h-5 w-5 text-green-600" />}
            color="green"
            count={notifications.filter((n) => n.type === "success").length}
            description="Request approvals"
          />
          <SummaryCard
            title="Updates"
            icon={<Info className="h-5 w-5 text-purple-600" />}
            color="purple"
            count={notifications.filter((n) => n.type === "info").length}
            description="System updates"
          />
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

          <TabsContent value="unread">
            <NotificationList
              title="Unread Notifications"
              description="Notifications that require your attention"
              notifications={unreadNotifications}
              markAsRead={markAsRead}
              markAsUnread={markAsUnread}
              getIcon={getNotificationIcon}
              getBadge={getNotificationBadgeColor}
              formatTimestamp={formatTimestamp}
            />
          </TabsContent>

          <TabsContent value="all">
            <NotificationList
              title="All Notifications"
              description="Complete history of your notifications"
              notifications={notifications}
              markAsRead={markAsRead}
              markAsUnread={markAsUnread}
              getIcon={getNotificationIcon}
              getBadge={getNotificationBadgeColor}
              formatTimestamp={formatTimestamp}
            />
          </TabsContent>

          <TabsContent value="read">
            <NotificationList
              title="Read Notifications"
              description="Previously viewed notifications"
              notifications={readNotifications}
              markAsRead={markAsRead}
              markAsUnread={markAsUnread}
              getIcon={getNotificationIcon}
              getBadge={getNotificationBadgeColor}
              formatTimestamp={formatTimestamp}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

// Notification Card List
function NotificationList({
  title,
  description,
  notifications,
  markAsRead,
  markAsUnread,
  getIcon,
  getBadge,
  formatTimestamp,
}: {
  title: string;
  description: string;
  notifications: Notification[];
  markAsRead: (id: number) => void;
  markAsUnread: (id: number) => void;
  getIcon: (type: NotificationType) => JSX.Element;
  getBadge: (type: NotificationType) => BadgeVariant;
  formatTimestamp: (timestamp: string) => string;
}) {
  if (notifications.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">No notifications</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`border rounded-xl p-6 transition-all hover:shadow-md ${
                n.read ? "bg-gray-50" : "bg-gradient-to-r from-blue-50 to-white"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">{getIcon(n.type)}</div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between">
                    <h4
                      className={`font-semibold text-lg ${
                        n.read ? "text-gray-600" : ""
                      }`}
                    >
                      {n.title}
                    </h4>
                    <div className="flex gap-2 items-center">
                      <Badge variant={getBadge(n.type)} className="text-xs">
                        {n.type}
                      </Badge>
                      {!n.read && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                  </div>
                  <p className={n.read ? "text-gray-600" : "text-gray-700"}>
                    {n.message}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>
                      Provider: <strong>{n.provider}</strong>
                    </span>
                    <span>•</span>
                    <span>{formatTimestamp(n.timestamp)}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4 gap-2">
                <Link href={`/consumer/${n.requestId}/chat`}>
                  <Button
                    size="sm"
                    className="text-xs bg-gradient-to-r from-[#7BC9FF] to-[#9B7EBD] hover:from-[#E8988A] hover:to-[#E0B8B0] text-white transition-colors"
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Chat
                  </Button>
                </Link>
                {n.read ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => markAsUnread(n.id)}
                  >
                    <MarkAsUnread className="h-4 w-4 mr-1" />
                    Mark as Unread
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => markAsRead(n.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Mark as Read
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Summary Card
function SummaryCard({
  title,
  icon,
  color,
  count,
  description,
}: {
  title: string;
  icon: JSX.Element;
  color: string;
  count: number;
  description: string;
}) {
  return (
    <Card
      className={`border-0 shadow-lg bg-gradient-to-br from-${color}-50 to-${color}-100`}
    >
      <CardHeader className="flex justify-between items-center pb-2">
        <CardTitle className={`text-sm font-medium text-${color}-700`}>
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold text-${color}-800`}>{count}</div>
        <p className={`text-xs text-${color}-600 mt-1`}>{description}</p>
      </CardContent>
    </Card>
  );
}
