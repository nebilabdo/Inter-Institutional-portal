"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, FileText, Clock } from "lucide-react";

// type Request = {
//   id: number;
//   institutionId: string;
//   institutionName: string;
//   services: string[][];
//   title: string;
//   description: string;
//   status: string;
//   createdAt: string;
//   updatedAt: string;
//   user_id: number;
//   date: string;
//   lastUpdated: string;
// };
type MyRequest = {
  id: number;
  institutionId: string;
  institutionName: string;
  services: string[];
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  user_id: number;
  decisionDate: string | null;
  reason: string | null;
};

type HistoryItem = {
  id: number;
  title: string;
  consumer: string;
  submittedDate: string;
  decisionDate: string;
  status: "approved" | "rejected";
  reason?: string;
};

export default function IncomingRequestsPage() {
  const [requests, setRequests] = useState<MyRequest[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadRequests = async () => {
      setIsLoading(true);
      try {
        // Fetch requests
        const res = await fetch("http://localhost:5000/api/requests", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load requests");

        const data: MyRequest[] = await res.json();
        setRequests(data);

        // Fetch history
        const historyResponse = await fetch(
          "http://localhost:5000/api/requests/history",
          { credentials: "include" }
        );
        if (!historyResponse.ok) throw new Error("Failed to fetch history");
        const historyData: HistoryItem[] = await historyResponse.json();

        console.log("History data received:", historyData);
        setHistory(historyData);
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRequests();
  }, []);

  // const [history, setHistory] = useState<HistoryItem[]>([
  //   {
  //     id: 101,
  //     title: "Healthcare Provider Directory",
  //     consumer: "Ministry of Health",
  //     submittedDate: "2023-12-10",
  //     decisionDate: "2023-12-15",
  //     status: "approved",
  //   },
  //   {
  //     id: 102,
  //     title: "Sensitive Financial Data",
  //     consumer: "National Bank",
  //     submittedDate: "2023-11-28",
  //     decisionDate: "2023-12-05",
  //     status: "rejected",
  //     reason: "Insufficient security clearance",
  //   },
  //   {
  //     id: 103,
  //     title: "Faculty Publications",
  //     consumer: "Research Consortium",
  //     submittedDate: "2023-11-15",
  //     decisionDate: "2023-11-20",
  //     status: "approved",
  //   },
  // ])

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "—"; // fallback for null/undefined
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "Invalid Date"
      : date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
  };

  const handleApprove = async (requestId: number) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/requests/${requestId}/approve`,
        {
          method: "POST",
        }
      );

      if (!response.ok) throw new Error("Failed to approve request");

      const request = requests.find((r) => r.id === requestId);
      if (!request) return;

      setRequests(requests.filter((r) => r.id !== requestId));
      setHistory([
        {
          id: requestId,
          title: request.title,
          consumer: request.institutionName,
          submittedDate: request.createdAt,
          status: "approved",
          decisionDate: new Date().toISOString().split("T")[0],
        },
        ...history,
      ]);
    } catch (error) {
      console.error(error);
      alert("Error approving request.");
    }
  };

  const handleReject = async (requestId: number) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/requests/${requestId}/reject`,
        {
          method: "POST",
        }
      );

      if (!response.ok) throw new Error("Failed to reject request");

      const request = requests.find((r) => r.id === requestId);
      if (!request) return;

      setRequests(requests.filter((r) => r.id !== requestId));
      setHistory([
        {
          id: requestId,
          title: request.title,
          consumer: request.institutionName,
          submittedDate: request.createdAt,
          status: "rejected",
          decisionDate: new Date().toISOString().split("T")[0],
          reason: "Manually rejected by provider",
        },
        ...history,
      ]);
    } catch (error) {
      console.error(error);
      alert("Error rejecting request.");
    }
  };

  const [moreInfoRequestId, setMoreInfoRequestId] = useState<number | null>(
    null
  );
  const [infoMessage, setInfoMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleMoreInfo = (requestId: number) => {
    setMoreInfoRequestId(requestId);
    setShowModal(true);
  };
  const sendMoreInfoRequest = async () => {
    if (!moreInfoRequestId || !infoMessage.trim()) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/requests/${moreInfoRequestId}/request-more-info`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: infoMessage }),
        }
      );

      if (!response.ok) throw new Error("Failed to send info request");

      alert("Info request sent successfully.");
      setShowModal(false);
      setInfoMessage("");
    } catch (error) {
      console.error(error);
      alert("Error sending info request.");
    }
  };

  return (
    <DashboardLayout userRole="provider">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
            Incoming Requests
          </h1>
          <p className="text-gray-600 mt-2">
            Review and respond to data access requests
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Pending
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          {/* Pending */}
          <TabsContent value="pending">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Pending Requests ({requests.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {requests.length > 0 ? (
                    requests.map((request) => (
                      <div
                        key={request.id}
                        className="border rounded-xl p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold text-lg">
                                {request.title}
                              </h3>
                            </div>
                            <p className="text-gray-600">
                              {request.description || "No description"}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-black font-semibold">
                              <span>
                                Requested by: {request.institutionName}
                              </span>
                              <span>
                                Submitted: {formatDate(request.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4 mb-6">
                          <div>
                            <h4 className="font-medium text-sm text-gray-700 mb-2">
                              Purpose:
                            </h4>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                              {request.purpose ?? "No purpose provided"}
                            </p>
                          </div>

                          <div>
                            <h4 className="font-medium text-sm text-gray-700 mb-2">
                              Requested Attributes:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {request.requestedAttributes &&
                              request.requestedAttributes.length > 0 ? (
                                request.requestedAttributes.map(
                                  (attr: string, index: number) => (
                                    <Badge
                                      key={index}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {attr}
                                    </Badge>
                                  )
                                )
                              ) : (
                                <p className="text-gray-500 text-xs">
                                  No requested attributes
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap justify-end gap-3">
                          <Button
                            variant="outline"
                            onClick={() => handleMoreInfo(request.id)}
                          >
                            Request More Info
                          </Button>

                          <Button
                            variant="destructive"
                            onClick={() => handleReject(request.id)}
                          >
                            Reject
                          </Button>
                          <Button
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleApprove(request.id)}
                          >
                            Approve
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600">
                        No pending requests
                      </h3>
                      <p className="text-gray-500">
                        All current requests have been processed
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History */}
          <TabsContent value="history">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Request History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left font-semibold text-gray-500 uppercase tracking-wider">
                          Request
                        </th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-500 uppercase tracking-wider">
                          Consumer
                        </th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-500 uppercase tracking-wider">
                          Submitted
                        </th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-500 uppercase tracking-wider">
                          Decision
                        </th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {history.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                            {item.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            {item.consumer}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            {formatDate(item.submittedDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            {formatDate(item.decisionDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge
                              className={`capitalize text-white px-3 py-1 rounded ${
                                item.status === "approved"
                                  ? "bg-green-600"
                                  : item.status === "rejected"
                                  ? "bg-red-600"
                                  : "bg-gray-400"
                              }`}
                            >
                              {item.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal for More Info Request */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg space-y-4 shadow-lg">
              <h2 className="text-xl font-semibold">
                Request More Information
              </h2>
              <textarea
                className="w-full border rounded p-2"
                rows={5}
                placeholder="Type your message here..."
                value={infoMessage}
                onChange={(e) => setInfoMessage(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-200 rounded"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                  onClick={sendMoreInfoRequest}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
