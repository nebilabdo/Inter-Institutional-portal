export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  createdAt: string
  actionUrl?: string
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: "1",
    userId: "consumer-1",
    title: "Request Approved",
    message: 'Your API request "Student Enrollment Data" has been approved',
    type: "success",
    read: false,
    createdAt: "2024-01-16T10:00:00Z",
    actionUrl: "/consumer/requests/1",
  },
  {
    id: "2",
    userId: "provider-1",
    title: "New Request",
    message: "New API request received from University of Technology",
    type: "info",
    read: false,
    createdAt: "2024-01-16T09:30:00Z",
    actionUrl: "/provider/requests/pending",
  },
]

export async function getNotifications(userId: string): Promise<Notification[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userNotifications = mockNotifications.filter((n) => n.userId === userId)
      resolve(userNotifications)
    }, 100)
  })
}

export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const notification = mockNotifications.find((n) => n.id === notificationId)
      if (notification) {
        notification.read = true
        resolve(true)
      } else {
        resolve(false)
      }
    }, 100)
  })
}

export async function createNotification(notification: Omit<Notification, "id" | "createdAt">): Promise<Notification> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      }
      mockNotifications.push(newNotification)
      resolve(newNotification)
    }, 100)
  })
}

export async function deleteNotification(notificationId: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockNotifications.findIndex((n) => n.id === notificationId)
      if (index !== -1) {
        mockNotifications.splice(index, 1)
        resolve(true)
      } else {
        resolve(false)
      }
    }, 100)
  })
}
