"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, FileText, Users, Activity, Clock, CheckCircle, AlertTriangle } from "lucide-react";

interface Institution {
  id: number;
  name: string;
  status: string;
  approved: number;
}

function DashboardContent() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState<string>("Loading...");
  const [usersChange, setUsersChange] = useState<string>("");
  const [institutionStats, setInstitutionStats] = useState({ total: "Loading...", change: "" });
  const [activeTab, setActiveTab] = useState("institutions");
  const [selectedActivity, setSelectedActivity] = useState<any>(null);

  const router = useRouter();

  // Fetch institutions and users data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const institutionsRes = await axios.get("http://localhost:5000/api/admin/institutions", { withCredentials: true });
        const institutionsData = institutionsRes.data.institutions || institutionsRes.data;
        setInstitutions(Array.isArray(institutionsData) ? institutionsData : []);
        setInstitutionStats({
          total: institutionsRes.data.total?.toString() || "0",
          change: institutionsRes.data.change || "",
        });

        const usersRes = await axios.get("http://localhost:5000/api/admin/user-stats", { withCredentials: true });
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

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get("http://localhost:5000/api/admin/institutions", { withCredentials: true });
      } catch {
        router.push("/login");
      }
    };
    checkAuth();
  }, [router]);

  // Manage active tab in localStorage
  useEffect(() => {
    const savedTab = localStorage.getItem("activeTab");
    if (savedTab) setActiveTab(savedTab);
  }, []);

  useEffect(() => {
    if (activeTab) localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  // Calculate institution counts
  const activeCount = institutions.filter(i => i.status?.toLowerCase() === "active").length;
  const pendingCount = institutions.filter(i => i.status?.toLowerCase() === "pending").length;
  const suspendedCount = institutions.filter(i => i.status?.toLowerCase() === "suspended").length;

  // Stats cards
  const stats = [
    { title: "Registered Institutions", value: institutionStats.total, change: institutionStats.change, icon: Building2, color: "bg-blue-50 hover:bg-blue-100", iconColor: "text-blue-500", textColor: "text-blue-600" },
    { title: "Active API Requests", value: "156", change: "+12 this Month", icon: FileText, color: "bg-yellow-50 hover:bg-yellow-100", iconColor: "text-yellow-600", textColor: "text-yellow-700" },
    { title: "Pending Approvals", value: pendingCount.toString(), change: `${pendingCount} Pending`, icon: Clock, color: "bg-green-50 hover:bg-green-100", iconColor: "text-green-500", textColor: "text-green-600" },
    { title: "Total Users", value: totalUsers, change: usersChange, icon: Users, color: "bg-purple-50 hover:bg-purple-100", iconColor: "text-purple-500", textColor: "text-purple-600" },
  ];

  // Example recent activities
  const recentActivities = [
    { type: "registration", title: "New institution registered", time: "2 min ago", details: { institution: "FinTech Solutions Ltd", registrationId: "REG-2024-009", status: "Pending Approval" } },
    { type: "request", title: "Data request completed", time: "5 min ago", details: { requestId: "REQ-2024-006", status: "Successfully Completed" } },
    { type: "failure", title: "Request failed", time: "15 min ago", details: { requestId: "REQ-2024-007", status: "Failed" } },
    { type: "user", title: "Admin user logged in", time: "1 hour ago", details: { userId: "admin@system.com", actions: ["Viewed dashboard", "Checked notifications"] } },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <main className="px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-200">Administrator</Badge>
        </div>
        <p className="text-gray-600">Monitor and manage system operations, user activities, and institutional data</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-white border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-4">
              <div className={`${stat.color} rounded-lg p-4 relative`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${stat.color.split(" ")[0]} ml-2`}>
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

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
          <TabsTrigger value="institutions" className="flex items-center space-x-2"><Building2 className="w-4 h-4" /><span>Institutions</span></TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center space-x-2"><Activity className="w-4 h-4" /><span>System Activity</span></TabsTrigger>
        </TabsList>

        {/* Institutions Tab */}
        <TabsContent value="institutions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2"><Building2 className="w-5 h-5" />Institution Management</CardTitle>
              <CardDescription>Manage and monitor registered institutions in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 flex items-center space-x-3">
                  <CheckCircle className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="font-semibold text-blue-900">Active Institutions</p>
                    <p className="text-2xl font-bold text-blue-700">{activeCount}</p>
                  </div>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 flex items-center space-x-3">
                  <Clock className="w-8 h-8 text-amber-600" />
                  <div>
                    <p className="font-semibold text-amber-900">Pending Approval</p>
                    <p className="text-2xl font-bold text-amber-700">{pendingCount}</p>
                  </div>
                </div>
                <div className="p-4 bg-red-50 rounded-lg border border-red-200 flex items-center space-x-3">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                  <div>
                    <p className="font-semibold text-red-900">Suspended</p>
                    <p className="text-2xl font-bold text-red-700">{suspendedCount}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2"><Activity className="w-5 h-5" />System Activity Monitor</CardTitle>
              <CardDescription>Real-time system performance and user activity tracking</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Recent Activities</h4>
                <div className="space-y-3">
                  {recentActivities.map((act, i) => (
                    <div key={i} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100" onClick={() => setSelectedActivity(act)}>
                      <div className={`w-2 h-2 rounded-full ${act.type === "registration" ? "bg-green-500" : act.type === "request" ? "bg-blue-500" : act.type === "failure" ? "bg-red-500" : "bg-purple-500"}`}></div>
                      <span className="text-sm">{act.title}</span>
                      <span className="text-xs text-gray-500 ml-auto">{act.time}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Activity Details</h4>
                {selectedActivity ? (
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    {Object.entries(selectedActivity.details).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-start">
                        <span className="text-sm font-medium text-gray-600 capitalize">{key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}:</span>
                        <span className="text-sm text-gray-900 text-right max-w-xs">{Array.isArray(value) ? value.join(", ") : String(value)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 p-8 rounded-lg text-center">
                    <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Click on any activity to view detailed information</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen text-lg">Loading Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
