"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import dynamic from "next/dynamic";

// Dynamically import RegisterInstitutionForm
const RegisterInstitutionForm = dynamic(() => import("./RegisterInstitutionForm"), {
  ssr: false,
  loading: () => <div>Loading form...</div>
});

export default function InstitutionsContent() {
  const router = useRouter();
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/institutions",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (response.status === 401 || response.status === 403) {
          alert("Session expired. Please log in again.");
          router.push("/login");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch institutions");
        }

        const data = await response.json();

        const mappedInstitutions = Array.isArray(data.institutions)
          ? data.institutions.map((inst: any) => ({
              ...inst,
              contactPerson: inst.contact_person || "",
            }))
          : [];

        setInstitutions(mappedInstitutions);
      } catch (error) {
        console.error("Error fetching institutions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const refreshHandler = () => {
      fetchData();
    };

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
      institutionStatusFilter === "" ||
      institutionStatusFilter === "all" ||
      institution.status === institutionStatusFilter;

    const matchesType =
      institutionTypeFilter === "" ||
      institutionTypeFilter === "all" ||
      institution.type === institutionTypeFilter;

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>Loading institutions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-4 md:px-6 lg:px-12 py-8">
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

      {/* Search and Filter */}
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
            <SelectItem value="Government Service">
              Government Service
            </SelectItem>
            <SelectItem value="Government Ministry">
              Government Ministry
            </SelectItem>
            <SelectItem value="Government Commission">
              Government Commission
            </SelectItem>
            <SelectItem value="Telecommunications">
              Telecommunications
            </SelectItem>
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
                            <p className="text-xs text-gray-500">
                              {institution.id}
                            </p>
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
                        {institution.lastActivity || "No activity"}
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
                                <Activity className="w-4 h-4 mr-2" /> View
                                Activity
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-4 text-center text-gray-500"
                    >
                      No institutions found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

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
          <div className="flex items-center space-x-2 flex-wrap justify-center sm:justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentInstitutionsPage((prev) => Math.max(1, prev - 1))
              }
              disabled={currentInstitutionsPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalInstitutionsPages }, (_, i) => (
              <Button
                key={i + 1}
                variant={
                  currentInstitutionsPage === i + 1 ? "default" : "outline"
                }
                size="sm"
                onClick={() => setCurrentInstitutionsPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentInstitutionsPage((prev) =>
                  Math.min(totalInstitutionsPages, prev + 1)
                )
              }
              disabled={currentInstitutionsPage === totalInstitutionsPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Dialogs */}
      {selectedInstitution && (
        <>
          <Dialog
            open={openInstitutionDialog === "view"}
            onOpenChange={() => setOpenInstitutionDialog(null)}
          >
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  Institution Details: {selectedInstitution.name}
                </DialogTitle>
                <DialogDescription>
                  Comprehensive information about this institution.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h2 className="text-xl font-bold mb-2">Basic Information</h2>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                    <div>
                      <span className="font-semibold text-gray-600">
                        Institution ID:{" "}
                      </span>
                      <span className="text-blue-700 font-mono underline cursor-pointer">
                        {selectedInstitution.id}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-600">
                        Name:{" "}
                      </span>
                      <span className="text-gray-900 font-medium">
                        {selectedInstitution.name}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-600">
                        Type:{" "}
                      </span>
                      <span className="text-gray-900">
                        {selectedInstitution.type}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-600">
                        Status:{" "}
                      </span>
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        {selectedInstitution.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-2">
                    Contact Information
                  </h2>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                    <div>
                      <span className="font-semibold text-gray-600">
                        Contact Person:{" "}
                      </span>
                      <span className="text-gray-900">
                        {selectedInstitution.contactPerson}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-600">
                        Email:{" "}
                      </span>
                      <span className="text-gray-900">
                        {selectedInstitution.email}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-600">
                        Phone:{" "}
                      </span>
                      <span className="text-gray-900">
                        {selectedInstitution.phone}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-600">
                        Address:{" "}
                      </span>
                      <span className="text-gray-900">
                        {selectedInstitution.address}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">Services</h2>
                <div className="bg-gray-50 rounded-xl p-4">
                  <ul className="list-disc list-inside space-y-1">
                    {selectedInstitution.services?.map(
                      (service: string, idx: number) => (
                        <li key={idx} className="text-gray-900">
                          {service}
                        </li>
                      )
                    ) || <li>No services available</li>}
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {openInstitutionDialog === "edit" && (
            <Dialog open onOpenChange={() => setOpenInstitutionDialog(null)}>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Institution</DialogTitle>
                </DialogHeader>
                <div className="max-h-[70vh] overflow-y-auto">
                  <EditInstitutionForm
                    institution={selectedInstitution}
                    onSave={async (updated) => {
                      try {
                        const response = await fetch(
                          `http://localhost:5000/api/institution/${selectedInstitution.id}`,
                          {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            credentials: "include",
                            body: JSON.stringify(updated),
                          }
                        );

                        if (!response.ok) {
                          const err = await response.json();
                          throw new Error(err.message || "Update failed");
                        }

                        setInstitutions((prev) =>
                          prev.map((inst) =>
                            inst.id === selectedInstitution.id
                              ? { ...inst, ...updated }
                              : inst
                          )
                        );

                        setOpenInstitutionDialog(null);
                        alert("Institution updated successfully!");
                      } catch (error) {
                        console.error("Update error:", error);
                        alert("Failed to update institution.");
                      }
                    }}
                    onCancel={() => setOpenInstitutionDialog(null)}
                  />
                </div>
              </DialogContent>
            </Dialog>
          )}

          <Dialog
            open={openInstitutionDialog === "activity"}
            onOpenChange={() => setOpenInstitutionDialog(null)}
          >
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogTitle>Institution Activity</DialogTitle>
              <div className="p-4">
                <p>Activity details for {selectedInstitution.name}</p>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}

      <Dialog open={openRegisterDialog} onOpenChange={setOpenRegisterDialog}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Register New Institution</DialogTitle>
            <DialogDescription>
              Fill in the details to register a new institution.
            </DialogDescription>
          </DialogHeader>
          <RegisterInstitutionForm
            onRegister={(inst) => {
              setInstitutions((prev) => [
                {
                  ...inst,
                  id: `INST-${Date.now()}`,
                  totalRequests: 0,
                  answeredRequests: 0,
                  successRate: "-",
                  lastActivity: new Date()
                    .toISOString()
                    .slice(0, 16)
                    .replace("T", " "),
                  registrationDate: new Date().toISOString().slice(0, 10),
                  roles: ["Consumer"],
                },
                ...prev,
              ]);
              setOpenRegisterDialog(false);
            }}
            onCancel={() => setOpenRegisterDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EditInstitutionForm({
  institution,
  onSave,
  onCancel,
}: {
  institution: any;
  onSave: (inst: any) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    ...institution,
    services: [...(institution.services || [])],
  });
  const [newService, setNewService] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleServiceAdd = () => {
    if (newService.trim()) {
      setForm({ ...form, services: [...form.services, newService.trim()] });
      setNewService("");
    }
  };

  const handleServiceRemove = (idx: number) => {
    setForm({
      ...form,
      services: form.services.filter((_: any, i: number) => i !== idx),
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(form);
      }}
      className="space-y-4"
    >
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name
        </label>
        <Input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full"
        />
      </div>
      <div>
        <label htmlFor="type" className="block text-sm font-medium mb-1">
          Type
        </label>
        <Input
          id="type"
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full"
        />
      </div>
      <div>
        <label htmlFor="status" className="block text-sm font-medium mb-1">
          Status
        </label>
        <Select
          value={form.status}
          onValueChange={(value) => setForm({ ...form, status: value })}
        >
          <SelectTrigger id="status" className="w-full">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label
          htmlFor="contactPerson"
          className="block text-sm font-medium mb-1"
        >
          Contact Person
        </label>
        <Input
          id="contactPerson"
          name="contactPerson"
          value={form.contactPerson}
          onChange={handleChange}
          className="w-full"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <Input
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full"
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-1">
          Phone
        </label>
        <Input
          id="phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full"
        />
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium mb-1">
          Address
        </label>
        <Input
          id="address"
          name="address"
          value={form.address}
          onChange={handleChange}
          className="w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Services</label>
        <div className="space-y-2">
          {form.services.map((service: string, idx: number) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="flex-1 text-sm">{service}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700"
                onClick={() => handleServiceRemove(idx)}
              >
                <X className="w-4 h-4 mr-1" /> Remove
              </Button>
            </div>
          ))}
          <div className="flex gap-2 mt-2">
            <Input
              type="text"
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              placeholder="Add new service"
              className="flex-1"
            />
            <Button type="button" onClick={handleServiceAdd}>
              Add
            </Button>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
