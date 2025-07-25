"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { FileText, Clock, CheckCircle, X, AlertTriangle, Activity, User, Eye, RefreshCw, Settings, Bell } from "lucide-react"
import { MessageSquare, Pause, Play } from "lucide-react"
import { useToast } from "@/components/ui/use-toast";


export default function RequestsPage() {
  const [openRequestDialog, setOpenRequestDialog] = useState<null | 'view' | 'details' | 'logs' | 'report' | 'conversation'>(null)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [currentRequestsPage, setCurrentRequestsPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [conversationStatus, setConversationStatus] = useState<{[key: string]: boolean}>({});
  const [adminNotes, setAdminNotes] = useState<{ [key: string]: string }>({});
  const [noteDraft, setNoteDraft] = useState("");
  const { toast } = useToast ? useToast() : { toast: () => {} };

  useEffect(() => {
    setCurrentRequestsPage(1)
  }, [searchQuery, statusFilter])

  // When opening the conversation dialog, prefill noteDraft
  useEffect(() => {
    if (openRequestDialog === "conversation" && selectedRequest) {
      setNoteDraft(adminNotes[selectedRequest.id] || "");
    }
  }, [openRequestDialog, selectedRequest]);

  const requestsData = [
    {
      id: "REQ-2024-001",
      consumerInstitution: "TechCorp Ltd",
      focalPerson: "John Smith",
      focalPersonEmail: "john.smith@techcorp.com",
      providerInstitution: "DataBank Solutions",
      status: "Completed",
      priority: "Medium",
      whatIsAsked: "Customer transaction history for the last 6 months",
      response: "Transaction data successfully provided with 2,847 records",
      requestTime: "2024-01-15 14:30:00",
      responseTime: "2024-01-15 14:32:15",
      dataSize: "2.4 MB",
      conversationActive: true,
      requestMessage:
        "We need access to customer transaction history for our quarterly compliance report. Please provide data for account holders who have given consent.",
      responseMessage:
        "Data has been compiled and provided as requested. All records include only consented customers and comply with data protection regulations.",
    },
    {
      id: "REQ-2024-002",
      consumerInstitution: "FinancePlus",
      focalPerson: "Sarah Johnson",
      focalPersonEmail: "sarah.j@financeplus.com",
      providerInstitution: "CreditScore Inc",
      status: "In Progress",
      priority: "High",
      whatIsAsked: "Credit score verification for loan applications",
      response: "Processing - Expected completion in 2 hours",
      requestTime: "2024-01-15 16:45:00",
      responseTime: "-",
      dataSize: "-",
      conversationActive: true,
      requestMessage:
        "We have 45 loan applications that require credit score verification. All applicants have provided consent for credit checks.",
      responseMessage:
        "Request received and being processed. Our team is verifying the credit scores for all 45 applications. You will receive the complete report within 2 hours.",
    },
    {
      id: "REQ-2024-003",
      consumerInstitution: "Immigration and Citizenship Service (ICS)",
      focalPerson: "Michael Brown",
      focalPersonEmail: "m.brown@insuretech.com",
      providerInstitution: "Ministry of Foreign Affairs (MoFA)",
      status: "Approved",
      priority: "Medium",
      whatIsAsked: "Risk assessment data for insurance underwriting",
      response: "Risk profiles delivered for 156 applications",
      requestTime: "2024-01-14 09:15:00",
      responseTime: "2024-01-14 11:30:00",
      dataSize: "1.8 MB",
      conversationActive: false,
      requestMessage:
        "We need comprehensive risk assessment data for 156 insurance applications. This includes credit history, employment verification, and property assessments.",
      responseMessage:
        "Complete risk assessment profiles have been generated for all 156 applications. Each profile includes credit score, employment status, property valuation, and overall risk rating.",
    },
    {
      id: "REQ-2024-004",
      consumerInstitution: "Ministry of Foreign Affairs (MoFA)",
      focalPerson: "Emily Davis",
      focalPersonEmail: "emily.davis@lendingtree.com",
      providerInstitution: "Immigration and Citizenship Service (ICS)",
      status: "Failed",
      priority: "Low",
      whatIsAsked: "Identity verification for new account openings",
      response: "Verification failed - Invalid documentation provided",
      requestTime: "2024-01-13 13:20:00",
      responseTime: "2024-01-13 13:25:00",
      dataSize: "0.5 MB",
      conversationActive: false,
      requestMessage:
        "We need identity verification for 23 new account applications. All required documents have been submitted by the applicants.",
      responseMessage:
        "Identity verification could not be completed for 8 out of 23 applications due to invalid or insufficient documentation. Please request updated documents from these applicants.",
    },
    {
      id: "REQ-2024-005",
      consumerInstitution: "Ministry of Health (MoH)",
      focalPerson: "David Wilson",
      focalPersonEmail: "d.wilson@wealthmanage.com",
      providerInstitution: "Ministry of Revenue (MoR)",
      status: "Completed",
      priority: "Low",
      whatIsAsked: "Real-time market data for portfolio management",
      response: "Live market feed established successfully",
      requestTime: "2024-01-12 08:00:00",
      responseTime: "2024-01-12 08:05:00",
      dataSize: "Streaming",
      conversationActive: true,
      requestMessage:
        "We require real-time market data feed for our portfolio management system. This includes stock prices, forex rates, and commodity prices updated every 30 seconds.",
      responseMessage:
        "Real-time market data feed has been established. You now have access to live stock prices, forex rates, and commodity prices with 30-second refresh intervals.",
    },
    {
      id: "REQ-2024-006",
      consumerInstitution: "National ID",
      focalPerson: "John Smith",
      focalPersonEmail: "john.smith@techcorp.com",
      providerInstitution: "Ministry of Revenue (MoR)",
      status: "Completed",
      priority: "Medium",
      whatIsAsked: "Customer credit scores for loan processing",
      response: "Credit data provided for 1,247 customers",
      requestTime: "2024-01-15 16:40:00",
      responseTime: "2024-01-15 16:43:45",
      dataSize: "1.8 MB",
      conversationActive: false,
      requestMessage: "Need credit scores for loan application processing.",
      responseMessage: "Credit scores successfully provided for all requested customers.",
    },
    {
      id: "REQ-2024-007",
      consumerInstitution: "Ethio Telecom",
      focalPerson: "Sarah Johnson",
      focalPersonEmail: "sarah.j@financeplus.com",
      providerInstitution: "Ministry of Revenue (MoR)",
      status: "Rejected",
      priority: "High",
      whatIsAsked: "Risk assessment for mortgage applications",
      response: "Request failed - Insufficient data provided",
      requestTime: "2024-01-15 15:20:00",
      responseTime: "2024-01-15 15:25:00",
      dataSize: "0.2 MB",
      conversationActive: false,
      requestMessage: "Risk assessment needed for 50 mortgage applications.",
      responseMessage: "Cannot process - missing required customer consent forms.",
    },
    {
      id: "REQ-2024-008",
      consumerInstitution: "Ministry of Revenue (MoR)",
      focalPerson: "Michael Brown",
      focalPersonEmail: "m.brown@insuretech.com",
      providerInstitution: "National ID",
      status: "Pending",
      priority: "Medium",
      whatIsAsked: "Credit verification for insurance policies",
      response: "Credit verification completed for 89 applications",
      requestTime: "2024-01-15 14:15:00",
      responseTime: "2024-01-15 14:20:00",
      dataSize: "0.9 MB",
      conversationActive: true,
      requestMessage: "Credit verification needed for new insurance policies.",
      responseMessage: "All credit verifications completed successfully.",
    },
  ];

  const notifications = [
    {
      id: 1,
      type: "error",
      title: "Data Request Failed",
      message: "Request REQ-2024-004 failed due to invalid documentation",
      time: "2 minutes ago",
      read: false,
    },
    {
      id: 2,
      type: "warning",
      title: "Request Processing Delay",
      message: "Request REQ-2024-002 is taking longer than expected",
      time: "1 hour ago",
      read: false,
    },
  ];

  const getStatusBadge = (status: any) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Completed</Badge>
      case "In Progress":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">In Progress</Badge>
      case "Failed":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Failed</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">{status}</Badge>
    }
  }

  // Remove priority from request stats cards
  const getRequestStats = () => {
    const totalRequests = requestsData.length
    const pending = requestsData.filter((r) => r.status === "Pending").length
    const approved = requestsData.filter((r) => r.status === "Approved").length
    const rejected = requestsData.filter((r) => r.status === "Rejected").length
    const completed = requestsData.filter((r) => r.status === "Completed").length
    return { totalRequests, pending, approved, rejected, completed }
  }

  // Add handler for request actions
  const handleRequestAction = (action: string, request: any) => {
    setSelectedRequest(request);
    setOpenRequestDialog(action as 'view' | 'details' | 'logs' | 'report' | 'conversation');
  };

  // Conversation control handlers
  const handleStopConversation = (requestId: string) => {
    setConversationStatus(prev => ({ ...prev, [requestId]: false }));
    // In a real app, this would make an API call to stop the conversation
    console.log(`Conversation stopped for request: ${requestId}`);
  };

  const handleResumeConversation = (requestId: string) => {
    setConversationStatus(prev => ({ ...prev, [requestId]: true }));
    // In a real app, this would make an API call to resume the conversation
    console.log(`Conversation resumed for request: ${requestId}`);
  };

  const isConversationActive = (request: any) => {
    return conversationStatus[request.id] !== undefined 
      ? conversationStatus[request.id] 
      : request.conversationActive;
  };

  // Export Data handler
  const handleExportData = () => {
    // Create CSV content based on currently filtered requests
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
    const filteredRequests = requestsData
      .filter((request) => {
        const matchesSearch =
          request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          request.consumerInstitution.toLowerCase().includes(searchQuery.toLowerCase()) ||
          request.focalPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
          request.providerInstitution.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = !statusFilter || request.status.toLowerCase() === statusFilter;
        return matchesSearch && matchesStatus;
      });
    filteredRequests.forEach((request) => {
      const row = [
        request.id,
        `"${request.consumerInstitution}"`,
        `"${request.focalPerson}"`,
        `"${request.focalPersonEmail}"`,
        `"${request.providerInstitution}"`,
        request.status,
        request.priority,
        `"${request.whatIsAsked}"`,
        `"${request.response}"`,
        request.requestTime,
        request.responseTime,
        request.dataSize,
        `"${request.requestMessage}"`,
        `"${request.responseMessage}"`,
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

  // Add a refresh handler that simulates loading
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setIsRefreshing(false);
  };

  // Pagination logic
  const pageSize = 5;
  const filteredRequests = requestsData.filter((request) => {
    const matchesSearch =
      request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.consumerInstitution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.focalPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.providerInstitution.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || request.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const totalPages = Math.ceil(filteredRequests.length / pageSize);
  const paginatedRequests = filteredRequests.slice((currentRequestsPage - 1) * pageSize, currentRequestsPage * pageSize);

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
          <h1 className="text-3xl font-bold text-gray-900 font-[Poppins]">Manage Requests</h1>
          <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-200">Administrator</Badge>
        </div>
        <p className="text-gray-600 font-[Poppins]">Monitor and manage all data exchange requests between institutions</p>
      </div>
      {/* Request Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
        {(() => {
          const stats = getRequestStats();
          return [
            { title: "Total Requests", value: stats.totalRequests, icon: FileText, color: "bg-blue-50 hover:bg-blue-100", iconColor: "text-blue-500", textColor: "text-blue-600" },
            { title: "Pending", value: stats.pending, icon: Clock, color: "bg-yellow-50 hover:bg-yellow-100", iconColor: "text-yellow-500", textColor: "text-yellow-600" },
            { title: "Approved", value: stats.approved, icon: CheckCircle, color: "bg-green-50 hover:bg-green-100", iconColor: "text-green-500", textColor: "text-green-600" },
            { title: "Rejected", value: stats.rejected, icon: X, color: "bg-red-50 hover:bg-red-100", iconColor: "text-red-500", textColor: "text-red-600" },
            { title: "Completed", value: stats.completed, icon: CheckCircle, color: "bg-purple-50 hover:bg-purple-100", iconColor: "text-purple-500", textColor: "text-purple-600" },
          ].map((stat, index) => (
            <Card key={index} className="bg-white border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 rounded-2xl">
              <CardContent className="p-4">
                <div className={`${stat.color} rounded-lg p-4 relative flex flex-col items-start justify-between min-h-[120px]`}>
                  <div className="flex justify-between items-start w-full mb-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    </div>
                    <div className={`p-2 rounded-lg ${stat.color.split(" ")[0]} ml-2`}>
                      <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
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
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </Button>
              <Button size="sm" onClick={handleExportData}>Export Data</Button>
            </div>
          </CardTitle>
          <CardDescription>Monitor all data exchange requests between institutions</CardDescription>
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
                  <th className="text-left p-3 font-semibold text-gray-900">Request ID</th>
                  <th className="text-left p-3 font-semibold text-gray-900">Consumer Institution</th>
                  <th className="text-left p-3 font-semibold text-gray-900">Focal Person</th>
                  <th className="text-left p-3 font-semibold text-gray-900">Provider Institution</th>
                  <th className="text-left p-3 font-semibold text-gray-900">Status</th>
                  <th className="text-left p-3 font-semibold text-gray-900">What is Asked</th>
                  <th className="text-left p-3 font-semibold text-gray-900">Response</th>
                  <th className="text-left p-3 font-semibold text-gray-900">Conversation Status</th>
                  <th className="text-left p-3 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRequests.map((request, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3">
                        <span className="font-semibold text-gray-900">{request.id}</span>
                      </td>
                      <td className="p-3">
                        <span className="text-gray-600">{request.consumerInstitution}</span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{request.focalPerson}</div>
                            <div className="text-sm text-gray-500">{request.focalPersonEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="text-gray-600">{request.providerInstitution}</span>
                      </td>
                      <td className="p-3">{getStatusBadge(request.status)}</td>
                      <td className="p-3">
                        <span className="text-gray-700">{request.whatIsAsked}</span>
                      </td>
                      <td className="p-3">
                        <span className="text-gray-700">{request.response}</span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${isConversationActive(request) ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          <span className={`text-sm ${isConversationActive(request) ? 'text-green-600' : 'text-gray-500'}`}>
                            {isConversationActive(request) ? 'Active' : 'Stopped'}
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
                              <Button size="sm" variant="outline" className="h-8 px-2 bg-transparent">
                                <Settings className="w-3 h-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleRequestAction("details", request)}>
                                <User className="mr-2 h-4 w-4" />
                                <span>View Details</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleRequestAction("logs", request)}>
                                <Activity className="mr-2 h-4 w-4" />
                                <span>View Logs</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleRequestAction("conversation", request)}>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                <span>Conversation Control</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {isConversationActive(request) ? (
                                <DropdownMenuItem 
                                  className="text-orange-600" 
                                  onClick={() => handleStopConversation(request.id)}
                                >
                                  <Pause className="mr-2 h-4 w-4" />
                                  <span>Stop Conversation</span>
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem 
                                  className="text-green-600" 
                                  onClick={() => handleResumeConversation(request.id)}
                                >
                                  <Play className="mr-2 h-4 w-4" />
                                  <span>Resume Conversation</span>
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="text-red-600" onClick={() => handleRequestAction("report", request)}>
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
                className={`px-4 py-2 rounded-lg border font-medium ${currentRequestsPage === 1 ? 'text-gray-400 border-gray-200 bg-white cursor-not-allowed' : 'text-black border-gray-300 bg-white hover:bg-gray-100'}`}
                disabled={currentRequestsPage === 1}
                onClick={() => setCurrentRequestsPage(currentRequestsPage - 1)}
              >
                Previous
              </button>
              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  className={`px-4 py-2 rounded-lg border font-medium ${currentRequestsPage === page ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:bg-gray-100'}`}
                  onClick={() => setCurrentRequestsPage(page)}
                  disabled={currentRequestsPage === page}
                >
                  {page}
                </button>
              ))}
              <button
                className={`px-4 py-2 rounded-lg border font-medium ${currentRequestsPage === totalPages || totalPages === 0 ? 'text-gray-400 border-gray-200 bg-white cursor-not-allowed' : 'text-black border-gray-300 bg-white hover:bg-gray-100'}`}
                disabled={currentRequestsPage === totalPages || totalPages === 0}
                onClick={() => setCurrentRequestsPage(currentRequestsPage + 1)}
              >
                Next
              </button>
            </div>
            <div className="text-sm text-gray-500">
              Showing {(currentRequestsPage - 1) * pageSize + 1}-{Math.min(currentRequestsPage * pageSize, filteredRequests.length)} of {filteredRequests.length} requests
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Dialogs for request details, logs, and report */}
      {openRequestDialog === 'view' && selectedRequest && (
        <Dialog open={true} onOpenChange={() => setOpenRequestDialog(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Request Details - {selectedRequest.id}</DialogTitle>
              <DialogDescription>Complete information for request {selectedRequest.id}</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <h3 className="font-bold text-lg mb-2">Basic Information</h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div><span className="font-medium text-gray-500">Request ID:</span> <span className="text-blue-600 font-mono">{selectedRequest.id}</span></div>
                  <div><span className="font-medium text-gray-500">Consumer:</span> {selectedRequest.consumerInstitution}</div>
                  <div><span className="font-medium text-gray-500">Provider:</span> {selectedRequest.providerInstitution}</div>
                  <div><span className="font-medium text-gray-500">Status:</span> {selectedRequest.status}</div>
                  <div><span className="font-medium text-gray-500">Priority:</span> {selectedRequest.priority}</div>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Focal Person</h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div><span className="font-medium text-gray-500">Name:</span> {selectedRequest.focalPerson}</div>
                  <div><span className="font-medium text-gray-500">Email:</span> {selectedRequest.focalPersonEmail}</div>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="font-bold text-lg mb-2">Request Details</h3>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div><span className="font-medium text-gray-500">What is Asked:</span> {selectedRequest.whatIsAsked}</div>
                <div><span className="font-medium text-gray-500">Response:</span> {selectedRequest.response}</div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      {openRequestDialog === 'details' && selectedRequest && (
        <Dialog open={true} onOpenChange={() => setOpenRequestDialog(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Request Technical Details - {selectedRequest.id}</DialogTitle>
              <DialogDescription>Technical and metadata for request {selectedRequest.id}</DialogDescription>
            </DialogHeader>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 mt-4">
              <div><span className="font-medium text-gray-500">Request Time:</span> {selectedRequest.requestTime}</div>
              <div><span className="font-medium text-gray-500">Response Time:</span> {selectedRequest.responseTime}</div>
              <div><span className="font-medium text-gray-500">Data Size:</span> {selectedRequest.dataSize}</div>
              <div><span className="font-medium text-gray-500">Request Message:</span> {selectedRequest.requestMessage}</div>
              <div><span className="font-medium text-gray-500">Response Message:</span> {selectedRequest.responseMessage}</div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      {openRequestDialog === 'logs' && selectedRequest && (
        <Dialog open={true} onOpenChange={() => setOpenRequestDialog(null)}>
          <DialogContent className="w-full sm:max-w-lg md:max-w-2xl px-2 sm:px-4">
            <DialogHeader>
              <DialogTitle>Request Logs - {selectedRequest.id}</DialogTitle>
              <DialogDescription>Logs and history for request {selectedRequest.id}</DialogDescription>
            </DialogHeader>
            {/* Chat-like log history with avatars */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-4 mt-4 max-h-96 overflow-y-auto flex flex-col">
              {/* Mock chat history */}
              {[{sender: 'Consumer', message: 'Hello, we need the latest transaction data.'},
                {sender: 'Provider', message: 'Received. We are preparing the data.'},
                {sender: 'Consumer', message: 'Thank you! Please notify us when ready.'},
                {sender: 'Provider', message: 'Data is ready. Please find the attached file.'},
                {sender: 'Consumer', message: 'File received. Thanks for your quick response.'},
                {sender: 'Provider', message: 'You are welcome. Let us know if you need anything else.'}
              ].map((chat, idx) => {
                const isConsumer = chat.sender === 'Consumer';
                const avatarBg = isConsumer ? 'bg-blue-500' : 'bg-green-500';
                const avatarLetter = isConsumer ? 'C' : 'P';
                return (
                  <div key={idx} className={`flex ${isConsumer ? 'justify-start' : 'justify-end'} items-end`}>
                    {isConsumer && (
                      <div className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-bold text-base mr-2 ${avatarBg}`}>
                        {avatarLetter}
                      </div>
                    )}
                    <div className={`rounded-lg px-4 py-2 max-w-xs ${isConsumer ? 'bg-blue-100 text-blue-900' : 'bg-green-100 text-green-900'}`}>
                      <div className="text-xs font-semibold mb-1">{chat.sender}</div>
                      <div>{chat.message}</div>
                    </div>
                    {!isConsumer && (
                      <div className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-bold text-base ml-2 ${avatarBg}`}>
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
      {openRequestDialog === 'report' && selectedRequest && (
        <Dialog open={true} onOpenChange={() => setOpenRequestDialog(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Report Issue - {selectedRequest.id}</DialogTitle>
              <DialogDescription>Report an issue for this request.</DialogDescription>
            </DialogHeader>
            <form className="space-y-4 mt-4">
              <div>
                <label className="block text-gray-700 font-medium">Issue Description</label>
                <textarea className="w-full border rounded px-3 py-2" rows={4} placeholder="Describe the issue..." />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpenRequestDialog(null)}>Cancel</Button>
                <Button type="submit" variant="destructive">Submit</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
      {openRequestDialog === 'conversation' && selectedRequest && (
        <Dialog open={true} onOpenChange={() => setOpenRequestDialog(null)}>
          <DialogContent className="max-w-2xl w-full p-2 sm:p-6 max-h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Conversation Control - {selectedRequest.id}</DialogTitle>
              <DialogDescription>
                Control the conversation between {selectedRequest.consumerInstitution} and {selectedRequest.providerInstitution}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 mt-4 overflow-y-auto flex-1 pr-1">
              {/* Current Status */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-lg mb-3">Current Status</h3>
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${isConversationActive(selectedRequest) ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className={`font-medium ${isConversationActive(selectedRequest) ? 'text-green-600' : 'text-gray-600'}`}>Conversation is {isConversationActive(selectedRequest) ? 'Active' : 'Stopped'}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {isConversationActive(selectedRequest) 
                    ? 'Both institutions can currently communicate and exchange data.' 
                    : 'Communication between institutions is currently paused.'}
                </p>
              </div>

              {/* Control Actions */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-lg mb-3">Control Actions</h3>
                <div className="space-y-3">
                  {isConversationActive(selectedRequest) ? (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200 gap-3">
                      <div>
                        <h4 className="font-medium text-orange-800">Stop Conversation</h4>
                        <p className="text-sm text-orange-600">Pause communication between institutions</p>
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
                        <h4 className="font-medium text-green-800">Resume Conversation</h4>
                        <p className="text-sm text-green-600">Allow communication to continue</p>
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
                  onChange={e => setNoteDraft(e.target.value)}
                />
                <div className="flex justify-end mt-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setAdminNotes(prev => ({ ...prev, [selectedRequest.id]: noteDraft }));
                      if (toast) toast({ title: "Note saved!", description: "Your admin note has been saved for this request." });
                    }}
                    disabled={noteDraft === (adminNotes[selectedRequest.id] || "")}
                  >
                    Save Note
                  </Button>
                </div>
                {adminNotes[selectedRequest.id] && (
                  <div className="text-xs text-gray-500 mt-2">Last saved: {adminNotes[selectedRequest.id]}</div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 