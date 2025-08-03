"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Plus,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  AlertCircle,
  Download,
  Eye,
  ExternalLink,
  Copy,
  Calendar,
  Activity,
  Building2,
  Search,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";

interface Institution {
  id: number; // changed to number
  name: string;
  type: string;
  status: "active" | "inactive" | "pending";
  description?: string; // optional, since API doesn't return it
  services: string[];
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface APIRequest {
  id: number;
  title: string;
  provider: string;
  providerId: string;
  status: "pending" | "approved" | "rejected" | "in_progress";
  submittedDate: string;
  priority: "high" | "medium" | "low";
  description: string;
  apiEndpoint?: string;
  documentation?: string;
  rejectionReason?: string;
  progress?: number;
  estimatedCompletion?: string;
}

interface Notification {
  id: number;
  message: string;
  timestamp: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
}

interface DashboardStats {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  monthlyUsage: number;
  activeAPIs: number;
  availableInstitutions: number;
}

export default function ConsumerDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    monthlyUsage: 0,
    activeAPIs: 0,
    availableInstitutions: 0,
  });

  useEffect(() => {
    async function fetchInstitutions() {
      try {
        const res = await fetch(
          "http://localhost:5000/api/requests/institutions"
        );
        if (!res.ok) throw new Error("Failed to fetch institutions");
        const data: Institution[] = await res.json();

        console.log("Institutions fetched:", data);

        const activeInstitutionsCount = data.filter(
          (inst) => inst.status?.toLowerCase() === "active"
        ).length;

        console.log("Active institutions count:", activeInstitutionsCount);

        setStats((prevStats) => ({
          ...prevStats,
          availableInstitutions: activeInstitutionsCount,
        }));
      } catch (error) {
        console.error("Error fetching institutions:", error);
      }
    }
    fetchInstitutions();
  }, []);

  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchInstitutions() {
      try {
        const res = await fetch(
          "http://localhost:5000/api/requests/institutions"
        );
        if (!res.ok) throw new Error("Failed to fetch institutions");
        const data = await res.json();
        console.log("Fetched institutions", data);
        setInstitutions(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchInstitutions();
  }, []);

  const [recentRequests, setRecentRequests] = useState<APIRequest[]>([
    {
      id: 1,
      title: "Student Enrollment Data API",
      provider: "Ministry of Education",
      providerId: "edu-001",
      status: "in_progress",
      submittedDate: "2024-01-16",
      priority: "high",
      description:
        "Request for real-time student enrollment data across universities",
      progress: 75,
      estimatedCompletion: "2024-01-20",
    },
    {
      id: 2,
      title: "Research Publication Metrics",
      provider: "Academic Publishers Consortium",
      providerId: "publishers-001",
      status: "approved",
      submittedDate: "2024-01-15",
      priority: "medium",
      description: "Access to publication metrics and citation data",
      apiEndpoint: "https://api.publishers.org/v3/metrics",
      documentation: "https://docs.publishers.org/api",
    },
    {
      id: 3,
      title: "Financial Aid Information",
      provider: "Department of Financial Services",
      providerId: "finance-001",
      status: "rejected",
      submittedDate: "2024-01-14",
      priority: "low",
      description: "Student financial aid status and history",
      rejectionReason: "Insufficient security clearance documentation provided",
    },
    {
      id: 4,
      title: "Healthcare Provider Directory",
      provider: "Ministry of Health",
      providerId: "health-001",
      status: "approved",
      submittedDate: "2024-01-12",
      priority: "high",
      description:
        "Comprehensive healthcare provider directory with specializations",
      apiEndpoint: "https://api.health.gov/v2/providers",
      documentation: "https://docs.health.gov/api",
    },
    {
      id: 5,
      title: "Transportation Route Data",
      provider: "Transport Authority",
      providerId: "transport-001",
      status: "pending",
      submittedDate: "2024-01-10",
      priority: "medium",
      description: "Public transportation routes and schedules",
    },
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      message: "Your request 'Student Enrollment Data API' is 75% complete",
      timestamp: "2 hours ago",
      type: "info",
      isRead: false,
    },
    {
      id: 2,
      message: "API documentation available for 'Research Publication Metrics'",
      timestamp: "1 day ago",
      type: "success",
      isRead: false,
    },
    {
      id: 3,
      message:
        "Request 'Financial Aid Information' requires additional documentation",
      timestamp: "2 days ago",
      type: "warning",
      isRead: true,
    },
    {
      id: 4,
      message: "New API endpoint available for Healthcare Provider Directory",
      timestamp: "3 days ago",
      type: "success",
      isRead: true,
    },
  ]);

  useEffect(() => {
    fetch("http://localhost:5000/api/requests")
      .then((res) => res.json())
      .then((data) => {
        setStats((prev) => ({
          ...prev,
          totalRequests: data.length,
        }));
      })
      .catch((err) => console.error("Failed to fetch requests", err));
  }, []);

  const markNotificationAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "in_progress":
        return <Activity className="h-4 w-4 animate-pulse" />;
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "in_progress":
        return "default";
      case "approved":
        return "default";
      case "rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "in_progress":
        return "In Progress";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const getReliabilityColor = (reliability: number) => {
    if (reliability >= 99) return "text-green-600";
    if (reliability >= 97) return "text-yellow-600";
    return "text-red-600";
  };

  const unreadNotifications = notifications.filter((n) => !n.isRead);

  const filteredInstitutions = institutions.filter((institution) => {
    const isActive = institution.status?.toLowerCase() === "active";
    const matchesSearch =
      searchTerm.trim() === "" ||
      institution.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      institution.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      institution.description
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      institution.services?.some((service) =>
        service.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return isActive && matchesSearch;
  });

  return (
    <DashboardLayout userRole="consumer">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Consumer Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your API requests and track data access across institutions
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Provider Dashboard Button */}
            <Button
              onClick={() => router.push("/provider/dashboard")}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md"
            >
              <Activity className="h-5 w-5 mr-2" />
              Provider Dashboard
            </Button>

            <Link href="/consumer/submit-request">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                Submit New API Request
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">
                Total Requests
              </CardTitle>
              <FileText className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-800">
                {stats.totalRequests}
              </div>
              <p className="text-xs text-blue-600 mt-1">All time submissions</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100 hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-700">
                Pending Review
              </CardTitle>
              <Clock className="h-5 w-5 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-800">
                {stats.pendingRequests}
              </div>
              <p className="text-xs text-yellow-600 mt-1">
                Awaiting provider response
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">
                Active APIs
              </CardTitle>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-800">
                {stats.activeAPIs}
              </div>
              <p className="text-xs text-green-600 mt-1">
                Ready for integration
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">
                Available Institutions
              </CardTitle>
              <Building2 className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-800">
                {stats.availableInstitutions}
              </div>
              <p className="text-xs text-purple-600 mt-1">Ready to connect</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="institutions" className="space-y-6">
          <TabsContent value="institutions" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Available Institutions
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Browse and connect with institutions in the data exchange
                      network
                    </CardDescription>
                  </div>
                  <div className="relative w-full md:w-auto">
                    <Input
                      placeholder="Search institutions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full md:w-64"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredInstitutions.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      No institutions found
                    </h3>
                    <p className="text-gray-500">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {filteredInstitutions.map((institution) => (
                      <Card
                        key={institution.id}
                        className="flex flex-col h-full border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
                      >
                        <CardHeader className="pb-0 px-4 pt-4">
                          <div className="flex items-center justify-between gap-2 w-full">
                            <CardTitle className="text-base font-medium truncate">
                              {institution.name}
                            </CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="px-4 py-3 flex-1">
                          <div className="mb-2">
                            <div className="flex flex-wrap gap-1.5">
                              {institution.services
                                .slice(0, 4)
                                .map((service, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs px-2 py-0.5"
                                  >
                                    {service}
                                  </Badge>
                                ))}
                              {institution.services.length > 4 && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge
                                        variant="outline"
                                        className="text-xs px-2 py-0.5"
                                      >
                                        +{institution.services.length - 4}
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <div className="grid grid-cols-2 gap-2 p-2 max-w-xs">
                                        {institution.services
                                          .slice(4)
                                          .map((service, i) => (
                                            <Badge
                                              key={i}
                                              variant="secondary"
                                              className="text-xs"
                                            >
                                              {service}
                                            </Badge>
                                          ))}
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-0 px-4 pb-4">
                          <Link
                            href={`/consumer/institutions/${institution.id}`}
                          ></Link>
                          <Link
                            href={`/consumer/submit-request?institution=${institution.id}`}
                          >
                            <Button>Request</Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recent" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  My API Requests
                </CardTitle>
                <CardDescription>
                  Track the status and progress of your submissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentRequests.map((request) => (
                    <div
                      key={request.id}
                      className="border rounded-xl p-6 hover:shadow-md transition-all bg-gradient-to-r from-gray-50 to-white"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3">
                            <h4 className="font-semibold text-lg">
                              {request.title}
                            </h4>
                            <Badge
                              variant={
                                getPriorityColor(request.priority) as any
                              }
                              className="text-xs"
                            >
                              {request.priority} priority
                            </Badge>
                          </div>
                          <p className="text-gray-600">{request.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>
                              Provider: <strong>{request.provider}</strong>
                            </span>
                            <span>•</span>
                            <span>Submitted: {request.submittedDate}</span>
                            {request.estimatedCompletion && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  Est. completion: {request.estimatedCompletion}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <Badge
                          variant={getStatusColor(request.status) as any}
                          className="ml-4"
                        >
                          {getStatusIcon(request.status)}
                          <span className="ml-2">
                            {getStatusText(request.status)}
                          </span>
                        </Badge>
                      </div>

                      {/* Progress Bar for In Progress Requests */}
                      {request.status === "in_progress" && request.progress && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-blue-800">
                              Processing Progress
                            </p>
                            <span className="text-sm text-blue-700">
                              {request.progress}%
                            </span>
                          </div>
                          <Progress value={request.progress} className="h-2" />
                          <p className="text-xs text-blue-600 mt-2">
                            Your request is being processed by{" "}
                            {request.provider}
                          </p>
                        </div>
                      )}

                      {/* Approved API Details */}
                      {request.status === "approved" && request.apiEndpoint && (
                        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-green-800">
                                API Ready for Integration
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <code className="text-sm text-green-700 bg-green-100 px-2 py-1 rounded">
                                  {request.apiEndpoint}
                                </code>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() =>
                                    copyToClipboard(request.apiEndpoint!)
                                  }
                                  className="h-6 w-6 p-0"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {request.documentation && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-green-700 border-green-300 bg-transparent"
                                  onClick={() =>
                                    window.open(request.documentation, "_blank")
                                  }
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Docs
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-700 border-green-300 bg-transparent"
                              >
                                <Download className="h-4 w-4 mr-1" />
                                SDK
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Rejection Details */}
                      {request.status === "rejected" &&
                        request.rejectionReason && (
                          <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                            <p className="text-sm font-medium text-red-800">
                              Rejection Reason:
                            </p>
                            <p className="text-sm text-red-700 mt-1">
                              {request.rejectionReason}
                            </p>
                            <Link
                              href={`/consumer/submit-request?institution=${request.providerId}&resubmit=${request.id}`}
                            >
                              <Button
                                size="sm"
                                variant="outline"
                                className="mt-3 text-red-700 border-red-300 bg-transparent"
                              >
                                Resubmit Request
                              </Button>
                            </Link>
                          </div>
                        )}

                      <div className="flex justify-end mt-4 gap-2">
                        <Link href={`/consumer/requests/${request.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                        </Link>
                        {request.status === "pending" && (
                          <Link
                            href={`/consumer/submit-request?institution=${request.providerId}&edit=${request.id}`}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-blue-600 bg-transparent"
                            >
                              Edit Request
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Active API Integrations
                </CardTitle>
                <CardDescription>
                  APIs you have access to with full documentation and
                  credentials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentRequests
                    .filter((req) => req.status === "approved")
                    .map((request) => (
                      <div
                        key={request.id}
                        className="border rounded-xl p-6 bg-gradient-to-r from-green-50 to-white hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-3 flex-1">
                            <div className="flex items-center gap-3">
                              <h4 className="font-semibold text-lg">
                                {request.title}
                              </h4>
                              <Badge className="bg-green-100 text-green-800">
                                Active
                              </Badge>
                            </div>
                            <p className="text-gray-600">
                              {request.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>
                                Provider: <strong>{request.provider}</strong>
                              </span>
                              <span>•</span>
                              <span>Approved: {request.submittedDate}</span>
                            </div>
                            {request.apiEndpoint && (
                              <div className="flex items-center gap-2 mt-2">
                                <code className="text-sm bg-gray-100 px-3 py-1 rounded font-mono">
                                  {request.apiEndpoint}
                                </code>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() =>
                                    copyToClipboard(request.apiEndpoint!)
                                  }
                                  className="h-6 w-6 p-0"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {request.documentation && (
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() =>
                                  window.open(request.documentation, "_blank")
                                }
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Documentation
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4 mr-1" />
                              Download SDK
                            </Button>
                            <Button size="sm" variant="outline">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              API Console
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}

                  {recentRequests.filter((req) => req.status === "approved")
                    .length === 0 && (
                    <div className="text-center py-12">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">
                        No Active APIs
                      </h3>
                      <p className="text-gray-500 mb-4">
                        You don't have any approved API integrations yet
                      </p>
                      <Link href="/consumer/submit-request">
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Submit Your First Request
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                  Recent Notifications
                  {unreadNotifications.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {unreadNotifications.length} unread
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Stay updated on your request status and system updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start gap-4 p-4 border rounded-lg transition-all cursor-pointer ${
                        !notification.isRead
                          ? "bg-blue-50 border-blue-200 hover:bg-blue-100"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <div className="flex-shrink-0 mt-1">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            notification.type === "success"
                              ? "bg-green-500"
                              : notification.type === "warning"
                              ? "bg-yellow-500"
                              : notification.type === "error"
                              ? "bg-red-500"
                              : "bg-blue-500"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p
                            className={`text-sm ${
                              !notification.isRead ? "font-semibold" : ""
                            }`}
                          >
                            {notification.message}
                          </p>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {notification.timestamp}
                        </p>
                      </div>
                      <Badge
                        variant={
                          notification.type === "success"
                            ? "default"
                            : notification.type === "warning"
                            ? "secondary"
                            : notification.type === "error"
                            ? "destructive"
                            : "outline"
                        }
                        className="text-xs"
                      >
                        {notification.type}
                      </Badge>
                    </div>
                  ))}

                  {notifications.length === 0 && (
                    <div className="text-center py-12">
                      <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">
                        No Notifications
                      </h3>
                      <p className="text-gray-500">
                        You're all caught up! New notifications will appear
                        here.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
