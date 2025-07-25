"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  Building2,
  FileText,
  Users,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import NotificationsList, {
  Notification,
} from "../notifications/NotificationsList";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("activeTab") || "institutions";
    }
    return "institutions";
  });
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (activeTab) {
      localStorage.setItem("activeTab", activeTab);
    }
  }, [activeTab]);
  const notifications: Notification[] = [
    {
      id: 1,
      type: "error",
      title: "Data Request Failed",
      message: "Request REQ-2024-004 failed due to invalid documentation",
      details:
        "The request from LendingTree Bank for identity verification failed because 8 out of 23 applications had invalid or insufficient documentation. The provider IdentityVerify Ltd requires updated documents to proceed.",
      time: "2 minutes ago",
      read: false,
    },
    {
      id: 2,
      type: "warning",
      title: "Request Processing Delay",
      message: "Request REQ-2024-002 is taking longer than expected",
      details:
        "The credit score verification request from FinancePlus is experiencing delays. CreditScore Inc is processing 45 loan applications and expects completion within 2 hours.",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      type: "success",
      title: "New Institution Approved",
      message: "FinTech Solutions Ltd has been approved and activated",
      details:
        "FinTech Solutions Ltd (REG-2024-009) has completed all verification requirements and has been approved for both consumer and producer roles. Contact person: Alice Johnson (alice.johnson@fintech.com).",
      time: "3 hours ago",
      read: true,
    },
    {
      id: 4,
      type: "info",
      title: "Monthly Report Generated",
      message: "December 2024 system report is now available",
      details:
        "The monthly system report for December 2024 has been generated and is available for download. The report includes 156 processed requests, 24 active institutions, and system performance metrics.",
      time: "1 day ago",
      read: true,
    },
  ];
  const stats = [
    {
      title: "Registered Institutions",
      value: "24",
      change: "+3 this Month",
      icon: Building2,
      color: "bg-blue-50 hover:bg-blue-100",
      iconColor: "text-blue-500",
      textColor: "text-blue-600",
    },
    {
      title: "Active API Requests",
      value: "156",
      change: "+12 this Month",
      icon: FileText,
      color: "bg-yellow-50 hover:bg-yellow-100",
      iconColor: "text-yellow-600",
      textColor: "text-yellow-700",
    },
    {
      title: "Pending Approvals",
      value: "8",
      change: "2 Urgent",
      icon: Clock,
      color: "bg-green-50 hover:bg-green-100",
      iconColor: "text-green-500",
      textColor: "text-green-600",
    },
    {
      title: "Total Users",
      value: "342",
      change: "+18 this Month",
      icon: Users,
      color: "bg-purple-50 hover:bg-purple-100",
      iconColor: "text-purple-500",
      textColor: "text-purple-600",
    },
  ];

  // Add recent activities array
  const recentActivities = [
    {
      type: "registration",
      title: "New institution registered",
      time: "2 min ago",
      details: {
        institution: "FinTech Solutions Ltd",
        registrationId: "REG-2024-009",
        contactPerson: "Alice Johnson",
        email: "alice.johnson@fintech.com",
        type: "Financial Technology",
        status: "Pending Approval",
        submittedDocuments: [
          "Business License",
          "Tax Certificate",
          "Compliance Report",
        ],
        nextSteps: "Awaiting document verification and compliance review",
      },
    },
    {
      type: "request",
      title: "Data request completed",
      time: "5 min ago",
      details: {
        requestId: "REQ-2024-006",
        consumer: "TechCorp Ltd",
        provider: "DataBank Solutions",
        dataType: "Customer Credit Scores",
        recordsProcessed: 1247,
        processingTime: "3 minutes 45 seconds",
        dataSize: "1.8 MB",
        status: "Successfully Completed",
        focalPerson: "John Smith",
      },
    },
    {
      type: "failure",
      title: "Request failed",
      time: "15 min ago",
      details: {
        requestId: "REQ-2024-007",
        consumer: "FinancePlus",
        provider: "RiskAssess Corp",
        dataType: "Risk Assessment for Mortgage Applications",
        failureReason: "Insufficient data provided",
        missingItems: ["Customer consent forms", "Income verification"],
        status: "Failed",
        focalPerson: "Sarah Johnson",
        nextSteps: "Consumer needs to resubmit with required documentation",
      },
    },
    {
      type: "user",
      title: "Admin user logged in",
      time: "1 hour ago",
      details: {
        userId: "admin@system.com",
        userName: "System Administrator",
        loginTime: "2024-01-15 15:30:00",
        ipAddress: "192.168.1.100",
        userAgent: "Chrome 120.0.0.0 on Windows 10",
        sessionDuration: "Active (45 minutes)",
        actionsPerformed: [
          "Viewed dashboard",
          "Checked notifications",
          "Reviewed requests",
        ],
        lastActivity: "Viewing system activity",
      },
    },
  ];

  return (
    <main className="px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <Badge
            variant="secondary"
            className="bg-red-100 text-red-800 hover:bg-red-200"
          >
            Administrator
          </Badge>
        </div>
        <p className="text-gray-600">
          Monitor and manage system operations, user activities, and
          institutional data
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="bg-white border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <CardContent className="p-4">
              <div className={`${stat.color} rounded-lg p-4 relative`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                  </div>
                  <div
                    className={`p-2 rounded-lg ${
                      stat.color.split(" ")[0]
                    } ml-2`}
                  >
                    <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className={`text-sm ${stat.textColor}`}>{stat.change}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
          <TabsTrigger
            value="institutions"
            className="flex items-center space-x-2"
          >
            <Building2 className="w-4 h-4" />
            <span>Institutions</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>System Activity</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center space-x-2"
          >
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
            <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
              {notifications.filter((n) => !n.read).length}
            </span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="institutions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="w-5 h-5" />
                <span>Institution Management</span>
              </CardTitle>
              <CardDescription>
                Manage and monitor registered institutions in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="font-semibold text-blue-900">
                        Active Institutions
                      </p>
                      <p className="text-2xl font-bold text-blue-700">22</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-8 h-8 text-amber-600" />
                    <div>
                      <p className="font-semibold text-amber-900">
                        Pending Approval
                      </p>
                      <p className="text-2xl font-bold text-amber-700">2</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                    <div>
                      <p className="font-semibold text-red-900">Suspended</p>
                      <p className="text-2xl font-bold text-red-700">0</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>System Activity Monitor</span>
              </CardTitle>
              <CardDescription>
                Real-time system performance and user activity tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">
                    Recent Activities
                  </h4>
                  <div className="space-y-3">
                    {recentActivities.map((activity, i) => (
                      <div
                        key={i}
                        className={`flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors`}
                        onClick={() => setSelectedActivity(activity)}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            activity.type === "registration"
                              ? "bg-green-500"
                              : activity.type === "request"
                              ? "bg-blue-500"
                              : activity.type === "failure"
                              ? "bg-red-500"
                              : "bg-purple-500"
                          }`}
                        ></div>
                        <span className="text-sm">{activity.title}</span>
                        <span className="text-xs text-gray-500 ml-auto">
                          {activity.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">
                    Activity Details
                  </h4>
                  {selectedActivity ? (
                    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            selectedActivity.type === "registration"
                              ? "bg-green-500"
                              : selectedActivity.type === "request"
                              ? "bg-blue-500"
                              : selectedActivity.type === "failure"
                              ? "bg-red-500"
                              : "bg-purple-500"
                          }`}
                        ></div>
                        <h5 className="font-semibold text-gray-900">
                          {selectedActivity.title}
                        </h5>
                        <span className="text-xs text-gray-500 ml-auto">
                          {selectedActivity.time}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {Object.entries(selectedActivity.details).map(
                          ([key, value]) => (
                            <div
                              key={key}
                              className="flex justify-between items-start"
                            >
                              <span className="text-sm font-medium text-gray-600 capitalize">
                                {key
                                  .replace(/([A-Z])/g, " $1")
                                  .replace(/^./, (str) => str.toUpperCase())}
                                :
                              </span>
                              <span className="text-sm text-gray-900 text-right max-w-xs">
                                {Array.isArray(value)
                                  ? value.join(", ")
                                  : String(value)}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-8 rounded-lg text-center">
                      <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">
                        Click on any activity to view detailed information
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-6">
          <div className="bg-white rounded-2xl shadow p-6 border flex flex-col gap-4">
            <div className="mb-2">
              <div className="flex items-center gap-2 mb-1">
                <Bell className="w-7 h-7 text-black" />
                <span className="font-bold text-2xl text-gray-900">
                  System Notifications
                </span>
              </div>
              <p className="text-gray-600 text-base">
                Important alerts and system notifications requiring attention
              </p>
            </div>
            {notifications.map((n) => (
              <div
                key={n.id}
                className={
                  n.type === "error"
                    ? "bg-red-50 border border-red-200 rounded-lg p-5"
                    : n.type === "warning"
                    ? "bg-yellow-50 border border-yellow-200 rounded-lg p-5"
                    : n.type === "success"
                    ? "bg-green-50 border border-green-200 rounded-lg p-5"
                    : n.type === "info"
                    ? "bg-blue-50 border border-blue-200 rounded-lg p-5"
                    : "bg-gray-50 border border-gray-200 rounded-lg p-5"
                }
              >
                <div className="flex items-center gap-3 mb-1">
                  {n.type === "error" ? (
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  ) : n.type === "warning" ? (
                    <Clock className="w-6 h-6 text-yellow-600" />
                  ) : n.type === "success" ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : n.type === "info" ? (
                    <FileText className="w-6 h-6 text-blue-600" />
                  ) : null}
                  <span
                    className={
                      n.type === "error"
                        ? "font-bold text-lg text-red-700"
                        : n.type === "warning"
                        ? "font-bold text-lg text-yellow-800"
                        : n.type === "success"
                        ? "font-bold text-lg text-green-700"
                        : n.type === "info"
                        ? "font-bold text-lg text-blue-700"
                        : "font-bold text-lg text-gray-900"
                    }
                  >
                    {n.title}
                  </span>
                </div>
                <div
                  className={
                    n.type === "error"
                      ? "text-red-700 text-base"
                      : n.type === "warning"
                      ? "text-yellow-900 text-base"
                      : n.type === "success"
                      ? "text-green-900 text-base"
                      : n.type === "info"
                      ? "text-blue-900 text-base"
                      : "text-gray-700 text-base"
                  }
                >
                  {n.message}
                </div>
                <div className="text-xs mt-2 text-gray-500">{n.time}</div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
