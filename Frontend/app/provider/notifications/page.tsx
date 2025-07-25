"use client";

import { useState } from "react";
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
  Download,
  Activity,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import Link from "next/link";

export default function ProviderNotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New API Access Request",
      message:
        "Consumer 'EduApp' requested access to your Student Enrollment API.",
      type: "info",
      timestamp: "2024-07-14T12:00:00Z",
      read: false,
      requestId: 101,
      consumer: "EduApp",
    },
    {
      id: 2,
      title: "Request Approved",
      message:
        "You approved 'HealthTracker' access to Healthcare Provider Directory API.",
      type: "success",
      timestamp: "2024-07-13T08:30:00Z",
      read: false,
      requestId: 99,
      consumer: "HealthTracker",
    },
    {
      id: 3,
      title: "Analytics Report Ready",
      message: "Your monthly API usage analytics report is ready to view.",
      type: "info",
      timestamp: "2024-07-12T14:45:00Z",
      read: true,
      requestId: null,
      consumer: null,
    },
    {
      id: 4,
      title: "Security Alert",
      message:
        "Suspicious activity detected on Financial Aid API. Please review access logs.",
      type: "warning",
      timestamp: "2024-07-11T18:00:00Z",
      read: false,
      requestId: null,
      consumer: null,
    },
    {
      id: 5,
      title: "API Version Update",
      message:
        "Student Enrollment API version 2.2 is now live with new endpoints.",
      type: "info",
      timestamp: "2024-07-10T09:15:00Z",
      read: true,
      requestId: null,
      consumer: null,
    },
  ]);

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

  const markRead = (id: number) =>
    setNotifications((n) =>
      n.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  const markUnread = (id: number) =>
    setNotifications((n) =>
      n.map((notif) => (notif.id === id ? { ...notif, read: false } : notif))
    );
  const deleteNotif = (id: number) =>
    setNotifications((n) => n.filter((notif) => notif.id !== id));

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
              Manage API requests, approvals, and alerts
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-indigo-100">
            <CardHeader className="flex justify-between items-center pb-2">
              <CardTitle className="text-sm font-medium text-indigo-700">
                Total
              </CardTitle>
              <Bell className="h-5 w-5 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-800">
                {notifications.length}
              </div>
              <p className="text-xs text-indigo-600 mt-1">All notifications</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardHeader className="flex justify-between items-center pb-2">
              <CardTitle className="text-sm font-medium text-yellow-700">
                Unread
              </CardTitle>
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-800">
                {unread.length}
              </div>
              <p className="text-xs text-yellow-600 mt-1">Need attention</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="flex justify-between items-center pb-2">
              <CardTitle className="text-sm font-medium text-green-700">
                Approvals
              </CardTitle>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-800">
                {notifications.filter((n) => n.type === "success").length}
              </div>
              <p className="text-xs text-green-600 mt-1">Recent approvals</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardHeader className="flex justify-between items-center pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">
                Alerts
              </CardTitle>
              <Activity className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-800">
                {notifications.filter((n) => n.type === "warning").length}
              </div>
              <p className="text-xs text-purple-600 mt-1">
                Security & system alerts
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Notifications Tabs */}
        <Tabs defaultValue="unread" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="unread">Unread ({unread.length})</TabsTrigger>
            <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
            <TabsTrigger value="read">Read ({read.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="unread" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Unread Notifications
                </CardTitle>
                <CardDescription>
                  Notifications needing your attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                {unread.length > 0 ? (
                  unread.map((notif) => (
                    <div
                      key={notif.id}
                      className="border rounded-xl p-6 bg-gradient-to-r from-indigo-50 to-white hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          {getIcon(notif.type)}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <h4 className="font-semibold text-lg">
                              {notif.title}
                            </h4>
                            <Badge
                              variant={getBadgeVariant(notif.type) as any}
                              className="text-xs"
                            >
                              {notif.type}
                            </Badge>
                          </div>
                          <p className="text-gray-700">{notif.message}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            {notif.consumer && (
                              <>
                                <span>
                                  Consumer: <strong>{notif.consumer}</strong>
                                </span>
                                <span>•</span>
                              </>
                            )}
                            <span>{formatTime(notif.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end mt-4 gap-2">
                        {notif.requestId && (
                          <Link href={`/provider/requests/${notif.requestId}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View Request
                            </Button>
                          </Link>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markRead(notif.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Mark as Read
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 bg-transparent"
                          onClick={() => deleteNotif(notif.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      No unread notifications
                    </h3>
                    <p className="text-gray-500">You're all caught up!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  All Notifications
                </CardTitle>
                <CardDescription>Complete notification history</CardDescription>
              </CardHeader>
              <CardContent>
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`border rounded-xl p-6 transition-shadow ${
                      notif.read
                        ? "bg-gray-50"
                        : "bg-gradient-to-r from-indigo-50 to-white"
                    } hover:shadow-md`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {getIcon(notif.type)}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <h4
                            className={`font-semibold text-lg ${
                              notif.read ? "text-gray-600" : ""
                            }`}
                          >
                            {notif.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={getBadgeVariant(notif.type) as any}
                              className="text-xs"
                            >
                              {notif.type}
                            </Badge>
                            {!notif.read && (
                              <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                            )}
                          </div>
                        </div>
                        <p
                          className={`${
                            notif.read ? "text-gray-600" : "text-gray-700"
                          }`}
                        >
                          {notif.message}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          {notif.consumer && (
                            <>
                              <span>
                                Consumer: <strong>{notif.consumer}</strong>
                              </span>
                              <span>•</span>
                            </>
                          )}
                          <span>{formatTime(notif.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end mt-4 gap-2">
                      {notif.requestId && (
                        <Link href={`/provider/requests/${notif.requestId}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View Request
                          </Button>
                        </Link>
                      )}
                      {notif.read ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markUnread(notif.id)}
                        >
                          Mark as Unread
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markRead(notif.id)}
                        >
                          Mark as Read
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 bg-transparent"
                        onClick={() => deleteNotif(notif.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="read" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Read Notifications
                </CardTitle>
                <CardDescription>
                  Previously viewed notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                {read.length > 0 ? (
                  read.map((notif) => (
                    <div
                      key={notif.id}
                      className="border rounded-xl p-6 bg-gray-50 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          {getIcon(notif.type)}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <h4 className="font-semibold text-lg text-gray-600">
                              {notif.title}
                            </h4>
                            <Badge
                              variant={getBadgeVariant(notif.type) as any}
                              className="text-xs"
                            >
                              {notif.type}
                            </Badge>
                          </div>
                          <p className="text-gray-600">{notif.message}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            {notif.consumer && (
                              <>
                                <span>
                                  Consumer: <strong>{notif.consumer}</strong>
                                </span>
                                <span>•</span>
                              </>
                            )}
                            <span>{formatTime(notif.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end mt-4 gap-2">
                        {notif.requestId && (
                          <Link href={`/provider/requests/${notif.requestId}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View Request
                            </Button>
                          </Link>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markUnread(notif.id)}
                        >
                          Mark as Unread
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 bg-transparent"
                          onClick={() => deleteNotif(notif.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      No read notifications
                    </h3>
                    <p className="text-gray-500">
                      Read notifications will appear here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
