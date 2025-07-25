"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  Clock,
  BookMarkedIcon as MarkAsUnread,
  MessageCircle,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import Link from "next/link"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Request Approved: Student Enrollment Data API",
      message:
        "Your API request has been approved by Ministry of Education. You can now access the API documentation and start integration.",
      type: "success",
      timestamp: "2024-01-18T10:30:00Z",
      read: false,
      requestId: 1,
      provider: "Ministry of Education",
    },
    {
      id: 2,
      title: "API Documentation Updated",
      message:
        "New documentation is available for Research Publication Metrics API with updated endpoints and examples.",
      type: "info",
      timestamp: "2024-01-17T15:45:00Z",
      read: false,
      requestId: 2,
      provider: "Academic Publishers Consortium",
    },
    {
      id: 3,
      title: "Request Under Review",
      message:
        "Your request for Healthcare Provider Directory is currently being reviewed by the Ministry of Health team.",
      type: "info",
      timestamp: "2024-01-17T09:15:00Z",
      read: true,
      requestId: 4,
      provider: "Ministry of Health",
    },
    {
      id: 4,
      title: "Additional Information Required",
      message:
        "Your Financial Aid Information request requires additional security clearance documentation. Please update your request.",
      type: "warning",
      timestamp: "2024-01-16T14:20:00Z",
      read: false,
      requestId: 3,
      provider: "Department of Financial Services",
    },
    {
      id: 5,
      title: "API Rate Limit Update",
      message:
        "The rate limit for Student Enrollment Data API has been increased to 2000 requests/hour based on your usage patterns.",
      type: "info",
      timestamp: "2024-01-15T11:00:00Z",
      read: true,
      requestId: 1,
      provider: "Ministry of Education",
    },
    {
      id: 6,
      title: "Maintenance Scheduled",
      message:
        "Scheduled maintenance for Research Publication Metrics API on January 20th, 2024 from 2:00 AM to 4:00 AM UTC.",
      type: "warning",
      timestamp: "2024-01-14T16:30:00Z",
      read: true,
      requestId: 2,
      provider: "Academic Publishers Consortium",
    },
  ])
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      default:
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }
  const getNotificationBadgeColor = (type: string) => {
    switch (type) {
      case "success":
        return "default"
      case "warning":
        return "secondary"
      case "error":
        return "destructive"
      default:
        return "outline"
    }
  }
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
    }
  }
  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }
  const markAsUnread = (id: number) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: false } : notif)))
  }
  const unreadNotifications = notifications.filter((n) => !n.read)
  const readNotifications = notifications.filter((n) => n.read)
  return (
    <DashboardLayout userRole="consumer">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Notifications
            </h1>
            <p className="text-gray-600 mt-2">Stay updated on your API requests and system updates</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-sm">
              {unreadNotifications.length} unread
            </Badge>
            <Button
              variant="outline"
              onClick={() => {
                setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
              }}
            >
              Mark All as Read
            </Button>
          </div>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Total</CardTitle>
              <Bell className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-800">{notifications.length}</div>
              <p className="text-xs text-blue-600 mt-1">All notifications</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-700">Unread</CardTitle>
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-800">{unreadNotifications.length}</div>
              <p className="text-xs text-yellow-600 mt-1">Need attention</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Approvals</CardTitle>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-800">
                {notifications.filter((n) => n.type === "success").length}
              </div>
              <p className="text-xs text-green-600 mt-1">Request approvals</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Updates</CardTitle>
              <Info className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-800">
                {notifications.filter((n) => n.type === "info").length}
              </div>
              <p className="text-xs text-purple-600 mt-1">System updates</p>
            </CardContent>
          </Card>
        </div>
        {/* Notifications */}
        <Tabs defaultValue="unread" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="unread">Unread ({unreadNotifications.length})</TabsTrigger>
            <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
            <TabsTrigger value="read">Read ({readNotifications.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="unread" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Unread Notifications
                </CardTitle>
                <CardDescription>Notifications that require your attention</CardDescription>
              </CardHeader>
              <CardContent>
                {unreadNotifications.length > 0 ? (
                  <div className="space-y-4">
                    {unreadNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="border rounded-xl p-6 bg-gradient-to-r from-blue-50 to-white hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                              <h4 className="font-semibold text-lg">{notification.title}</h4>
                              <Badge variant={getNotificationBadgeColor(notification.type) as any} className="text-xs">
                                {notification.type}
                              </Badge>
                            </div>
                            <p className="text-gray-700">{notification.message}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>
                                Provider: <strong>{notification.provider}</strong>
                              </span>
                              <span>•</span>
                              <span>{formatTimestamp(notification.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end mt-4 gap-2">
                          <Link href={`/consumer/${notification.requestId}/chat`}>
                            <Button
                              size="sm"
                              className="text-xs bg-gradient-to-r from-[#7BC9FF] to-[#9B7EBD] hover:from-[#E8988A] hover:to-[#E0B8B0] text-white transition-colors"
                            >
                              <MessageCircle className="h-4 w-4 mr-1" />
                              Chat
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm" onClick={() => markAsRead(notification.id)}>
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
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">All caught up!</h3>
                    <p className="text-gray-500">You have no unread notifications</p>
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
                <CardDescription>Complete history of your notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`border rounded-xl p-6 transition-all hover:shadow-md ${
                        notification.read ? "bg-gray-50" : "bg-gradient-to-r from-blue-50 to-white"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <h4 className={`font-semibold text-lg ${notification.read ? "text-gray-600" : ""}`}>
                              {notification.title}
                            </h4>
                            <div className="flex items-center gap-2">
                              <Badge variant={getNotificationBadgeColor(notification.type) as any} className="text-xs">
                                {notification.type}
                              </Badge>
                              {!notification.read && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                            </div>
                          </div>
                          <p className={`${notification.read ? "text-gray-600" : "text-gray-700"}`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>
                              Provider: <strong>{notification.provider}</strong>
                            </span>
                            <span>•</span>
                            <span>{formatTimestamp(notification.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end mt-4 gap-2">
                        <Link href={`/consumer/${notification.requestId}/chat`}>
                          <Button
                            size="sm"
                            className="text-xs bg-gradient-to-r from-[#7BC9FF] to-[#9B7EBD] hover:from-[#E8988A] hover:to-[#E0B8B0] text-white transition-colors"
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Chat
                          </Button>
                        </Link>
                        {notification.read ? (
                          <Button variant="outline" size="sm" onClick={() => markAsUnread(notification.id)}>
                            <MarkAsUnread className="h-4 w-4 mr-1" />
                            Mark as Unread
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" onClick={() => markAsRead(notification.id)}>
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
          </TabsContent>
          <TabsContent value="read" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Read Notifications
                </CardTitle>
                <CardDescription>Previously viewed notifications</CardDescription>
              </CardHeader>
              <CardContent>
                {readNotifications.length > 0 ? (
                  <div className="space-y-4">
                    {readNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="border rounded-xl p-6 bg-gray-50 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                              <h4 className="font-semibold text-lg text-gray-600">{notification.title}</h4>
                              <Badge variant={getNotificationBadgeColor(notification.type) as any} className="text-xs">
                                {notification.type}
                              </Badge>
                            </div>
                            <p className="text-gray-600">{notification.message}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>
                                Provider: <strong>{notification.provider}</strong>
                              </span>
                              <span>•</span>
                              <span>{formatTimestamp(notification.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end mt-4 gap-2">
                          <Link href={`/consumer/${notification.requestId}/chat`}>
                            <Button
                              size="sm"
                              className="text-xs bg-gradient-to-r from-[#7BC9FF] to-[#9B7EBD] hover:from-[#E8988A] hover:to-[#E0B8B0] text-white transition-colors"
                            >
                              <MessageCircle className="h-4 w-4 mr-1" />
                              Chat
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm" onClick={() => markAsUnread(notification.id)}>
                            <MarkAsUnread className="h-4 w-4 mr-1" />
                            Mark as Unread
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No read notifications</h3>
                    <p className="text-gray-500">Read notifications will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
