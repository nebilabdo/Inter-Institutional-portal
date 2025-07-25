"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  AlertTriangle,
  FileText,
  Clock,
} from "lucide-react"

type Request = {
  id: number
  title: string
  consumer: string
  submittedDate: string
  priority: "high" | "medium" | "low"
  status: "pending"
  description: string
  requestedAttributes: string[]
  purpose: string
}

type HistoryItem = {
  id: number
  title: string
  consumer: string
  submittedDate: string
  decisionDate: string
  status: "approved" | "rejected"
  reason?: string
}

export default function IncomingRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([
    {
      id: 1,
      title: "Student Enrollment Data API",
      consumer: "University of Technology",
      submittedDate: "2024-01-16",
      priority: "high",
      status: "pending",
      description:
        "Request for real-time student enrollment data across universities",
      requestedAttributes: [
        "student_id",
        "enrollment_date",
        "course_code",
        "status",
      ],
      purpose: "Academic research and institutional reporting",
    },
    {
      id: 2,
      title: "Financial Aid Information",
      consumer: "Community College Network",
      submittedDate: "2024-01-15",
      priority: "medium",
      status: "pending",
      description:
        "Student financial aid status and history for institutional reporting",
      requestedAttributes: [
        "student_id",
        "aid_amount",
        "aid_type",
        "disbursement_date",
      ],
      purpose: "Financial aid coordination and student support services",
    },
    {
      id: 3,
      title: "Academic Performance Metrics",
      consumer: "Research Institute",
      submittedDate: "2024-01-14",
      priority: "low",
      status: "pending",
      description: "Academic performance data for educational research",
      requestedAttributes: [
        "student_id",
        "gpa",
        "credits_completed",
        "graduation_status",
      ],
      purpose: "Educational outcomes research and policy development",
    },
  ])

  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: 101,
      title: "Healthcare Provider Directory",
      consumer: "Ministry of Health",
      submittedDate: "2023-12-10",
      decisionDate: "2023-12-15",
      status: "approved",
    },
    {
      id: 102,
      title: "Sensitive Financial Data",
      consumer: "National Bank",
      submittedDate: "2023-11-28",
      decisionDate: "2023-12-05",
      status: "rejected",
      reason: "Insufficient security clearance",
    },
    {
      id: 103,
      title: "Faculty Publications",
      consumer: "Research Consortium",
      submittedDate: "2023-11-15",
      decisionDate: "2023-11-20",
      status: "approved",
    },
  ])

 

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleApprove = (requestId: number) => {
    const request = requests.find((r) => r.id === requestId)
    if (!request) return

    setRequests(requests.filter((r) => r.id !== requestId))
    setHistory([
      {
        id: requestId,
        title: request.title,
        consumer: request.consumer,
        submittedDate: request.submittedDate,
        status: "approved",
        decisionDate: new Date().toISOString().split("T")[0],
      },
      ...history,
    ])
  }

  const handleReject = (requestId: number) => {
    const request = requests.find((r) => r.id === requestId)
    if (!request) return

    setRequests(requests.filter((r) => r.id !== requestId))
    setHistory([
      {
        id: requestId,
        title: request.title,
        consumer: request.consumer,
        submittedDate: request.submittedDate,
        status: "rejected",
        decisionDate: new Date().toISOString().split("T")[0],
        reason: "Manually rejected by provider",
      },
      ...history,
    ])
  }

  const handleMoreInfo = (title: string) => {
    alert(`Requesting more info for "${title}" — implement your logic here.`)
  }

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
                              {request.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-black font-semibold">
                              <span>Requested by: {request.consumer}</span>
                              <span>Submitted: {formatDate(request.submittedDate)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4 mb-6">
                          <div>
                            <h4 className="font-medium text-sm text-gray-700 mb-2">
                              Purpose:
                            </h4>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                              {request.purpose}
                            </p>
                          </div>

                          <div>
                            <h4 className="font-medium text-sm text-gray-700 mb-2">
                              Requested Attributes:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {request.requestedAttributes.map(
                                (attr, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {attr}
                                  </Badge>
                                )
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap justify-end gap-3">
                          <Button
                            variant="outline"
                            onClick={() => handleMoreInfo(request.title)}
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
      </div>
    </DashboardLayout>
  )
}
