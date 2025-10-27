"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
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
  AlertTriangle,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import RegisterInstitutionForm from "./RegisterInstitutionForm";

export default function InstitutionsContent() {
  const pathname = usePathname();
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

  // Remove this line as it's causing issues during build
  // if (pathname === "/notifications") return null;

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
          ? data.institutions.map((inst) => ({
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

    // Initial fetch
    fetchData();

    // Optional global refresh event
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

  // Add this check instead of the removed one
  if (pathname === "/notifications") {
    return null;
  }

  return (
    <div className="space-y-8 px-4 md:px-6 lg:px-12 py-8">
      {/* ... rest of your JSX remains the same ... */}
    </div>
  );
}

// EditInstitutionForm component remains the same...
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
      {/* Services Section */}
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
