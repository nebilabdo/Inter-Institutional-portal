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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Filter,
  MessageCircle,
  Trash2,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import Link from "next/link";

interface APIRequest {
  id: number;
  institutionId: string;
  institutionName: string;
  services: string[]; // from JSON.parse
  title: string;
  description: string;
  status: "Submitted" | "In Review" | "Approved" | "Rejected" | "Completed";
  date: string; // from createdAt
  lastUpdated?: string; // from updatedAt
  responseFormat?: string;
  apiEndpoint?: string;
  rejectionReason?: string;
}

export default function MyRequestsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [requests, setRequests] = useState<APIRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRequests = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/requests", {
          credentials: "include", // if you're using cookies/session
        });
        if (!res.ok) throw new Error("Failed to load requests");

        const data: APIRequest[] = await res.json();
        setRequests(data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRequests();
  }, []);

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.institutionName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      request.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Submitted":
      case "In Review":
        return <Clock className="h-4 w-4" />;
      case "Approved":
      case "Completed":
        return <CheckCircle className="h-4 w-4" />;
      case "Rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <DashboardLayout userRole="consumer">
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              My API Requests
            </h1>
            <p className="text-gray-600 mt-2">
              Track and manage all your submitted API requests
            </p>
          </div>
          <Link href="/consumer/submit-request">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Submit New Request
            </Button>
          </Link>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter & Search
            </CardTitle>
            <CardDescription>
              Find specific requests using filters and search
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by title, provider, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Submitted">Submitted</SelectItem>
                  <SelectItem value="In Review">In Review</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your requests...</p>
          </div>
        ) : (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>
                Request History ({filteredRequests.length} requests)
              </CardTitle>
              <CardDescription>
                Complete list of your API requests with current status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request Details</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Services</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request) => (
                      <TableRow key={request.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-semibold">{request.title}</div>
                            <div className="text-sm text-gray-600 max-w-xs truncate">
                              {request.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {request.institutionName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {request.services
                              .slice(0, 3)
                              .map((service, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-gray-100 px-2 py-1 rounded truncate"
                                >
                                  {service}
                                </span>
                              ))}
                            {request.services.length > 3 && (
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                +{request.services.length - 3} more
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            className={`flex items-center gap-1 w-fit capitalize ${
                              request.status === "Approved" ||
                              request.status === "Completed"
                                ? "text-green-500 bg-green-100 hover:bg-green-200"
                                : request.status === "Submitted" ||
                                  request.status === "In Review"
                                ? "text-gray-500 bg-gray-100 hover:bg-gray-200"
                                : "text-red-500 bg-red-100 hover:bg-red-200"
                            }`}
                          >
                            {getStatusIcon(request.status)}
                            {request.status}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{formatDate(request.date)}</div>
                            {request.lastUpdated && (
                              <div className="text-gray-500">
                                Updated: {formatDate(request.lastUpdated)}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {(request.status === "Approved" ||
                              request.status === "Completed") && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-green-500 bg-green-100 hover:bg-green-200"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                            <Link href={`/consumer/${request.id}/chat`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-blue-600 bg-blue-50 hover:bg-blue-100"
                              >
                                <MessageCircle className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredRequests.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Search className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    No requests found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || statusFilter !== "all"
                      ? "Try adjusting your search criteria or filters"
                      : "You haven't submitted any API requests yet"}
                  </p>
                  <Link href="/consumer/submit-request">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Submit Your First Request
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
