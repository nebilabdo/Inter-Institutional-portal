"use client"

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface Notification {
  id: number
  type: "error" | "warning" | "success" | "info" | "default"
  title: string
  message: string
  details: string
  time: string
  read: boolean
}

interface NotificationsContextType {
  notifications: Notification[]
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    // Simulate fetching notifications
    const fetchedNotifications: Notification[] = [
      {
        id: 1,
        type: "error",
        title: "Critical System Alert",
        message: "Database connection lost. Immediate action required.",
        details:
          "Failed to connect to primary database server at 192.168.1.100. Please check network connectivity and database service status.",
        time: "2 min ago",
        read: false,
      },
      {
        id: 2,
        type: "warning",
        title: "Low Disk Space Warning",
        message: "Server storage is running low. Consider freeing up space.",
        details:
          "Disk usage on /dev/sda1 is at 95%. Performance may degrade soon. Recommended action: clean up temporary files or expand storage.",
        time: "15 min ago",
        read: false,
      },
      {
        id: 3,
        type: "success",
        title: "Backup Completed Successfully",
        message: "Daily database backup finished without errors.",
        details:
          "Full backup of production database to remote storage completed at 03:00 AM UTC. Data integrity verified.",
        time: "1 hour ago",
        read: true,
      },
      {
        id: 4,
        type: "info",
        title: "New Software Update Available",
        message: "Version 2.1.0 of the application is now available.",
        details:
          "This update includes performance improvements, bug fixes, and new features. Please review the release notes for more details.",
        time: "3 hours ago",
        read: false,
      },
      {
        id: 5,
        type: "default",
        title: "User Login Attempt",
        message: "Unusual login attempt detected from an unknown IP address.",
        details:
          "IP: 203.0.113.45. Location: Unknown. Please verify if this was you. If not, secure your account immediately.",
        time: "Yesterday",
        read: true,
      },
    ]
    setNotifications(fetchedNotifications)
  }, [])

  return (
    <NotificationsContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationsContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationsContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationsProvider")
  }
  return context
} 