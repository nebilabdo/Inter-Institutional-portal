"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Users,
  Database,
  Eye,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";

export default function ProviderDashboard() {
  const router = useRouter();

  const [incomingRequests, setIncomingRequests] = useState([
    {
      id: 1,
      title: "Student Enrollment Data API",
      consumer: "University of Technology",
      submittedDate: "2024-01-16",
      priority: "high",
      status: "pending",
      description:
        "Request for real-time student enrollment data across universities",
      requestedAttributes: [
        "student_id",
        "enrollment_date",
        "course_code",
        "status",
      ],
      purpose: "Academic research and institutional reporting",
    },
    {
      id: 2,
      title: "Financial Aid Information",
      consumer: "Community College Network",
      submittedDate: "2024-01-15",
      priority: "medium",
      status: "pending",
      description:
        "Student financial aid status and history for institutional reporting",
      requestedAttributes: [
        "student_id",
        "aid_amount",
        "aid_type",
        "disbursement_date",
      ],
      purpose: "Financial aid coordination and student support services",
    },
    {
      id: 3,
      title: "Academic Performance Metrics",
      consumer: "Research Institute",
      submittedDate: "2024-01-14",
      priority: "low",
      status: "pending",
      description: "Academic performance data for educational research",
      requestedAttributes: [
        "student_id",
        "gpa",
        "credits_completed",
        "graduation_status",
      ],
      purpose: "Educational outcomes research and policy development",
    },
  ]);

  const [recentActivity] = useState([
    {
      id: 1,
      action: "Request Approved",
      details: "Healthcare Provider Directory approved for Ministry of Health",
      timestamp: "2 hours ago",
      type: "success",
    },
    {
      id: 2,
      action: "New Request",
      details:
        "Student Enrollment Data API requested by University of Technology",
      timestamp: "4 hours ago",
      type: "info",
    },
    {
      id: 3,
      action: "Request Rejected",
      details:
        "Sensitive Financial Data rejected due to insufficient security clearance",
      timestamp: "1 day ago",
      type: "warning",
    },
  ]);

  const stats = {
    totalRequests: incomingRequests.length,
    pendingRequests: incomingRequests.filter((r) => r.status === "pending")
      .length,
    approvedRequests: incomingRequests.filter((r) => r.status === "approved")
      .length,
    rejectedRequests: incomingRequests.filter((r) => r.status === "rejected")
      .length,
    activeAPIs: 8,
    totalConsumers: 15,
  };

  const handleApprove = (requestId: number) => {
    setIncomingRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: "approved" } : req
      )
    );
  };

  const handleReject = (requestId: number) => {
    setIncomingRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: "rejected" } : req
      )
    );
  };

  return (
    <DashboardLayout userRole="provider">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Provider Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Manage incoming API requests and monitor data sharing activities
            </p>
          </div>

          {/* Consumer Dashboard Button */}
          <Button
            variant="outline"
            className="flex items-center transition-all duration-300 bg-gradient-to-r from-green-600 to-blue-600 text-white hover:shadow-xl hover:scale-[1.03] hover:from-green-700 hover:to-blue-700 hover:ring-2 hover:ring-white"
            onClick={() => router.push("/consumer/dashboard")}
          >
            <Users className="h-4 w-4 mr-2" />
            Consumer Dashboard
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">
                Total Requests
              </CardTitle>
              <FileText className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800">
                {stats.totalRequests}
              </div>
              <p className="text-xs text-blue-600 mt-1">All time</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-700">
                Pending Review
              </CardTitle>
              <Clock className="h-5 w-5 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-800">
                {stats.pendingRequests}
              </div>
              <p className="text-xs text-yellow-600 mt-1">Awaiting action</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">
                Approved
              </CardTitle>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800">
                {stats.approvedRequests}
              </div>
              <p className="text-xs text-green-600 mt-1">Active integrations</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700">
                Rejected
              </CardTitle>
              <XCircle className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-800">
                {stats.rejectedRequests}
              </div>
              <p className="text-xs text-red-600 mt-1">Declined</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">
                Active APIs
              </CardTitle>
              <Database className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-800">
                {stats.activeAPIs}
              </div>
              <p className="text-xs text-purple-600 mt-1">Published</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-indigo-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-indigo-700">
                Consumers
              </CardTitle>
              <Users className="h-5 w-5 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-800">
                {stats.totalConsumers}
              </div>
              <p className="text-xs text-indigo-600 mt-1">Connected</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="pending">Pending Requests</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="apis">My APIs</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  Pending API Requests
                </CardTitle>
                <CardDescription>
                  Review and respond to incoming data access requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {incomingRequests
                    .filter((request) => request.status === "pending")
                    .map((request) => (
                      <div
                        key={request.id}
                        className="border rounded-xl p-6 hover:shadow-md transition-shadow bg-gradient-to-r from-gray-50 to-white"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-3">
                              <h4 className="font-semibold text-lg">
                                {request.title}
                              </h4>
                            </div>
                            <p className="text-gray-600">
                              {request.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>
                                Requested by:{" "}
                                <strong>{request.consumer}</strong>
                              </span>
                              <span>•</span>
                              <span>Submitted: {request.submittedDate}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h5 className="font-medium text-sm text-gray-700 mb-2">
                              Purpose:
                            </h5>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                              {request.purpose}
                            </p>
                          </div>

                          <div>
                            <h5 className="font-medium text-sm text-gray-700 mb-2">
                              Requested Attributes:
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {request.requestedAttributes.map(
                                (attr, index) => (
                                  <code
                                    key={index}
                                    className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                                  >
                                    {attr}
                                  </code>
                                )
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end mt-6 gap-3">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Message Consumer
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                            onClick={() => handleReject(request.id)}
                          >
                            <ThumbsDown className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApprove(request.id)}
                          >
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Track recent actions and system events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          activity.type === "success"
                            ? "bg-green-500"
                            : activity.type === "warning"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                        }`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {activity.action}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {activity.details}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="apis" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-purple-600" />
                  Published APIs
                </CardTitle>
                <CardDescription>
                  Manage your published APIs and monitor usage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Database className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    API Management Coming Soon
                  </h3>
                  <p className="text-gray-500">
                    This section will allow you to manage your published APIs,
                    monitor usage, and configure access controls.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
