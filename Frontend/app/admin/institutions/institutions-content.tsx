"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2 } from "lucide-react";

interface Institution {
  id: number;
  name: string;
  status: string;
  approved: number;
}

export default function InstitutionsContent({
  institutions,
  loading,
}: {
  institutions: Institution[];
  loading: boolean;
}) {
  if (loading) {
    return <div className="flex justify-center py-10 text-lg">Loading...</div>;
  }

  if (!institutions.length) {
    return <div className="text-center py-10 text-gray-500">No institutions found.</div>;
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Building2 className="w-5 h-5 mr-2 text-blue-600" />
          <h2 className="text-xl font-semibold">Registered Institutions</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3">Name</th>
              <th className="text-left py-2 px-3">Status</th>
              <th className="text-left py-2 px-3">Approved</th>
            </tr>
          </thead>
          <tbody>
            {institutions.map((i) => (
              <tr key={i.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-3">{i.name}</td>
                <td className="py-2 px-3">
                  <Badge
                    variant={
                      i.status?.toLowerCase() === "active"
                        ? "default"
                        : i.status?.toLowerCase() === "pending"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {i.status}
                  </Badge>
                </td>
                <td className="py-2 px-3">{i.approved}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
