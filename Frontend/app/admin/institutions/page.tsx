"use client";

import { useEffect, useState, Suspense } from "react";
import InstitutionsContent from "./InstitutionsContentInner";
import RegisterInstitutionForm from "./RegisterInstitutionForm";
import { Button } from "@/components/ui/button";

export default function InstitutionsPage() {
  const [institutions, setInstitutions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchInstitutions = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/institutions", {
        credentials: "include",
      });
      const data = await res.json();
      setInstitutions(Array.isArray(data.institutions) ? data.institutions : []);
    } catch (error) {
      console.error("Failed to load institutions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const handleRegister = async (newInstitution: any) => {
    setShowForm(false);
    await fetchInstitutions(); // refresh list
  };

  return (
    <main className="px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Institutions</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "View All Institutions" : "Register New Institution"}
        </Button>
      </div>

      {showForm ? (
        <RegisterInstitutionForm
          onRegister={handleRegister}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <Suspense fallback={<div>Loading institutions...</div>}>
          <InstitutionsContent institutions={institutions} loading={loading} />
        </Suspense>
      )}
    </main>
  );
}
