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
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import axios from "axios";

interface Institution {
  id: number;
  name: string;
  status: string;
  approved: number;
}

// Create a separate component that uses useState and useEffect
function DashboardContent() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState<string>("Loading...");
  const [usersChange, setUsersChange] = useState<string>("");

  const [institutionStats, setInstitutionStats] = useState({
    total: "Loading...",
    change: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const institutionsRes = await axios.get(
          "http://localhost:5000/api/admin/institutions",
          {
            withCredentials: true,
          }
        );

        console.log("Institutions API response:", institutionsRes.data);

        const institutionsData =
          institutionsRes.data.institutions || institutionsRes.data;

        if (Array.isArray(institutionsData)) {
          setInstitutions(institutionsData);
        } else {
          setInstitutions([]);
          console.warn("Institutions data is not an array", institutionsData);
        }

        setInstitutionStats({
          total: institutionsRes.data.total?.toString() || "0",
          change: institutionsRes.data.change || "",
        });

        const usersRes = await axios.get(
          "http://localhost:5000/api/admin/user-stats",
          {
            withCredentials: true,
          }
        );

        setTotalUsers(usersRes.data.totalUsers?.toString() || "0");
        setUsersChange(usersRes.data.change || "");
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setTotalUsers("Error");
        setUsersChange("");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const activeCount = institutions.filter(
    (i) => i.status?.toLowerCase() === "active"
  ).length;

  const pendingCount = institutions.filter(
    (i) => i.status?.trim().toLowerCase() === "pending"
  ).length;

  const suspendedCount = institutions.filter(
    (i) => i.status?.toLowerCase() === "suspended"
  ).length;

  // Fix localStorage usage - only access it after component mounts
  const [activeTab, setActiveTab] = useState("institutions");
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // This runs only on client side
    const savedTab = localStorage.getItem("activeTab");
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get("http://localhost:5000/api/admin/institutions", {
          withCredentials: true,
        });
        // Authenticated, do nothing
      } catch (error) {
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (activeTab) {
      localStorage.setItem("activeTab", activeTab);
    }
  }, [activeTab]);



  const stats = [
    {
      title: "Registered Institutions",
      value: institutionStats.total,
      change: institutionStats.change,
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
      value: pendingCount.toString(),
      change: `${pendingCount} Pending`,
      icon: Clock,
      color: "bg-green-50 hover:bg-green-100",
      iconColor: "text-green-500",
      textColor: "text-green-600",
    },
    {
      title: "Total Users",
      value: totalUsers,
      change: usersChange,
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
                    className={`p-2 rounded-lg ${stat.color.split(" ")[0]} ml-2`}
                  >
                    <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-sm ${stat.textColor}`}>{stat.change}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
          <TabsTrigger value="institutions" className="flex items-center space-x-2">
            <Building2 className="w-4 h-4" />
            <span>Institutions</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>System Activity</span>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="font-semibold text-blue-900">Active Institutions</p>
                      <p className="text-2xl font-bold text-blue-700">{activeCount}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-8 h-8 text-amber-600" />
                    <div>
                      <p className="font-semibold text-amber-900">Pending Approval</p>
                      <p className="text-2xl font-bold text-amber-700">{pendingCount}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                    <div>
                      <p className="font-semibold text-red-900">Suspended Institutions</p>
                      <p className="text-2xl font-bold text-red-700">{suspendedCount}</p>
                    </div>
                  </div>
                </div>
              </div>



              {/* Example institutions list - replace or expand as needed */}
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <th className="py-2 text-sm text-gray-600">Name</th>
                      <th className="py-2 text-sm text-gray-600">Status</th>
                      <th className="py-2 text-sm text-gray-600">Approved</th>
                    </tr>
                  </thead>
                  <tbody>
                    {institutions.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-4 text-sm text-gray-500">
                          No institutions available.
                        </td>
                      </tr>
                    ) : (
                      institutions.map((inst) => (
                        <tr key={inst.id} className="border-t">
                          <td className="py-3 text-sm text-gray-800">{inst.name}</td>
                          <td className="py-3 text-sm text-gray-600">{inst.status}</td>
                          <td className="py-3 text-sm text-gray-600">{inst.approved}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity tab (moved activity details here) */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>System Activity</span>
              </CardTitle>
              <CardDescription>Recent system activities and request logs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="col-span-1 lg:col-span-1">
                  <div className="space-y-2">
                    {recentActivities.map((act, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedActivity(act)}
                        className={`w-full text-left p-3 rounded-lg border ${selectedActivity === act ? "border-blue-300 bg-blue-50" : "border-gray-100 hover:bg-gray-50"}`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-800">{act.title}</p>
                            <p className="text-xs text-gray-500">{act.time}</p>
                          </div>
                          <div>
                            <Badge className="ml-2">{act.type}</Badge>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>



                <div className="col-span-1 lg:col-span-2">
                  {selectedActivity && selectedActivity.details ? (
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-2">{selectedActivity.title}</h3>
                      <div className="space-y-2">
                        {Object.entries(selectedActivity.details).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-start">
                            <span className="text-sm font-medium text-gray-600 capitalize">
                              {key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}:
                            </span>
                            <span className="text-sm text-gray-900 text-right max-w-xs">
                              {Array.isArray(value) ? value.join(", ") : String(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-8 rounded-lg text-center">
                      <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">Click on any activity to view detailed information</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}

// Main component with Suspense boundary
export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-lg">Loading Dashboard...</div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
