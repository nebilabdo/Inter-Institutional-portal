"use client";

import { useState, useEffect } from "react";
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

type IncomingRequest = {
  id: number;
  title: string;
  consumer: string;
  submittedDate: string;
  priority: string;
  status: string;
  description: string;
  requestedAttributes: string[];
  purpose: string;
  institutionName: string;
};

import { DashboardLayout } from "@/components/dashboard-layout";

export default function ProviderDashboard() {
  const router = useRouter();
  const [incomingRequests, setIncomingRequests] = useState<IncomingRequest[]>(
    []
  );
  const [totalRequests, setTotalRequests] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [activeAPIs, setActiveAPIs] = useState(0);
  const [totalConsumers, setTotalConsumers] = useState(0);

  useEffect(() => {
    const fetchIncomingRequests = async () => {
      try {
        // Fetch requests
        const res = await fetch("http://localhost:5000/api/requests", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch requests");
        const data = await res.json();
        setIncomingRequests(data);

        setTotalRequests(data.length);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncomingRequests();
  }, []);

  //   {
  //     id: 1,
  //     action: "Request Approved",
  //     details: "Healthcare Provider Directory approved for Ministry of Health",
  //     timestamp: "2 hours ago",
  //     type: "success",
  //   },
  //   {
  //     id: 2,
  //     action: "New Request",
  //     details:
  //       "Student Enrollment Data API requested by University of Technology",
  //     timestamp: "4 hours ago",
  //     type: "info",
  //   },
  //   {
  //     id: 3,
  //     action: "Request Rejected",
  //     details:
  //       "Sensitive Financial Data rejected due to insufficient security clearance",
  //     timestamp: "1 day ago",
  //     type: "warning",
  //   },
  // ]);

  // const stats = {
  //   totalRequests: incomingRequests.length,
  //   pendingRequests: incomingRequests.filter((r) => r.status === "pending")
  //     .length,
  //   approvedRequests: incomingRequests.filter((r) => r.status === "approved")
  //     .length,
  //   rejectedRequests: incomingRequests.filter((r) => r.status === "rejected")
  //     .length,
  //   activeAPIs: 0,
  //   totalConsumers: 0,
  // };

  useEffect(() => {
    const fetchStatsExtras = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/requests/stats");
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data = await res.json();

        setActiveAPIs(data.activeAPIs);
        setTotalConsumers(data.totalConsumers);
      } catch (error) {
        console.error("Error fetching active APIs and consumers:", error);
      }
    };

    fetchStatsExtras();
  }, []);

  const stats = {
    totalRequests: incomingRequests.length,
    pendingRequests: incomingRequests.filter((r) => r.status === "Submitted")
      .length,
    approvedRequests: incomingRequests.filter((r) => r.status === "approved")
      .length,
    rejectedRequests: incomingRequests.filter((r) => r.status === "rejected")
      .length,
    activeAPIs, // from state
    totalConsumers, // from state
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
  const [selectedRequest, setSelectedRequest] =
    useState<IncomingRequest | null>(null);

  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedDetails, setSelectedDetails] =
    useState<IncomingRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleRequestMoreInfo = async () => {
    if (!selectedRequest || !message) return;

    try {
      const token = localStorage.getItem("token"); // make sure your token is here

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
        alert("Info request sent successfully.");

        // Optional: refresh notifications or requests
        // fetchNotifications(); // if you have a function to reload notifications

        setMessage(""); // clear input
        setSelectedRequest(null);
        setShowMessageModal(false); // close modal
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send message.");
    }
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
          <TabsList className="grid w-full grid-cols-1 lg:w-[400px]">
            <TabsTrigger value="pending">Pending Requests</TabsTrigger>
            {/* <TabsTrigger value="activity">Recent Activity</TabsTrigger> */}
            {/* <TabsTrigger value="apis">My APIs</TabsTrigger> */}
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
                {/* <div className="space-y-6">
                  {incomingRequests
                    .filter((request) => request.status === "Submitted")
                    .map((request) => (
                      <div
                        key={request.id}
                        className="border rounded-xl p-6 hover:shadow-md transition-shadow bg-gradient-to-r from-gray-50 to-white"
                      > */}
                <div className="space-y-6">
                  {(incomingRequests || [])
                    .filter((request) => request.status === "Submitted")
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
                                <b style={{ color: "red" }}>Requested by:</b>{" "}
                                {request.institutionName}
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
                              {(request.requestedAttributes || []).map(
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
                          {showDetailsModal && selectedDetails && (
                            <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                              <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] max-h-[80vh] overflow-y-auto">
                                <h2 className="text-xl font-semibold mb-4">
                                  Request Details
                                </h2>
                                <p>
                                  <strong>Title:</strong>{" "}
                                  {selectedDetails.title}
                                </p>
                                <p>
                                  <strong>Description:</strong>{" "}
                                  {selectedDetails.description}
                                </p>
                                <p>
                                  <strong>Consumer:</strong>{" "}
                                  {selectedDetails.consumer}
                                </p>
                                <p>
                                  <strong>Purpose:</strong>{" "}
                                  {selectedDetails.purpose}
                                </p>
                                <p>
                                  <strong>Submitted:</strong>{" "}
                                  {selectedDetails.submittedDate}
                                </p>
                                <div className="mt-4 flex justify-end">
                                  <Button
                                    variant="outline"
                                    onClick={() => setShowDetailsModal(false)}
                                  >
                                    Close
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedDetails(request);
                              setShowDetailsModal(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>

                          {showMessageModal && selectedRequest && (
                            <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
                              <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
                                <h2 className="text-lg font-semibold mb-4">
                                  Message Consumer
                                </h2>
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
                                    onClick={() => setShowMessageModal(false)}
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

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowMessageModal(true);
                            }}
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Message Consumer
                          </Button>

                          {/* <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                            onClick={() => handleReject(request.id)}
                          >
                            <ThumbsDown className="h-4 w-4 mr-1" />
                            Reject
                          </Button> */}
                          {/* <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApprove(request.id)}
                          >
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            Approve
                          </Button> */}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
