"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, CheckCircle, AlertCircle, Info } from "lucide-react"

interface Notification {
  id: string
  type: "success" | "warning" | "info" | "error"
  title: string
  message: string
  timestamp: string
  isRead: boolean
}

interface NotificationCenterProps {
  userId: string
}

export function NotificationCenter({ userId }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "info",
      title: "Request Update",
      message: "Your request 'Student Enrollment Data API' is under review",
      timestamp: "2 hours ago",
      isRead: false,
    },
    {
      id: "2",
      type: "success",
      title: "API Ready",
      message: "API documentation available for 'Research Publication Metrics'",
      timestamp: "1 day ago",
      isRead: false,
    },
    {
      id: "3",
      type: "warning",
      title: "Action Required",
      message: "Request 'Financial Aid Information' requires additional documentation",
      timestamp: "2 days ago",
      isRead: true,
    },
  ])

  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const unread = notifications.filter((n) => !n.isRead).length
    setUnreadCount(unread)
  }, [notifications])

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Info className="h-4 w-4 text-blue-600" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-800 bg-green-50"
      case "warning":
        return "text-yellow-800 bg-yellow-50"
      case "error":
        return "text-red-800 bg-red-50"
      default:
        return "text-blue-800 bg-blue-50"
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <div className="flex items-center justify-between p-3">
          <h3 className="font-semibold">Notifications</h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} unread
              </Badge>
            )}
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-6 px-2">
                Mark all read
              </Button>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />

        {notifications.length > 0 ? (
          <div className="max-h-96 overflow-y-auto">
            {notifications.slice(0, 5).map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex-col items-start p-3 cursor-pointer transition-colors ${
                  !notification.isRead ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-gray-50"
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start justify-between w-full mb-2">
                  <div className="flex items-center gap-2">
                    {getNotificationIcon(notification.type)}
                    <span className={`text-xs px-2 py-1 rounded ${getNotificationColor(notification.type)}`}>
                      {notification.type.toUpperCase()}
                    </span>
                    {!notification.isRead && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                  </div>
                  <span className="text-xs text-gray-500">{notification.timestamp}</span>
                </div>
                <h4 className={`font-medium text-sm mb-1 ${!notification.isRead ? "font-semibold" : ""}`}>
                  {notification.title}
                </h4>
                <p className="text-xs text-gray-600 line-clamp-2">{notification.message}</p>
              </DropdownMenuItem>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500 text-sm">
            <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>No notifications yet</p>
          </div>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-center text-blue-600 hover:text-blue-700 justify-center">
          View All Notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
