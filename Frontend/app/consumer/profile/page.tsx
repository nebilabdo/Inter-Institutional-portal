"use client";

import { useState } from "react";
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
import {
  Building2,
  User,
  Save,
  Key,
  Bell,
  Eye,
  Edit,
  Shield,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";

const notificationTypes = ["email", "inApp", "sms"] as const;
type NotificationType = (typeof notificationTypes)[number];

export default function ProfilePage() {
  const [profileData, setProfileData] = useState({
    institutionName: "University of Technology",
    address: "123 University Avenue, Tech City, TC 12345",
    website: "https://www.utech.edu",
    description:
      "Leading technological university focused on innovation and research in computer science, engineering, and applied sciences.",
    focalPersonName: "Dr. Sarah Johnson",
    focalPersonTitle: "Director of IT Services",
    email: "sarah.johnson@utech.edu",
    phone: "+1 (555) 123-4567",
    alternateEmail: "it-services@utech.edu",
    alternatePhone: "+1 (555) 123-4568",
    notificationPreferences: {
      email: true,
      inApp: true,
      sms: false,
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("institution");

  const handleInputChange = (field: string, value: string | boolean) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNotificationChange = (type: NotificationType, value: boolean) => {
    setProfileData((prev) => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [type]: value,
      },
    }));
  };

  const handleSave = () => {
    console.log("Saving profile data:", profileData);
    setIsEditing(false);
  };

  const apiUsageStats = {
    totalRequests: 156,
    approvedAPIs: 8,
    monthlyUsage: 2340,
    remainingQuota: 7660,
  };

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
              Consumer Account
            </Badge>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "outline" : "default"}
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
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
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
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <UI_Label htmlFor="website">Website</UI_Label>
                    <Input
                      id="website"
                      value={profileData.website}
                      onChange={(e) =>
                        handleInputChange("website", e.target.value)
                      }
                      disabled={!isEditing}
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
                    disabled={!isEditing}
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <UI_Label htmlFor="description">
                    Institution Description
                  </UI_Label>
                  <UI_Textarea
                    id="description"
                    value={profileData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    disabled={!isEditing}
                    className="min-h-[100px]"
                  />
                </div>

                {isEditing && (
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSave}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
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
                  Primary and alternate contact details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <UI_Label htmlFor="focalPersonName">Full Name *</UI_Label>
                    <Input
                      id="focalPersonName"
                      value={profileData.focalPersonName}
                      onChange={(e) =>
                        handleInputChange("focalPersonName", e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <UI_Label htmlFor="focalPersonTitle">Job Title</UI_Label>
                    <Input
                      id="focalPersonTitle"
                      value={profileData.focalPersonTitle}
                      onChange={(e) =>
                        handleInputChange("focalPersonTitle", e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <UI_Label htmlFor="email">Email Address *</UI_Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <UI_Label htmlFor="phone">Phone Number *</UI_Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <UI_Label htmlFor="alternateEmail">
                      Alternate Email
                    </UI_Label>
                    <Input
                      id="alternateEmail"
                      type="email"
                      value={profileData.alternateEmail}
                      onChange={(e) =>
                        handleInputChange("alternateEmail", e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <UI_Label htmlFor="alternatePhone">
                      Alternate Phone
                    </UI_Label>
                    <Input
                      id="alternatePhone"
                      value={profileData.alternatePhone}
                      onChange={(e) =>
                        handleInputChange("alternatePhone", e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSave}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Configure your notification settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {notificationTypes.map((type) => (
                  <div key={type} className="flex items-center justify-between">
                    <div>
                      <UI_Label className="text-base capitalize">
                        {type} Notifications
                      </UI_Label>
                      <p className="text-sm text-gray-600">
                        Receive notifications via{" "}
                        {type === "inApp" ? "the portal" : type}
                      </p>
                    </div>
                    <Button
                      variant={
                        profileData.notificationPreferences[type]
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        handleNotificationChange(
                          type,
                          !profileData.notificationPreferences[type]
                        )
                      }
                      disabled={!isEditing}
                    >
                      {profileData.notificationPreferences[type]
                        ? "Enabled"
                        : "Disabled"}
                    </Button>
                  </div>
                ))}

                {isEditing && (
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSave}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
