"use client";

import type React from "react";
import { useState, useEffect } from "react";
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

// Dynamically import components that use useRouter or usePathname
const RegisterInstitutionForm = dynamic(() => import("./RegisterInstitutionForm"), {
  ssr: false,
  loading: () => <div>Loading form...</div>
});

// Create a client-side only component that uses the hooks
function InstitutionsContentClient() {
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

  // Use useEffect to handle client-side only operations
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

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
  }, [isClient]);

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

  if (!isClient || loading) {
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
                              : "bg-red-
