"use client"

import React from "react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard-layout"
import {
  BarChart as BarIcon,
  PieChart as PieIcon,
  LineChart as LineIcon,
  Bell,
  AlertCircle,
  CheckCircle,
  Activity,
} from "lucide-react"

const COLORS = ["#FAEAB1", "#F5CBCB", "#A2D5C6", "#AAAAAA"];

export default function AnalyticsPage() {
  const apiUsageData = [
    { month: "Jan", requests: 1200 },
    { month: "Feb", requests: 1900 },
    { month: "Mar", requests: 1500 },
    { month: "Apr", requests: 2100 },
    { month: "May", requests: 1800 },
  ]

  const consumerStats = [
    { name: "Universities", value: 45 },
    { name: "Research Institutes", value: 25 },
    { name: "Government", value: 20 },
    { name: "Others", value: 10 },
  ]

  return (
    <DashboardLayout userRole="provider">
      <div className="space-y-10">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Monitor API usage and consumer insights in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <StatCard
            title="Total API Calls"
            value="8,750"
            icon={<Bell className="h-5 w-5 text-indigo-600" />}
            bg="from-indigo-50 to-indigo-100"
            text="text-indigo-800"
            note="All time"
          />
          <StatCard
            title="Active Consumers"
            value="42"
            icon={<AlertCircle className="h-5 w-5 text-yellow-600" />}
            bg="from-yellow-50 to-yellow-100"
            text="text-yellow-800"
            note="Need attention"
          />
          <StatCard
            title="Approved Requests"
            value="18"
            icon={<CheckCircle className="h-5 w-5 text-green-600" />}
            bg="from-green-50 to-green-100"
            text="text-green-800"
            note="Recent approvals"
          />
          <StatCard
            title="Alerts"
            value="6"
            icon={<Activity className="h-5 w-5 text-purple-600" />}
            bg="from-purple-50 to-purple-100"
            text="text-purple-800"
            note="System alerts"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 shadow-md border-0 bg-gradient-to-br from-indigo-50 to-indigo-100 hover:shadow-lg transition-shadow duration-300 group">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg text-gray-700">
                API Usage (Last 6 Months)
              </h3>
              
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={apiUsageData}>
                <XAxis dataKey="month" stroke="#555" tick={{ fontSize: 12 }} />
                <YAxis stroke="#555" tick={{ fontSize: 12 }} />
                <Tooltip
                    contentStyle={{
                     backgroundColor: "#f9fafb",
                     borderColor: "#e5e7eb",
                     borderRadius: 8,
                     padding: "4px 8px",      // smaller vertical padding
                     minHeight: "auto",       // override default min-height if any
                     }}
                  labelStyle={{
                      color: "#374151",
                       fontWeight: "500",
                       fontSize: "12px",        // slightly smaller font
                       lineHeight: "16px",      // tighter line height
                       marginBottom: "2px",     // less spacing below label
                    }}
                 itemStyle={{
                      fontSize: "12px",
                      lineHeight: "14px",
                    }}
                  cursor={{ fill: "#f3f4f6" }}
                   />

                <Bar dataKey="requests" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 shadow-md border-0 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-shadow duration-300">
            <h3 className="font-semibold text-lg mb-4 text-gray-700">
              Consumer Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={consumerStats}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {consumerStats.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fefefe",
                    borderColor: "#e0e0e0",
                    borderRadius: 8,
                  }}
                  labelStyle={{ fontWeight: "500", color: "#374151", fontSize: 12 }}
                  itemStyle={{ fontSize: 12 }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

function StatCard({
  title,
  value,
  icon,
  bg,
  text,
  note,
}: {
  title: string
  value: string
  icon: React.ReactNode
  bg: string
  text: string
  note: string
}) {
  return (
    <Card className={`border-0 shadow-lg bg-gradient-to-br ${bg}`}>
      <CardHeader className="flex justify-between items-center pb-2">
        <CardTitle className={`text-sm font-medium ${text}`}>{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${text}`}>{value}</div>
        <p className={`text-xs mt-1 ${text}`}>{note}</p>
      </CardContent>
    </Card>
  )
}
