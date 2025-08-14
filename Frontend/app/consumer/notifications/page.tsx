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
  BookMarked as BookMarkedIcon,
  MessageCircle,
  Eye,
  FileText,
  X,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import Link from "next/link";
import { jsPDF } from "jspdf";

import { PDFPageProxy } from "pdfjs-dist";

interface PDFPreviewOptions {
  doc: jsPDF;
  yPosition: number;
  maxWidth?: number;
  quality?: number;
}

type Notification = {
  id: number;
  title: string;
  message: string;
  type: "success" | "warning" | "error" | "info";
  timestamp: string;
  read: boolean;
  requestId: number;
  provider: string;
  isRead?: number;
};

type UniversalRequest = {
  id: number;
  customer_name: string;
  national_id_path: string;
  supporting_docs: string[];
  institution_ids: number[];
  status: string;
  created_at: string;
  user_id: number;
  is_notified: number;
  read?: boolean;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<
    (Notification | UniversalRequest)[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewingNotification, setViewingNotification] = useState<
    Notification | UniversalRequest | null
  >(null);
  // Add these with your other state declarations

  const [selectedRequest, setSelectedRequest] = useState<
    Notification | UniversalRequest | null
  >(null);

  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        // Fetch notifications
        const notifRes = await fetch(
          "http://localhost:5000/api/notifications",
          {
            credentials: "include",
            signal,
          }
        );
        if (!notifRes.ok)
          throw new Error(
            `Failed to fetch notifications: ${notifRes.statusText}`
          );
        const notifData: Notification[] = await notifRes.json();
        const mappedNotifications = notifData.map((notif) => ({
          ...notif,
          read: notif.isRead === 1,
        }));

        // Fetch universal requests
        const universalRes = await fetch(
          "http://localhost:5000/api/requests/universal-requests",
          {
            credentials: "include",
            signal,
          }
        );
        if (!universalRes.ok)
          throw new Error(
            `Failed to fetch universal: ${universalRes.statusText}`
          );
        const universalJson = await universalRes.json();
        const universalData: UniversalRequest[] = (
          universalJson.requests || []
        ).map((req: UniversalRequest) => ({
          ...req,
          read: true, // Default to read for universal requests
        }));

        // Merge results
        const combined = [...mappedNotifications, ...universalData];
        setNotifications(combined);
      } catch (e: any) {
        if (e.name !== "AbortError") {
          setError(e.message || "Unknown error");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    return () => controller.abort();
  }, []);

  const deleteNotification = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:5000/api/notifications/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete notification");
      setNotifications((n) => n.filter((notif) => notif.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("http://localhost:5000/api/notifications/mark-all-read", {
        method: "PATCH",
      });

      setNotifications((n) => n.map((notif) => ({ ...notif, read: true })));
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  const getNotificationIcon = (type: string) => {
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

  const getNotificationBadgeColor = (type: string) => {
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

  const markAsRead = async (id: number) => {
    try {
      // Step 1: Update in backend
      await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: "PATCH",
        credentials: "include",
      });

      // Step 2: REFETCH DATA HERE ⭐
      const response = await fetch("http://localhost:5000/api/notifications", {
        credentials: "include",
      });
      const freshData = await response.json();

      // Step 3: Update React state
      setNotifications(freshData);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const markAsUnread = async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/notifications/${id}/unread`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark as unread");
      }

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: false } : n))
      );
    } catch (error) {
      console.error("Error marking as unread:", error);
      // Optional: Show error to user
    }
  };

  const exportNotificationToPdf = async (
    notification: Notification | UniversalRequest
  ) => {
    const doc = new jsPDF();
    let yPosition = 20; // Starting Y position

    // Title
    doc.setFontSize(18);
    if ("title" in notification) {
      doc.text(notification.title, 15, yPosition);
    } else {
      doc.text(
        `Universal Request - ${notification.customer_name}`,
        15,
        yPosition
      );
    }
    yPosition += 10;

    // Basic info
    doc.setFontSize(12);
    doc.setTextColor(100);

    if ("type" in notification) {
      doc.text(`Type: ${notification.type.toUpperCase()}`, 15, yPosition);
      yPosition += 7;
      doc.text(`Provider: ${notification.provider}`, 15, yPosition);
      yPosition += 7;
      doc.text(
        `Date: ${new Date(notification.timestamp).toLocaleString()}`,
        15,
        yPosition
      );
      yPosition += 7;
    } else {
      doc.text(`Status: ${notification.status.toUpperCase()}`, 15, yPosition);
      yPosition += 7;
      doc.text(
        `Date: ${new Date(notification.created_at).toLocaleString()}`,
        15,
        yPosition
      );
      yPosition += 10;
    }

    // Main content
    if ("message" in notification) {
      doc.setFontSize(14);
      doc.setTextColor(0);
      const splitMessage = doc.splitTextToSize(notification.message, 180);
      doc.text(splitMessage, 15, yPosition);
    } else {
      // For universal requests, add document information
      if (notification.national_id_path) {
        const nationalIdUrl = `http://localhost:5000/${notification.national_id_path.replace(
          /\\/g,
          "/"
        )}`;
        yPosition = await addPdfPreview(nationalIdUrl, "National ID Document", {
          doc,
          yPosition,
        });
      }

      // Add supporting docs info
      if (notification.supporting_docs?.length > 0) {
        doc.setFontSize(14);
        doc.text("Supporting Documents:", 15, yPosition);
        yPosition += 10;

        for (const docUrl of notification.supporting_docs) {
          const supportingDocUrl = `http://localhost:5000/${docUrl.replace(
            /\\/g,
            "/"
          )}`;
          yPosition = await addPdfPreview(
            supportingDocUrl,
            "Supporting Document",
            {
              doc,
              yPosition,
            }
          );
        }
      }
    }

    doc.save(`request-${notification.id}.pdf`);
  };

  // Standalone addPdfPreview function (moved outside exportNotificationToPdf)
  const addPdfPreview = async (
    pdfUrl: string,
    title: string,
    options: PDFPreviewOptions
  ): Promise<number> => {
    const { doc, yPosition: initialY, maxWidth = 180, quality = 0.8 } = options;
    let yPosition = initialY;

    try {
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text(`${title}:`, 15, yPosition);
      yPosition += 10;

      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

      const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.0 });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Could not create canvas context");

      const scale = maxWidth / viewport.width;
      const scaledHeight = viewport.height * scale;
      canvas.height = scaledHeight;
      canvas.width = maxWidth;

      // Render the page
      await renderPage(page, canvas, viewport);

      const imgData = canvas.toDataURL("image/jpeg", quality);

      if (yPosition + scaledHeight > doc.internal.pageSize.height - 20) {
        doc.addPage();
        yPosition = 20;
      }

      doc.addImage(imgData, "JPEG", 15, yPosition, maxWidth, scaledHeight);
      yPosition += scaledHeight + 10;

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Document: ${pdfUrl.split("/").pop()}`, 15, yPosition);
      yPosition += 7;

      return yPosition;
    } catch (error) {
      console.error(`Error rendering ${title}:`, error);
      doc.setFontSize(12);
      doc.text(`Could not load PDF preview for ${title}`, 15, yPosition);
      yPosition += 7;
      doc.text(`Document: ${pdfUrl.split("/").pop()}`, 20, yPosition);
      yPosition += 10;
      return yPosition;
    }
  };

  // Version-compatible render function
  async function renderPage(
    page: PDFPageProxy,
    canvas: HTMLCanvasElement,
    viewport: any
  ): Promise<void> {
    const renderContext = {
      canvasContext: canvas.getContext("2d")!,
      viewport: viewport,
    };

    // Modern PDF.js (v2.0+) uses this syntax
    await page.render(renderContext).promise;
  }

  const unreadNotifications = notifications.filter((n) => !n.read);
  const readNotifications = notifications.filter((n) => n.read);

  const handleRequestMoreInfo = async () => {
    if (!selectedRequest || !message) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/requests/${selectedRequest.id}/request-more-info`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message }),
        }
      );

      if (!res.ok) throw new Error("Failed to send info request");

      const data = await res.json();

      if (data.success) {
        alert("Message sent successfully.");
        setMessage("");
        setSelectedRequest(null);
        setShowMessageModal(false);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send message.");
    }
  };

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
          <p>Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="consumer">
      <div className="space-y-8">
        {/* Header */}
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
            <Button variant="outline" onClick={markAllAsRead}>
              Mark All as Read
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">
                Total
              </CardTitle>
              <Bell className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-800">
                {notifications.length}
              </div>
              <p className="text-xs text-blue-600 mt-1">All notifications</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-700">
                Unread
              </CardTitle>
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-800">
                {unreadNotifications.length}
              </div>
              <p className="text-xs text-yellow-600 mt-1">Need attention</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">
                Approvals
              </CardTitle>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-800">
                {
                  notifications.filter(
                    (n) => "type" in n && n.type === "success"
                  ).length
                }
              </div>
              <p className="text-xs text-green-600 mt-1">Request approvals</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">
                Updates
              </CardTitle>
              <Info className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-800">
                {
                  notifications.filter((n) => "type" in n && n.type === "info")
                    .length
                }
              </div>
              <p className="text-xs text-purple-600 mt-1">System updates</p>
            </CardContent>
          </Card>
        </div>

        {/* Notification Modal */}
        {viewingNotification && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  {"type" in viewingNotification ? (
                    getNotificationIcon(viewingNotification.type)
                  ) : (
                    <Info className="h-5 w-5 text-blue-600" />
                  )}
                  <h3 className="text-2xl font-bold">
                    {"title" in viewingNotification
                      ? viewingNotification.title
                      : `Request from ${viewingNotification.customer_name}`}
                  </h3>
                </div>
                <button
                  onClick={() => setViewingNotification(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <p className="text-gray-700 text-lg">
                  {"message" in viewingNotification
                    ? viewingNotification.message
                    : `Request status: ${viewingNotification.status}`}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-gray-500">
                  {"provider" in viewingNotification && (
                    <>
                      <span>
                        <strong>Provider:</strong>{" "}
                        {viewingNotification.provider}
                      </span>
                      <span>•</span>
                    </>
                  )}
                  <span>
                    <strong>Date:</strong>{" "}
                    {new Date(
                      "timestamp" in viewingNotification
                        ? viewingNotification.timestamp
                        : viewingNotification.created_at
                    ).toLocaleString()}
                  </span>
                  <span>•</span>
                  <span>
                    <strong>Status:</strong>{" "}
                    {viewingNotification.read ? "Read" : "Unread"}
                  </span>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => exportNotificationToPdf(viewingNotification)}
                    className="flex items-center gap-2"
                  >
                    <FileText size={18} />
                    Export as PDF
                  </Button>

                  {"id" in viewingNotification && (
                    <Button
                      className="flex items-center gap-2 bg-gradient-to-r from-[#7BC9FF] to-[#9B7EBD] hover:from-[#E8988A] hover:to-[#E0B8B0] text-white"
                      onClick={() => {
                        setSelectedRequest(viewingNotification);
                        setShowMessageModal(true);
                      }}
                    >
                      <MessageCircle size={18} />
                      Message Consumer
                    </Button>
                  )}

                  {viewingNotification.read ? (
                    <Button
                      variant="outline"
                      onClick={() => {
                        markAsUnread(viewingNotification.id);
                        setViewingNotification(null);
                      }}
                      className="flex items-center gap-2"
                    >
                      <BookMarkedIcon size={18} />
                      Mark as Unread
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => {
                        markAsRead(viewingNotification.id);
                        setViewingNotification(null);
                      }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle size={18} />
                      Mark as Read
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tabs */}
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

          {/* Unread Tab */}
          <TabsContent value="unread" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Unread Notifications
                </CardTitle>
                <CardDescription>
                  Notifications that require your attention
                </CardDescription>
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
                          <div className="flex-shrink-0 mt-1">
                            {"type" in notification ? (
                              getNotificationIcon(notification.type)
                            ) : (
                              <Info className="h-5 w-5 text-blue-600" />
                            )}
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                              <h4 className="font-semibold text-lg">
                                {"title" in notification
                                  ? notification.title
                                  : `Request from ${notification.customer_name}`}
                              </h4>
                              {"type" in notification && (
                                <Badge
                                  variant={
                                    getNotificationBadgeColor(
                                      notification.type
                                    ) as any
                                  }
                                  className="text-xs"
                                >
                                  {notification.type}
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-700">
                              {"message" in notification
                                ? notification.message
                                : `Request status: ${notification.status}`}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              {"provider" in notification && (
                                <>
                                  <span>
                                    Provider:{" "}
                                    <strong>{notification.provider}</strong>
                                  </span>
                                  <span>•</span>
                                </>
                              )}
                              <span>
                                {formatTimestamp(
                                  "timestamp" in notification
                                    ? notification.timestamp
                                    : notification.created_at
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end mt-4 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setViewingNotification(notification)}
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              exportNotificationToPdf(notification)
                            }
                            className="flex items-center gap-1"
                          >
                            <FileText className="h-4 w-4" />
                            Export PDF
                          </Button>
                          {"id" in notification && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedRequest(notification);
                                setShowMessageModal(true);
                              }}
                            >
                              <MessageCircle className="h-4 w-4 mr-1" />
                              Message Consumer
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
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
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      All caught up!
                    </h3>
                    <p className="text-gray-500">
                      You have no unread notifications
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Tab */}
          <TabsContent value="all" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  All Notifications
                </CardTitle>
                <CardDescription>
                  Complete history of your notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`border rounded-xl p-6 transition-all hover:shadow-md ${
                        notification.read
                          ? "bg-gray-50"
                          : "bg-gradient-to-r from-blue-50 to-white"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          {"type" in notification ? (
                            getNotificationIcon(notification.type)
                          ) : (
                            <Info className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <h4
                              className={`font-semibold text-lg ${
                                notification.read ? "text-gray-600" : ""
                              }`}
                            >
                              {"title" in notification
                                ? notification.title
                                : `Request from ${notification.customer_name}`}
                            </h4>
                            <div className="flex items-center gap-2">
                              {"type" in notification && (
                                <Badge
                                  variant={
                                    getNotificationBadgeColor(
                                      notification.type
                                    ) as any
                                  }
                                  className="text-xs"
                                >
                                  {notification.type}
                                </Badge>
                              )}
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              )}
                            </div>
                          </div>
                          <p
                            className={
                              notification.read
                                ? "text-gray-600"
                                : "text-gray-700"
                            }
                          >
                            {"message" in notification
                              ? notification.message
                              : `Request status: ${notification.status}`}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            {"provider" in notification && (
                              <>
                                <span>
                                  Provider:{" "}
                                  <strong>{notification.provider}</strong>
                                </span>
                                <span>•</span>
                              </>
                            )}
                            <span>
                              {formatTimestamp(
                                "timestamp" in notification
                                  ? notification.timestamp
                                  : notification.created_at
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end mt-4 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setViewingNotification(notification)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => exportNotificationToPdf(notification)}
                          className="flex items-center gap-1"
                        >
                          <FileText className="h-4 w-4" />
                          Export PDF
                        </Button>
                        {/* {"requestId" in notification && (
                          <Link
                            href={`/consumer/${notification.requestId}/chat`}
                          >
                            <Button
                              size="sm"
                              className="text-xs bg-gradient-to-r from-[#7BC9FF] to-[#9B7EBD] hover:from-[#E8988A] hover:to-[#E0B8B0] text-white transition-colors"
                            >
                              <MessageCircle className="h-4 w-4 mr-1" />
                              Chat
                            </Button>
                          </Link>
                        )} */}
                        {notification.read ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAsUnread(notification.id)}
                          >
                            <BookMarkedIcon className="h-4 w-4 mr-1" />
                            Mark as Unread
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
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
          </TabsContent>

          {/* Read Tab */}
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
                {readNotifications.length > 0 ? (
                  <div className="space-y-4">
                    {readNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="border rounded-xl p-6 bg-gray-50 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 mt-1">
                            {"type" in notification ? (
                              getNotificationIcon(notification.type)
                            ) : (
                              <Info className="h-5 w-5 text-blue-600" />
                            )}
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                              <h4 className="font-semibold text-lg text-gray-600">
                                {"title" in notification
                                  ? notification.title
                                  : `Request from ${notification.customer_name}`}
                              </h4>
                              {"type" in notification && (
                                <Badge
                                  variant={
                                    getNotificationBadgeColor(
                                      notification.type
                                    ) as any
                                  }
                                  className="text-xs"
                                >
                                  {notification.type}
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-600">
                              {"message" in notification
                                ? notification.message
                                : `Request status: ${notification.status}`}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              {"provider" in notification && (
                                <>
                                  <span>
                                    Provider:{" "}
                                    <strong>{notification.provider}</strong>
                                  </span>
                                  <span>•</span>
                                </>
                              )}
                              <span>
                                {formatTimestamp(
                                  "timestamp" in notification
                                    ? notification.timestamp
                                    : notification.created_at
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end mt-4 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setViewingNotification(notification)}
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () =>
                              await exportNotificationToPdf(notification)
                            }
                            className="flex items-center gap-1"
                          >
                            <FileText className="h-4 w-4" />
                            Export PDF
                          </Button>
                          {/* {"requestId" in notification && (
                            <Link
                              href={`/consumer/${notification.requestId}/chat`}
                            >
                              <Button
                                size="sm"
                                className="text-xs bg-gradient-to-r from-[#7BC9FF] to-[#9B7EBD] hover:from-[#E8988A] hover:to-[#E0B8B0] text-white transition-colors"
                              >
                                <MessageCircle className="h-4 w-4 mr-1" />
                                Chat
                              </Button>
                            </Link>
                          )} */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAsUnread(notification.id)}
                          >
                            <BookMarkedIcon className="h-4 w-4 mr-1" />
                            Mark as Unread
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
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

        {showMessageModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
              <h2 className="text-lg font-semibold mb-4">Message Consumer</h2>
              <textarea
                rows={4}
                className="w-full border rounded p-2"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              <div className="mt-4 flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowMessageModal(false);
                    setMessage("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-blue-600 text-white"
                  onClick={handleRequestMoreInfo}
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
