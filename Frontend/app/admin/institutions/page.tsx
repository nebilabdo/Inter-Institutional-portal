"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Building2, FileText, Users, Clock, CheckCircle, AlertTriangle, Search, Filter } from "lucide-react"
import { useRouter } from "next/navigation"
import { Suspense } from "react"
import axios from "axios"

interface Institution {
  id: number
  name: string
  status: string
  approved: number
}

function InstitutionsContent() {
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [loading, setLoading] = useState(true)
  const [totalUsers, setTotalUsers] = useState<string>("Loading...")
  const [usersChange, setUsersChange] = useState<string>("")
  const [institutionStats, setInstitutionStats] = useState({
    total: "Loading...",
    change: "",
  })

  const [activeTab, setActiveTab] = useState("institutions")
  const [selectedActivity, setSelectedActivity] = useState<any>(null)
  const [hasMounted, setHasMounted] = useState(false)

  const router = useRouter()

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    if (hasMounted) {
      try {
        const savedTab = localStorage.getItem("activeTab")
        if (savedTab) {
          setActiveTab(savedTab)
        }
      } catch (error) {
        console.error("Error accessing localStorage:", error)
      }
    }
  }, [hasMounted])

  useEffect(() => {
    if (hasMounted && activeTab) {
      try {
        localStorage.setItem("activeTab", activeTab)
      } catch (error) {
        console.error("Error saving to localStorage:", error)
      }
    }
  }, [activeTab, hasMounted])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const institutionsRes = await axios.get("http://localhost:5000/api/admin/institutions", {
          withCredentials: true,
        })

        const institutionsData = institutionsRes.data.institutions || institutionsRes.data

        if (Array.isArray(institutionsData)) {
          setInstitutions(institutionsData)
        } else {
          setInstitutions([])
        }

        setInstitutionStats({
          total: institutionsRes.data.total?.toString() || "0",
          change: institutionsRes.data.change || "",
        })

        const usersRes = await axios.get("http://localhost:5000/api/admin/user-stats", {
          withCredentials: true,
        })

        setTotalUsers(usersRes.data.totalUsers?.toString() || "0")
        setUsersChange(usersRes.data.change || "")
      } catch (error) {
        console.error("Failed to fetch data:", error)
        setTotalUsers("Error")
        setUsersChange("")
      } finally {
        setLoading(false)
      }
    }

    const checkAuth = async () => {
      try {
        await axios.get("http://localhost:5000/api/admin/institutions", {
          withCredentials: true,
        })
        await fetchData()
      } catch (error) {
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  const activeCount = institutions.filter((i) => i.status?.toLowerCase() === "active").length

  const pendingCount = institutions.filter((i) => i.status?.trim().toLowerCase() === "pending").length

  const suspendedCount = institutions.filter((i) => i.status?.toLowerCase() === "suspended").length

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
  ]

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
        status: "Successfully Completed",
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
        status: "Failed",
      },
    },
  ]

  if (loading) {
    return (
      <main className="px-6 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="text-lg">Loading Institutions...</div>
        </div>
      </main>
    )
  }

  return (
    <main className="px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Institutions</h1>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            Management
          </Badge>
        </div>
        <p className="text-gray-600">Manage and monitor all registered institutions in the system</p>
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="w-5 h-5" />
            <span>Institution Management</span>
          </CardTitle>
          <CardDescription>Manage and monitor registered institutions in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <p className="font-semibold text-red-900">Suspended</p>
                  <p className="text-2xl font-bold text-red-700">{suspendedCount}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">All Institutions</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Approved</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {institutions.map((institution) => (
                    <tr key={institution.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900">{institution.name}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            institution.status?.toLowerCase() === "active"
                              ? "default"
                              : institution.status?.toLowerCase() === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {institution.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{institution.approved}</td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

export default function InstitutionsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-lg">Loading Institutions...</div>
        </div>
      }
    >
      <InstitutionsContent />
    </Suspense>
  )
}
