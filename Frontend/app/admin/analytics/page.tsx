"use client";

import { Badge } from "@/components/ui/badge";
import { BarChart3, PieChart, FileText, Clock, User } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
} from "@/components/ui/chart";
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart as RePieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { usePathname } from "next/navigation";

export default function AnalyticsPage() {
  const pathname = usePathname();
  if (pathname === "/notifications") return null;

  const monthlyData = [
    { month: "Jan", requests: 45, completed: 42, failed: 3 },
    { month: "Feb", requests: 52, completed: 48, failed: 4 },
    { month: "Mar", requests: 38, completed: 35, failed: 3 },
    { month: "Apr", requests: 61, completed: 58, failed: 3 },
    { month: "May", requests: 55, completed: 51, failed: 4 },
    { month: "Jun", requests: 67, completed: 63, failed: 4 },
  ];

  const statusData = [
    { name: "Completed", value: 4, color: "#10b981" },
    { name: "In Progress", value: 2, color: "#3b82f6" },
    { name: "Failed/Rejected", value: 2, color: "#ef4444" },
  ];

  const total = statusData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="px-6 md:px-12 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <Badge
            variant="secondary"
            className="bg-red-100 text-red-800 hover:bg-red-200"
          >
            Administrator
          </Badge>
        </div>
        <p className="text-gray-600">
          Comprehensive analytics and insights for system performance
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SummaryCard
          title="Registered Institutions"
          icon={<FileText className="w-6 h-6 text-blue-400" />}
          value="24"
          subtitle="+3 this Month"
          bgColor="bg-blue-50"
          textColor="text-blue-600"
        />
        <SummaryCard
          title="Active API Requests"
          icon={<FileText className="w-6 h-6 text-yellow-400" />}
          value="156"
          subtitle="+12 this Month"
          bgColor="bg-yellow-50"
          textColor="text-yellow-600"
        />
        <SummaryCard
          title="Pending Approvals"
          icon={<Clock className="w-6 h-6 text-green-400" />}
          value="8"
          subtitle="2 Urgent"
          bgColor="bg-green-50"
          textColor="text-green-600"
        />
        <SummaryCard
          title="Total Users"
          icon={<User className="w-6 h-6 text-purple-400" />}
          value="342"
          subtitle="+18 this Month"
          bgColor="bg-purple-50"
          textColor="text-purple-600"
        />
      </div>

      {/* Charts Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-blue-500" />
          System Analytics Overview
        </h2>

        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-0 w-full">
          {/* Bar Chart */}
          <div className="flex-1 min-w-0 flex justify-center w-full">
            <Card className="bg-white shadow-lg rounded-xl p-4 w-full max-w-2xl flex flex-col items-center">
              <CardHeader className="w-full">
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  <span>Monthly Request Trends</span>
                </CardTitle>
                <CardDescription>
                  Request volume and completion rates over the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent className="w-full">
                <div className="h-64 w-full">
                  <ChartContainer
                    config={{
                      requests: { label: "Requests", color: "#3b82f6" },
                      completed: { label: "Completed", color: "#10b981" },
                      failed: { label: "Failed", color: "#ef4444" },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <ReBarChart
                        data={monthlyData}
                        margin={{ top: 16, right: 16, left: 0, bottom: 16 }}
                        barCategoryGap={20}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="month"
                          tick={{ fontSize: 14, fill: "#64748b" }}
                        />
                        <YAxis tick={{ fontSize: 14, fill: "#64748b" }} />
                        <ChartTooltip />
                        <ChartLegend />
                        <Bar
                          dataKey="requests"
                          fill="#3b82f6"
                          name="Requests"
                          radius={[8, 8, 0, 0]}
                        />
                        <Bar
                          dataKey="completed"
                          fill="#10b981"
                          name="Completed"
                          radius={[8, 8, 0, 0]}
                        />
                        <Bar
                          dataKey="failed"
                          fill="#ef4444"
                          name="Failed"
                          radius={[8, 8, 0, 0]}
                        />
                      </ReBarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Divider */}
          <div className="w-full h-px lg:h-80 lg:w-px bg-gray-200 my-6 lg:mx-6 rounded-full shadow-sm" />

          {/* Pie Chart */}
          <div className="w-full lg:w-[400px] flex-shrink-0 flex justify-center">
            <Card className="bg-white shadow-lg rounded-xl p-4 w-full flex flex-col items-center">
              <CardHeader className="w-full">
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="w-5 h-5 text-orange-500" />
                  <span>Request Status Distribution</span>
                </CardTitle>
                <CardDescription>
                  Current distribution of request statuses
                </CardDescription>
              </CardHeader>
              <CardContent className="w-full flex flex-col items-center">
                <div className="w-full h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={statusData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        label={({ name, percent }) =>
                          `${name} (${Math.round(percent * 100)}%)`
                        }
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip />
                      <ChartLegend />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">{total}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>

                <div className="space-y-3 mt-6 w-full">
                  {statusData.map((item) => (
                    <div
                      className="flex items-center justify-between"
                      key={item.name}
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-sm text-gray-600 font-semibold">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {item.value} (
                        {Math.round((item.value / total) * 100)}%)
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Performance Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Performance Metrics</span>
          </CardTitle>
          <CardDescription>
            Key performance indicators and system health metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ProgressBar label="System Uptime" value="99.9%" color="bg-green-500" />
            <ProgressBar label="API Response Rate" value="94.2%" color="bg-blue-500" />
            <ProgressBar label="Data Accuracy" value="98.7%" color="bg-purple-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* Helper Components */
function SummaryCard({ title, icon, value, subtitle, bgColor, textColor }) {
  return (
    <div
      className={`${bgColor} rounded-2xl shadow p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:scale-105 cursor-pointer`}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-700 font-medium">{title}</span>
        {icon}
      </div>
      <div className="text-4xl font-bold text-gray-900 mb-1">{value}</div>
      <div className={`${textColor} text-sm font-medium`}>{subtitle}</div>
    </div>
  );
}

function ProgressBar({ label, value, color }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        <span className={`text-sm font-bold ${color.replace("bg-", "text-")}`}>
          {value}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full`}
          style={{ width: value }}
        ></div>
      </div>
    </div>
  );
}
