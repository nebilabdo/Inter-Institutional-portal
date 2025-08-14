"use client";

import { useState, useEffect, SetStateAction } from "react";
import { Building2, Search, CheckCircle2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

type Institution = {
  id: number;
  name: string;
  type: string;
  status: string;
  contact_person: string;
  email: string | null;
  phone: string;
  address: string;
  username: string;
  password: string | null;
  services: string[];
  created_at: string;
  updated_at: string;
};

interface InstitutionSelectorProps {
  selectedInstitutions: Institution[];
  onSelectionChange: (institutions: Institution[]) => void;
}

export const InstitutionSelector = ({
  selectedInstitutions,
  onSelectionChange,
}: InstitutionSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/requests/institutions",
          {
            method: "GET",
            credentials: "include", // 🔹 sends cookies/session data
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          throw new Error(
            `Failed to fetch institutions: ${res.status} ${res.statusText}`
          );
        }

        const data: Institution[] = await res.json();
        setInstitutions(data);
      } catch (err) {
        console.error("Error fetching institutions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInstitutions();
  }, []);

  const filteredInstitutions = institutions.filter(
    (institution) =>
      institution.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      institution.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInstitutionToggle = (institution: Institution) => {
    const isSelected = selectedInstitutions.some(
      (sel) => sel.id === institution.id
    );
    if (isSelected) {
      onSelectionChange(
        selectedInstitutions.filter((sel) => sel.id !== institution.id)
      );
    } else {
      onSelectionChange([...selectedInstitutions, institution]);
    }
  };

  const isSelected = (institution: Institution) =>
    selectedInstitutions.some((sel) => sel.id === institution.id);

  if (loading) return <p>Loading institutions...</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          Select Institutions
        </CardTitle>
        <CardDescription>
          Choose the institutions you want to submit your documents to
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search institutions..."
            value={searchTerm}
            onChange={(e: { target: { value: SetStateAction<string> } }) =>
              setSearchTerm(e.target.value)
            }
            className="pl-9"
          />
        </div>

        {/* Selected Institutions */}
        {selectedInstitutions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Selected ({selectedInstitutions.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedInstitutions.map((institution, index) => (
                <Badge key={institution.id} variant="default" className="gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {index + 1}. {institution.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Institution List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredInstitutions.map((institution) => (
            <div
              key={institution.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all hover:border-primary/50 ${
                isSelected(institution)
                  ? "border-primary bg-primary/5"
                  : "border-border"
              }`}
              onClick={() => handleInstitutionToggle(institution)}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={isSelected(institution)}
                  onCheckedChange={() => {}}
                  className="mt-1"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{institution.name}</h4>
                    <Badge variant="secondary">{institution.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {institution.address}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredInstitutions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Building2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No institutions found matching your search</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
