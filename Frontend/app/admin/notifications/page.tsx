"use client"

import { useEffect, useState } from "react"
import { Bell, AlertTriangle, Clock, CheckCircle, FileText, RefreshCw } from "lucide-react"
import { useNotifications, NotificationsProvider } from "@/components/NotificationsContext"

function getNotificationIcon(type: string) {
  switch (type) {
    case "error":
      return <AlertTriangle className="w-6 h-6 text-red-600" />
    case "warning":
      return <Clock className="w-6 h-6 text-yellow-600" />
    case "success":
      return <CheckCircle className="w-6 h-6 text-green-600" />
    case "info":
      return <FileText className="w-6 h-6 text-blue-600" />
    default:
      return <Bell className="w-6 h-6 text-gray-600" />
  }
}

function NotificationsContent() {
  // Placeholder for useNotifications context if it's not provided in the project
  // In a real scenario, you would ensure this context is available or mock it for preview.
  const { notifications, setNotifications } = useNotifications()
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Mark all as read when the page loads
  useEffect(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [setNotifications])

  const handleMarkAsRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const handleMarkAsUnread = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: false } : n)))
  }

  const handleDelete = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 700))
    setIsRefreshing(false)
  }

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-2">
      <div className="w-full max-w-5xl">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">All Notifications</h1>
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">Administrator</span>
          </div>
          <p className="text-gray-600 text-lg">View and manage all system notifications and alerts</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 border">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 sm:gap-0">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Bell className="w-6 h-6 text-black" />
                <span className="font-bold text-xl sm:text-2xl text-gray-900">System Notifications</span>
              </div>
              <p className="text-gray-600">All system notifications and alerts</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center justify-center gap-2 px-4 py-2 border rounded-lg bg-white hover:bg-gray-100 text-gray-900 font-medium shadow-sm disabled:opacity-60"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </button>
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 flex-shrink-0"
              >
                Mark All as Read
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            {notifications.length === 0 ? (
              <div className="text-center text-gray-500">No notifications</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`rounded-xl border p-6 flex flex-col gap-2 ${!n.read ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"}`}
                >
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    {getNotificationIcon(n.type)}
                    <span
                      className={`font-bold text-lg ${n.type === "error" ? "text-red-700" : n.type === "warning" ? "text-yellow-800" : n.type === "success" ? "text-green-700" : n.type === "info" ? "text-blue-700" : "text-gray-900"}`}
                    >
                      {n.title}
                    </span>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500 inline-block ml-1" title="Unread" />}
                    <span className="text-xs text-gray-500 ml-auto whitespace-nowrap">{n.time}</span>
                  </div>
                  <div className="text-gray-700 text-base font-medium">{n.message}</div>
                  <div className="text-gray-500 text-sm mb-2">{n.details}</div>
                  <div className="flex flex-col sm:flex-row gap-2 mt-2">
                    {n.read ? (
                      <button
                        className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-100 text-gray-900 font-medium"
                        onClick={() => handleMarkAsUnread(n.id)}
                      >
                        Mark as Unread
                      </button>
                    ) : (
                      <button
                        className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-100 text-gray-900 font-medium"
                        onClick={() => handleMarkAsRead(n.id)}
                      >
                        Mark as Read
                      </button>
                    )}
                    <button
                      className="px-4 py-2 rounded-lg border border-red-200 bg-white text-red-600 hover:text-red-700 font-medium"
                      onClick={() => handleDelete(n.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function NotificationsPage() {
  return (
    <NotificationsProvider>
      <NotificationsContent />
    </NotificationsProvider>
  )
}
