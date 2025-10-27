"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import dynamic from 'next/dynamic';

// Dynamically import ALL components that might use useSearchParams or useRouter
const InstitutionsContent = dynamic(() => import('./institutions-content'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="text-lg">Loading institutions...</div>
    </div>
  )
});

const RegisterInstitutionForm = dynamic(() => import('./RegisterInstitutionForm'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="text-lg">Loading registration form...</div>
    </div>
  )
});

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
    await fetchInstitutions();
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
        <InstitutionsContent institutions={institutions} loading={loading} />
      )}
    </main>
  );
}
