"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Building2,
  Plus,
  Eye,
  Settings,
  Search,
  User,
  Activity,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import RegisterInstitutionForm from "./RegisterInstitutionForm";

export default function InstitutionsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [institutionSearchQuery, setInstitutionSearchQuery] = useState("");
  const [institutionStatusFilter, setInstitutionStatusFilter] = useState("all");
  const [institutionTypeFilter, setInstitutionTypeFilter] = useState("all");
  const [currentInstitutionsPage, setCurrentInstitutionsPage] = useState(1);
  const [selectedInstitution, setSelectedInstitution] = useState<any>(null);
  const [openInstitutionDialog, setOpenInstitutionDialog] = useState<
    null | "view" | "edit" | "activity" | "suspend"
  >(null);
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  if (pathname === "/notifications") return null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/institutions",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        if (response.status === 401 || response.status === 403) {
          alert("Session expired. Please log in again.");
          router.push("/login");
          return;
        }

        if (!response.ok) throw new Error("Failed to fetch institutions");

        const data = await response.json();

        const mappedInstitutions = Array.isArray(data.institutions)
          ? data.institutions.map((inst) => ({
              ...inst,
              contactPerson: inst.contact_person || "",
              services: inst.services || [],
              totalRequests: inst.totalRequests || 0,
              lastActivity: inst.lastActivity || "-",
            }))
          : [];

        setInstitutions(mappedInstitutions);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching institutions:", error);
        setLoading(false);
      }
    };

    fetchData();
    const refreshHandler = () => fetchData();
    window.addEventListener("global-refresh", refreshHandler);
    return () => window.removeEventListener("global-refresh", refreshHandler);
  }, [router]);

  const filteredInstitutions = institutions.filter((institution) => {
    const matchesSearch =
      (institution.name?.toLowerCase() || "").includes(
        institutionSearchQuery.toLowerCase()
      ) ||
      (institution.contactPerson?.toLowerCase() || "").includes(
        institutionSearchQuery.toLowerCase()
      ) ||
      (institution.email?.toLowerCase() || "").includes(
        institutionSearchQuery.toLowerCase()
      );

    const matchesStatus =
      institutionStatusFilter === "all" ||
      institution.status === institutionStatusFilter;

    const matchesType =
      institutionTypeFilter === "all" || institution.type === institutionTypeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const institutionsPerPage = 5;
  const totalInstitutionsPages = Math.ceil(
    filteredInstitutions.length / institutionsPerPage
  );

  const paginatedInstitutions = filteredInstitutions.slice(
    (currentInstitutionsPage - 1) * institutionsPerPage,
    currentInstitutionsPage * institutionsPerPage
  );

  if (loading) return <p className="text-center mt-8">Loading institutions...</p>;

  return (
    <div className="space-y-8 px-4 md:px-6 lg:px-12 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Building2 className="w-6 h-6 text-gray-700" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Institutions
          </h1>
        </div>
        <Button
          className="bg-gray-800 text-white hover:bg-gray-900 w-full sm:w-auto"
          onClick={() => setOpenRegisterDialog(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Register New Institution
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by institution name, contact person, or email..."
            className="pl-10 w-full"
            value={institutionSearchQuery}
            onChange={(e) => setInstitutionSearchQuery(e.target.value)}
          />
        </div>
        <Select
          value={institutionStatusFilter}
          onValueChange={setInstitutionStatusFilter}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={institutionTypeFilter}
          onValueChange={setInstitutionTypeFilter}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Government Service">Government Service</SelectItem>
            <SelectItem value="Government Ministry">Government Ministry</SelectItem>
            <SelectItem value="Government Commission">Government Commission</SelectItem>
            <SelectItem value="Telecommunications">Telecommunications</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Institutions Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Institution
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Requests
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Activity
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedInstitutions.length > 0 ? (
                  paginatedInstitutions.map((institution) => (
                    <tr key={institution.id}>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                            <Building2 className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {institution.name}
                            </p>
                            <p className="text-xs text-gray-500">{institution.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {institution.type}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Badge
                          className={
                            institution.status?.toLowerCase() === "active"
                              ? "bg-green-100 text-green-800"
                              : institution.status?.toLowerCase() === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {institution.status
                            ? institution.status.charAt(0).toUpperCase() +
                              institution.status.slice(1).toLowerCase()
                            : "Unknown"}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        {institution.totalRequests || 0}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {institution.lastActivity || "-"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedInstitution(institution);
                              setOpenInstitutionDialog("view");
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Settings className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedInstitution(institution);
                                  setOpenInstitutionDialog("edit");
                                }}
                              >
                                <User className="w-4 h-4 mr-2" /> Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedInstitution(institution);
                                  setOpenInstitutionDialog("activity");
                                }}
                              >
                                <Activity className="w-4 h-4 mr-2" /> View Activity
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
                      No institutions found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalInstitutionsPages > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 px-4 gap-4">
          <p className="text-sm text-gray-700">
            Showing{" "}
            {Math.min(
              paginatedInstitutions.length,
              (currentInstitutionsPage - 1) * institutionsPerPage + 1
            )}
            -
            {Math.min(
              currentInstitutionsPage * institutionsPerPage,
              filteredInstitutions.length
            )}{" "}
            of {filteredInstitutions.length} institutions
          </p>
          <div className="flex space-x-2">
            <Button
              size="sm"
              disabled={currentInstitutionsPage === 1}
              onClick={() => setCurrentInstitutionsPage(currentInstitutionsPage - 1)}
            >
              Previous
            </Button>
            <Button
              size="sm"
              disabled={currentInstitutionsPage === totalInstitutionsPages}
              onClick={() => setCurrentInstitutionsPage(currentInstitutionsPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Register Institution Dialog */}
      <Dialog open={openRegisterDialog} onOpenChange={setOpenRegisterDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Register New Institution</DialogTitle>
            <DialogDescription>
              Fill out the form below to register a new institution.
            </DialogDescription>
          </DialogHeader>
          <RegisterInstitutionForm onClose={() => setOpenRegisterDialog(false)} />
        </DialogContent>
      </Dialog>

      {/* Institution Action Dialog */}
      {selectedInstitution && (
        <Dialog
          open={!!openInstitutionDialog}
          onOpenChange={() => setOpenInstitutionDialog(null)}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {openInstitutionDialog === "view" && "View Institution"}
                {openInstitutionDialog === "edit" && "Edit Institution"}
                {openInstitutionDialog === "activity" && "Institution Activity"}
              </DialogTitle>
            </DialogHeader>

            <div className="mt-4 space-y-4">
              {openInstitutionDialog === "view" && (
                <div>
                  <p><strong>Name:</strong> {selectedInstitution.name}</p>
                  <p><strong>Type:</strong> {selectedInstitution.type}</p>
                  <p><strong>Status:</strong> {selectedInstitution.status}</p>
                  <p><strong>Contact Person:</strong> {selectedInstitution.contactPerson}</p>
                  <p><strong>Email:</strong> {selectedInstitution.email}</p>
                  <p><strong>Total Requests:</strong> {selectedInstitution.totalRequests}</p>
                  <p><strong>Last Activity:</strong> {selectedInstitution.lastActivity}</p>
                </div>
              )}
              {openInstitutionDialog === "edit" && (
                <RegisterInstitutionForm
                  institution={selectedInstitution}
                  onClose={() => setOpenInstitutionDialog(null)}
                />
              )}
              {openInstitutionDialog === "activity" && (
                <div>
                  <p>Activity logs for {selectedInstitution.name} will appear here.</p>
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setOpenInstitutionDialog(null)}
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
