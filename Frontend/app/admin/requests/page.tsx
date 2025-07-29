"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  FileText,
  Clock,
  CheckCircle,
  X,
  AlertTriangle,
  Activity,
  User,
  Eye,
  RefreshCw,
  Settings,
  Bell,
} from "lucide-react";
import { MessageSquare, Pause, Play } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function RequestsPage() {
  const [openRequestDialog, setOpenRequestDialog] = useState<
    null | "view" | "details" | "logs" | "report" | "conversation"
  >(null);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [currentRequestsPage, setCurrentRequestsPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [conversationStatus, setConversationStatus] = useState<{
    [key: string]: boolean;
  }>({});
  const [adminNotes, setAdminNotes] = useState<{ [key: string]: string }>({});
  const [noteDraft, setNoteDraft] = useState("");
  const { toast } = useToast ? useToast() : { toast: () => {} };

  useEffect(() => {
    setCurrentRequestsPage(1);
  }, [searchQuery, statusFilter]);

  // When opening the conversation dialog, prefill noteDraft
  useEffect(() => {
    if (openRequestDialog === "conversation" && selectedRequest) {
      setNoteDraft(adminNotes[selectedRequest.id] || "");
    }
  }, [openRequestDialog, selectedRequest]);

  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    async function fetchRequests() {
      try {
        const res = await fetch("http://localhost:5000/api/requests");
        if (!res.ok) throw new Error("Failed to fetch requests");
        const data = await res.json();
        setRequests(data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }
    fetchRequests();
  }, []);

  const [notifications, setNotifications] = useState<any[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoadingNotifications(true);
      setError(null);
      try {
        const response = await fetch(
          "http://localhost:5000/api/requests/:requestId/notifications"
        ); // your API endpoint here
        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }
        const data = await response.json();
        setNotifications(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchNotifications();
  }, []);
  const getStatusBadge = (status: any) => {
    switch (status) {
      case "Completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            Completed
          </Badge>
        );
      case "In Progress":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            In Progress
          </Badge>
        );
      case "Failed":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            Failed
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
            {status}
          </Badge>
        );
    }
  };

  // Remove priority from request stats cards
  const getRequestStats = () => {
    const totalRequests = requests.length;
    const pending = requests.filter((r) => r.status === "Pending").length;
    const approved = requests.filter((r) => r.status === "Approved").length;
    const rejected = requests.filter((r) => r.status === "Rejected").length;
    const completed = requests.filter((r) => r.status === "Completed").length;
    return { totalRequests, pending, approved, rejected, completed };
  };

  // Add handler for request actions
  const handleRequestAction = async (action: string, request: any) => {
    setSelectedRequest(request);
    if (action === "details") {
      // fetch additional details from backend if needed
      try {
        const res = await fetch(
          `http://localhost:5000/api/requests${request.id}`
        );
        if (!res.ok) throw new Error("Failed to load details");
        const details = await res.json();
        setSelectedRequest(details);
      } catch (error) {
        toast({
          title: "Error loading details",
          description: (error as Error).message,
          variant: "destructive",
        });
        return;
      }
    }
    setOpenRequestDialog(
      action as "view" | "details" | "logs" | "report" | "conversation"
    );
  };

  // Conversation control handlers
  const handleStopConversation = async (requestId: string) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/requests/${requestId}/stop-conversation`,
        {
          method: "POST",
        }
      );
      if (!res.ok) throw new Error("Failed to stop conversation");

      setConversationStatus((prev) => ({ ...prev, [requestId]: false }));
      toast({
        title: `Conversation stopped for request ${requestId}`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleResumeConversation = async (requestId: string) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/requests/${requestId}/resume-conversation`,
        {
          method: "POST",
        }
      );
      if (!res.ok) throw new Error("Failed to resume conversation");

      setConversationStatus((prev) => ({ ...prev, [requestId]: true }));
      toast({
        title: `Conversation resumed for request ${requestId}`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const isConversationActive = (request: any) => {
    return conversationStatus[request.id] !== undefined
      ? conversationStatus[request.id]
      : request.conversationActive;
  };

  // Export Data handler
  const handleExportData = () => {
    const escapeCSV = (text: string) => {
      if (typeof text !== "string") return text;
      return `"${text.replace(/"/g, '""')}"`;
    };

    const headers = [
      "Request ID",
      "Consumer Institution",
      "Focal Person",
      "Focal Person Email",
      "Provider Institution",
      "Status",
      "Priority",
      "What is Asked",
      "Response",
      "Request Time",
      "Response Time",
      "Data Size",
      "Request Message",
      "Response Message",
    ];

    let csvContent = headers.join(",") + "\n";

    const filteredRequests = requests.filter((request) => {
      const matchesSearch =
        request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.consumerInstitution
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        request.focalPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.providerInstitution
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesStatus =
        !statusFilter ||
        request.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });

    filteredRequests.forEach((request) => {
      const row = [
        request.id,
        escapeCSV(request.consumerInstitution),
        escapeCSV(request.focalPerson),
        escapeCSV(request.focalPersonEmail),
        escapeCSV(request.providerInstitution),
        request.status,
        request.priority,
        escapeCSV(request.whatIsAsked),
        escapeCSV(request.response),
        request.requestTime,
        request.responseTime,
        request.dataSize,
        escapeCSV(request.requestMessage),
        escapeCSV(request.responseMessage),
      ];
      csvContent += row.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "requests_data.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("http://localhost:5000/api/requests");
      const data = await res.json();
      setRequests(data);
    } catch (error) {
      console.error("Failed to refresh data:", error);
      toast({
        title: "Error",
        description: "Failed to load latest data.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Pagination logic
  const pageSize = 5;
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.consumerInstitution
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      request.focalPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.providerInstitution
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesStatus =
      !statusFilter || request.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const totalPages = Math.ceil(filteredRequests.length / pageSize);
  const paginatedRequests = filteredRequests.slice(
    (currentRequestsPage - 1) * pageSize,
    currentRequestsPage * pageSize
  );

  // Helper to get page numbers to show (max 5)
  function getPageNumbers() {
    const pages = [];
    let start = Math.max(1, currentRequestsPage - 2);
    let end = Math.min(totalPages, start + 4);
    if (end - start < 4) start = Math.max(1, end - 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  return (
    <div className="px-6 py-8 font-[Poppins]">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900 font-[Poppins]">
            Manage Requests
          </h1>
          <Badge
            variant="secondary"
            className="bg-red-100 text-red-800 hover:bg-red-200"
          >
            Administrator
          </Badge>
        </div>
        <p className="text-gray-600 font-[Poppins]">
          Monitor and manage all data exchange requests between institutions
        </p>
      </div>
      {/* Request Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
        {(() => {
          const stats = getRequestStats();
          return [
            {
              title: "Total Requests",
              value: stats.totalRequests,
              icon: FileText,
              color: "bg-blue-50 hover:bg-blue-100",
              iconColor: "text-blue-500",
              textColor: "text-blue-600",
            },
            {
              title: "Pending",
              value: stats.pending,
              icon: Clock,
              color: "bg-yellow-50 hover:bg-yellow-100",
              iconColor: "text-yellow-500",
              textColor: "text-yellow-600",
            },
            {
              title: "Approved",
              value: stats.approved,
              icon: CheckCircle,
              color: "bg-green-50 hover:bg-green-100",
              iconColor: "text-green-500",
              textColor: "text-green-600",
            },
            {
              title: "Rejected",
              value: stats.rejected,
              icon: X,
              color: "bg-red-50 hover:bg-red-100",
              iconColor: "text-red-500",
              textColor: "text-red-600",
            },
            {
              title: "Completed",
              value: stats.completed,
              icon: CheckCircle,
              color: "bg-purple-50 hover:bg-purple-100",
              iconColor: "text-purple-500",
              textColor: "text-purple-600",
            },
          ].map((stat, index) => (
            <Card
              key={index}
              className="bg-white border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 rounded-2xl"
            >
              <CardContent className="p-4">
                <div
                  className={`${stat.color} rounded-lg p-4 relative flex flex-col items-start justify-between min-h-[120px]`}
                >
                  <div className="flex justify-between items-start w-full mb-2">
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
                    <p className={`text-sm ${stat.textColor}`}>Current</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ));
        })()}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Data Exchange Requests</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </Button>
              <Button size="sm" onClick={handleExportData}>
                Export Data
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Monitor all data exchange requests between institutions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filter and Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by request ID, institution, or focal person..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
                <option value="in progress">In Progress</option>
              </select>
            </div>
          </div>
          {/* Requests Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse font-[Poppins]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left p-3 font-semibold text-gray-900">
                    Request ID
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-900">
                    Consumer Institution
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-900">
                    Focal Person
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-900">
                    Provider Institution
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-900">
                    What is Asked
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-900">
                    Response
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-900">
                    Conversation Status
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedRequests.map((request, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="p-3">
                      <span className="font-semibold text-gray-900">
                        {request.id}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="text-gray-600">
                        {request.consumerInstitution}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {request.focalPerson}
                          </div>
                          <div className="text-sm text-gray-500">
                            {request.focalPersonEmail}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="text-gray-600">
                        {request.providerInstitution}
                      </span>
                    </td>
                    <td className="p-3">{getStatusBadge(request.status)}</td>
                    <td className="p-3">
                      <span className="text-gray-700">
                        {request.whatIsAsked}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="text-gray-700">{request.response}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            isConversationActive(request)
                              ? "bg-green-500"
                              : "bg-gray-400"
                          }`}
                        ></div>
                        <span
                          className={`text-sm ${
                            isConversationActive(request)
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          {isConversationActive(request) ? "Active" : "Stopped"}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          onClick={() => handleRequestAction("view", request)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 px-2 bg-transparent"
                            >
                              <Settings className="w-3 h-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                handleRequestAction("details", request)
                              }
                            >
                              <User className="mr-2 h-4 w-4" />
                              <span>View Details</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleRequestAction("logs", request)
                              }
                            >
                              <Activity className="mr-2 h-4 w-4" />
                              <span>View Logs</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleRequestAction("conversation", request)
                              }
                            >
                              <MessageSquare className="mr-2 h-4 w-4" />
                              <span>Conversation Control</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {isConversationActive(request) ? (
                              <DropdownMenuItem
                                className="text-orange-600"
                                onClick={() =>
                                  handleStopConversation(request.id)
                                }
                              >
                                <Pause className="mr-2 h-4 w-4" />
                                <span>Stop Conversation</span>
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                className="text-green-600"
                                onClick={() =>
                                  handleResumeConversation(request.id)
                                }
                              >
                                <Play className="mr-2 h-4 w-4" />
                                <span>Resume Conversation</span>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() =>
                                handleRequestAction("report", request)
                              }
                            >
                              <AlertTriangle className="mr-2 h-4 w-4" />
                              <span>Report Issue</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex flex-col items-end justify-end mt-8 gap-2">
            <div className="flex items-center gap-2">
              <button
                className={`px-4 py-2 rounded-lg border font-medium ${
                  currentRequestsPage === 1
                    ? "text-gray-400 border-gray-200 bg-white cursor-not-allowed"
                    : "text-black border-gray-300 bg-white hover:bg-gray-100"
                }`}
                disabled={currentRequestsPage === 1}
                onClick={() => setCurrentRequestsPage(currentRequestsPage - 1)}
              >
                Previous
              </button>
              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  className={`px-4 py-2 rounded-lg border font-medium ${
                    currentRequestsPage === page
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-gray-300 hover:bg-gray-100"
                  }`}
                  onClick={() => setCurrentRequestsPage(page)}
                  disabled={currentRequestsPage === page}
                >
                  {page}
                </button>
              ))}
              <button
                className={`px-4 py-2 rounded-lg border font-medium ${
                  currentRequestsPage === totalPages || totalPages === 0
                    ? "text-gray-400 border-gray-200 bg-white cursor-not-allowed"
                    : "text-black border-gray-300 bg-white hover:bg-gray-100"
                }`}
                disabled={
                  currentRequestsPage === totalPages || totalPages === 0
                }
                onClick={() => setCurrentRequestsPage(currentRequestsPage + 1)}
              >
                Next
              </button>
            </div>
            <div className="text-sm text-gray-500">
              Showing {(currentRequestsPage - 1) * pageSize + 1}-
              {Math.min(
                currentRequestsPage * pageSize,
                filteredRequests.length
              )}{" "}
              of {filteredRequests.length} requests
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Dialogs for request details, logs, and report */}
      {openRequestDialog === "view" && selectedRequest && (
        <Dialog open={true} onOpenChange={() => setOpenRequestDialog(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Request Details - {selectedRequest.id}</DialogTitle>
              <DialogDescription>
                Complete information for request {selectedRequest.id}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <h3 className="font-bold text-lg mb-2">Basic Information</h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div>
                    <span className="font-medium text-gray-500">
                      Request ID:
                    </span>{" "}
                    <span className="text-blue-600 font-mono">
                      {selectedRequest.id}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Consumer:</span>{" "}
                    {selectedRequest.consumerInstitution}
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Provider:</span>{" "}
                    {selectedRequest.providerInstitution}
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Status:</span>{" "}
                    {selectedRequest.status}
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Priority:</span>{" "}
                    {selectedRequest.priority}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Focal Person</h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div>
                    <span className="font-medium text-gray-500">Name:</span>{" "}
                    {selectedRequest.focalPerson}
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Email:</span>{" "}
                    {selectedRequest.focalPersonEmail}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="font-bold text-lg mb-2">Request Details</h3>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div>
                  <span className="font-medium text-gray-500">
                    What is Asked:
                  </span>{" "}
                  {selectedRequest.whatIsAsked}
                </div>
                <div>
                  <span className="font-medium text-gray-500">Response:</span>{" "}
                  {selectedRequest.response}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      {openRequestDialog === "details" && selectedRequest && (
        <Dialog open={true} onOpenChange={() => setOpenRequestDialog(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                Request Technical Details - {selectedRequest.id}
              </DialogTitle>
              <DialogDescription>
                Technical and metadata for request {selectedRequest.id}
              </DialogDescription>
            </DialogHeader>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 mt-4">
              <div>
                <span className="font-medium text-gray-500">Request Time:</span>{" "}
                {selectedRequest.requestTime}
              </div>
              <div>
                <span className="font-medium text-gray-500">
                  Response Time:
                </span>{" "}
                {selectedRequest.responseTime}
              </div>
              <div>
                <span className="font-medium text-gray-500">Data Size:</span>{" "}
                {selectedRequest.dataSize}
              </div>
              <div>
                <span className="font-medium text-gray-500">
                  Request Message:
                </span>{" "}
                {selectedRequest.requestMessage}
              </div>
              <div>
                <span className="font-medium text-gray-500">
                  Response Message:
                </span>{" "}
                {selectedRequest.responseMessage}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      {openRequestDialog === "logs" && selectedRequest && (
        <Dialog open={true} onOpenChange={() => setOpenRequestDialog(null)}>
          <DialogContent className="w-full sm:max-w-lg md:max-w-2xl px-2 sm:px-4">
            <DialogHeader>
              <DialogTitle>Request Logs - {selectedRequest.id}</DialogTitle>
              <DialogDescription>
                Logs and history for request {selectedRequest.id}
              </DialogDescription>
            </DialogHeader>
            {/* Chat-like log history with avatars */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-4 mt-4 max-h-96 overflow-y-auto flex flex-col">
              {/* Mock chat history */}
              {[
                {
                  sender: "Consumer",
                  message: "Hello, we need the latest transaction data.",
                },
                {
                  sender: "Provider",
                  message: "Received. We are preparing the data.",
                },
                {
                  sender: "Consumer",
                  message: "Thank you! Please notify us when ready.",
                },
                {
                  sender: "Provider",
                  message: "Data is ready. Please find the attached file.",
                },
                {
                  sender: "Consumer",
                  message: "File received. Thanks for your quick response.",
                },
                {
                  sender: "Provider",
                  message:
                    "You are welcome. Let us know if you need anything else.",
                },
              ].map((chat, idx) => {
                const isConsumer = chat.sender === "Consumer";
                const avatarBg = isConsumer ? "bg-blue-500" : "bg-green-500";
                const avatarLetter = isConsumer ? "C" : "P";
                return (
                  <div
                    key={idx}
                    className={`flex ${
                      isConsumer ? "justify-start" : "justify-end"
                    } items-end`}
                  >
                    {isConsumer && (
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-bold text-base mr-2 ${avatarBg}`}
                      >
                        {avatarLetter}
                      </div>
                    )}
                    <div
                      className={`rounded-lg px-4 py-2 max-w-xs ${
                        isConsumer
                          ? "bg-blue-100 text-blue-900"
                          : "bg-green-100 text-green-900"
                      }`}
                    >
                      <div className="text-xs font-semibold mb-1">
                        {chat.sender}
                      </div>
                      <div>{chat.message}</div>
                    </div>
                    {!isConsumer && (
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-bold text-base ml-2 ${avatarBg}`}
                      >
                        {avatarLetter}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
      )}
      {openRequestDialog === "report" && selectedRequest && (
        <Dialog open={true} onOpenChange={() => setOpenRequestDialog(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Report Issue - {selectedRequest.id}</DialogTitle>
              <DialogDescription>
                Report an issue for this request.
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4 mt-4">
              <div>
                <label className="block text-gray-700 font-medium">
                  Issue Description
                </label>
                <textarea
                  className="w-full border rounded px-3 py-2"
                  rows={4}
                  placeholder="Describe the issue..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpenRequestDialog(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="destructive">
                  Submit
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
      {openRequestDialog === "conversation" && selectedRequest && (
        <Dialog open={true} onOpenChange={() => setOpenRequestDialog(null)}>
          <DialogContent className="max-w-2xl w-full p-2 sm:p-6 max-h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>
                Conversation Control - {selectedRequest.id}
              </DialogTitle>
              <DialogDescription>
                Control the conversation between{" "}
                {selectedRequest.consumerInstitution} and{" "}
                {selectedRequest.providerInstitution}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 mt-4 overflow-y-auto flex-1 pr-1">
              {/* Current Status */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-lg mb-3">Current Status</h3>
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      isConversationActive(selectedRequest)
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}
                  ></div>
                  <span
                    className={`font-medium ${
                      isConversationActive(selectedRequest)
                        ? "text-green-600"
                        : "text-gray-600"
                    }`}
                  >
                    Conversation is{" "}
                    {isConversationActive(selectedRequest)
                      ? "Active"
                      : "Stopped"}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {isConversationActive(selectedRequest)
                    ? "Both institutions can currently communicate and exchange data."
                    : "Communication between institutions is currently paused."}
                </p>
              </div>

              {/* Control Actions */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-lg mb-3">Control Actions</h3>
                <div className="space-y-3">
                  {isConversationActive(selectedRequest) ? (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200 gap-3">
                      <div>
                        <h4 className="font-medium text-orange-800">
                          Stop Conversation
                        </h4>
                        <p className="text-sm text-orange-600">
                          Pause communication between institutions
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="border-orange-300 text-orange-700 hover:bg-orange-100 w-full sm:w-auto"
                        onClick={() => {
                          handleStopConversation(selectedRequest.id);
                          setOpenRequestDialog(null);
                        }}
                      >
                        <Pause className="w-4 h-4 mr-2" />
                        Stop
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200 gap-3">
                      <div>
                        <h4 className="font-medium text-green-800">
                          Resume Conversation
                        </h4>
                        <p className="text-sm text-green-600">
                          Allow communication to continue
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="border-green-300 text-green-700 hover:bg-green-100 w-full sm:w-auto"
                        onClick={() => {
                          handleResumeConversation(selectedRequest.id);
                          setOpenRequestDialog(null);
                        }}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Resume
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Conversation History */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-lg mb-3">Recent Activity</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last message:</span>
                    <span className="text-gray-900">2 minutes ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Messages exchanged:</span>
                    <span className="text-gray-900">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data transfers:</span>
                    <span className="text-gray-900">3</span>
                  </div>
                </div>
              </div>

              {/* Admin Notes */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-lg mb-3">Admin Notes</h3>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                  placeholder="Add notes about this conversation control action..."
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                />
                <div className="flex justify-end mt-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setAdminNotes((prev) => ({
                        ...prev,
                        [selectedRequest.id]: noteDraft,
                      }));
                      if (toast)
                        toast({
                          title: "Note saved!",
                          description:
                            "Your admin note has been saved for this request.",
                        });
                    }}
                    disabled={
                      noteDraft === (adminNotes[selectedRequest.id] || "")
                    }
                  >
                    Save Note
                  </Button>
                </div>
                {adminNotes[selectedRequest.id] && (
                  <div className="text-xs text-gray-500 mt-2">
                    Last saved: {adminNotes[selectedRequest.id]}
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
