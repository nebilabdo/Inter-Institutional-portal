"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label as UI_Label } from "@/components/ui/label";
import { Textarea as UI_Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Building2, User, Save, Bell, Edit, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useToast } from "@/components/ui/use-toast";

interface ProfileData {
  institutionName: string;
  address: string;
  description: string;
  website: string;
  contactPerson: string;
  email: string;
  phone: string;
  institutionType: string;
  status: string;
  services: string[];
}

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/me", {
        credentials: "include",
      });

      if (!res.ok) {
        const errData = await res.json();
        console.error("Server returned error:", errData);
        setError(errData.error || "Unknown server error");
        return;
      }

      const data = await res.json();
      console.log("Profile data fetched:", data);

      setUserEmail(data.user?.email || "");

      setProfileData({
        institutionName: data.institution?.name || "",
        address: data.institution?.address || "",
        description: "",
        website: "",
        contactPerson: data.institution?.contact_person || "",
        email: data.user?.email || data.institution?.email || "",
        phone: data.institution?.phone || "",
        institutionType: data.institution?.type || "",
        status: data.institution?.status || "",
        services: data.institution?.services || [],
      });
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("institution");

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    if (!profileData) return;

    setProfileData((prev) => ({
      ...prev!,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!profileData) return;

    setSaving(true);
    try {
      const response = await fetch("http://localhost:5000/consumer/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          institutionName: profileData.institutionName,
          address: profileData.address,
          contactPerson: profileData.contactPerson,
          email: profileData.email,
          phone: profileData.phone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const result = await response.json();
      console.log("Profile update response:", result);

      if (result.institution) {
        setProfileData((prev) => ({
          ...prev!,
          institutionName:
            result.institution.name || prev?.institutionName || "",
          address: result.institution.address || prev?.address || "",
          contactPerson:
            result.institution.contact_person || prev?.contactPerson || "",
          phone: result.institution.phone || prev?.phone || "",
          institutionType:
            result.institution.type || prev?.institutionType || "",
          status: result.institution.status || prev?.status || "",
          services: result.institution.services || prev?.services || [],
        }));
      }

      if (result.user?.email) {
        setUserEmail(result.user.email);
        setProfileData((prev) => ({
          ...prev!,
          email: result.user.email,
        }));
      }

      toast({
        title: "Success",
        description: result.message || "Profile updated successfully",
      });

      setIsEditing(false);
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout userRole="consumer">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <p>Loading profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout userRole="consumer">
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">Error: {error}</p>
          <Button onClick={fetchProfile} className="ml-4">
            Retry
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  if (!profileData) {
    return (
      <DashboardLayout userRole="consumer">
        <div className="flex items-center justify-center h-64">
          <p>No profile data found.</p>
          <Button onClick={fetchProfile} className="ml-4">
            Retry
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="consumer">
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Profile Settings
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your institution information and preferences
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-sm">
              {profileData.status}
            </Badge>
            <Badge variant="outline" className="text-sm">
              {profileData.institutionType}
            </Badge>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "outline" : "default"}
              disabled={saving}
            >
              <Edit className="h-4 w-4 mr-2" />
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid grid-cols-3 w-full lg:w-[500px]">
            <TabsTrigger value="institution">Institution</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>

          {/* Institution Tab */}
          <TabsContent value="institution" className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Institution Information
                </CardTitle>
                <CardDescription>
                  Basic information about your institution
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <UI_Label htmlFor="institutionName">
                      Institution Name *
                    </UI_Label>
                    <Input
                      id="institutionName"
                      value={profileData.institutionName}
                      onChange={(e) =>
                        handleInputChange("institutionName", e.target.value)
                      }
                      disabled={!isEditing || saving}
                    />
                  </div>
                  <div className="space-y-2">
                    <UI_Label htmlFor="institutionType">
                      Institution Type
                    </UI_Label>
                    <Input
                      id="institutionType"
                      value={profileData.institutionType}
                      disabled={true}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <UI_Label htmlFor="address">Address</UI_Label>
                  <UI_Textarea
                    id="address"
                    value={profileData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    disabled={!isEditing || saving}
                    className="min-h-[80px]"
                  />
                </div>

                {isEditing && (
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSave}
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Contact Information
                </CardTitle>
                <CardDescription>
                  Primary contact details (Email is used for login)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <UI_Label htmlFor="contactPerson">
                      Contact Person *
                    </UI_Label>
                    <Input
                      id="contactPerson"
                      value={profileData.contactPerson}
                      onChange={(e) =>
                        handleInputChange("contactPerson", e.target.value)
                      }
                      disabled={!isEditing || saving}
                    />
                  </div>
                  <div className="space-y-2">
                    <UI_Label htmlFor="email">Login Email Address *</UI_Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      disabled={!isEditing || saving}
                      placeholder="This email is used for login"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      This email will be used for logging into the system
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <UI_Label htmlFor="phone">Phone Number *</UI_Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      disabled={!isEditing || saving}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSave}
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Institution Services
                </CardTitle>
                <CardDescription>
                  Services provided by your institution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profileData.services.length > 0 ? (
                    <ul className="space-y-2">
                      {profileData.services.map((service, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          <span>{service}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No services listed</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
