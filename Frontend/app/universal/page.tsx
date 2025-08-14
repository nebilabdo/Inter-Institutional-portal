"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  InstitutionSelector,
  type Institution,
} from "@/components/InstitutionSelector";
import {
  DocumentCapture,
  type DocumentFile,
} from "@/components/DocumentCapture";
import { CustomerForm, type CustomerInfo } from "@/components/CustomerForm";
import { SubmissionQueue } from "@/components/SubmissionQueue";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Users, CheckCircle2, LogOut, User } from "lucide-react";
import Profile from "./profile/page";

const Index = () => {
  const router = useRouter();
  const [selectedInstitutions, setSelectedInstitutions] = useState<
    Institution[]
  >([]);
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: "",
  });
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const [user, setUser] = useState({
    name: "John Consumer",
    email: "john@university.edu",
    role: "Consumer",
    initials: "JC",
    avatar: "",
  });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const handleSubmissionComplete = () => {
    setSubmissionComplete(true);
  };

  const resetForm = () => {
    setSelectedInstitutions([]);
    setDocuments([]);
    setCustomerInfo({
      fullName: "",
    });
    setSubmissionComplete(false);
  };

  const handleLogout = () => {
    setIsProfileOpen(false);
    router.push("/login");
  };

  const handleSaveProfile = (updatedUser: typeof user) => {
    const newInitials = updatedUser.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    setUser({ ...updatedUser, initials: newInitials });
    setIsEditingProfile(false);
    setIsProfileOpen(false);
    alert("Profile updated successfully!");
  };

  const handleCancelProfile = () => {
    setIsEditingProfile(false);
    setIsProfileOpen(false);
  };

  if (submissionComplete) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="text-center py-12">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8 text-success" />
                  </div>
                  <h1 className="text-3xl font-bold text-success">
                    Submission Complete!
                  </h1>
                  <p className="text-muted-foreground">
                    Your documents have been successfully submitted to all
                    selected institutions.
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={resetForm}
                      className="w-full bg-[hsl(25_31%_23%)] to-[hsl(25_37%_30%)] bg-gradient-to-r hover:bg-[hsl(25_31%_17%)] hover:to-[hsl(25_31%_23%)] text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      Submit Another Application
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Document Submission Portal</h1>
              <p className="text-muted-foreground mt-1">
                Submit your documents to multiple institutions in one
                streamlined process
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm">
                  {selectedInstitutions.length} institutions
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-sm">{documents.length} documents</span>
              </div>
              {/* Profile Dropdown Trigger */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-10 h-10 bg-[#f5f5f0] rounded-full flex items-center justify-center text-gray-700 font-semibold text-sm"
                >
                  {user.initials}
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#f5f5f0] rounded-lg shadow-lg p-2 z-10">
                    <div className="text-gray-700 text-sm">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-muted-foreground">{user.email}</div>
                      <div className="text-muted-foreground">{user.role}</div>
                    </div>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        setIsEditingProfile(true);
                      }}
                      className="flex items-center gap-2 w-full text-gray-700 hover:bg-gray-100 p-2 rounded mt-2"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-gray-700 hover:bg-gray-100 p-2 rounded mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Edit Form */}
      {isEditingProfile && (
        <Profile
          user={user}
          onSave={handleSaveProfile}
          onCancel={handleCancelProfile}
        />
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Progress Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  selectedInstitutions.length > 0
                    ? "bg-success text-success-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                1
              </div>
              <span className="font-medium">Select Institutions</span>
              {selectedInstitutions.length > 0 && (
                <Badge variant="secondary">{selectedInstitutions.length}</Badge>
              )}
            </div>

            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  documents.length >= 2
                    ? "bg-success text-success-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                2
              </div>
              <span className="font-medium">Upload Documents</span>
              {documents.length > 0 && (
                <Badge variant="secondary">{documents.length}</Badge>
              )}
            </div>

            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  customerInfo.fullName
                    ? "bg-success text-success-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                3
              </div>
              <span className="font-medium">Customer Name</span>
              {customerInfo.fullName && (
                <Badge variant="secondary">Complete</Badge>
              )}
            </div>

            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted text-muted-foreground">
                4
              </div>
              <span className="font-medium">Submit</span>
            </div>
          </div>

          {/* Form Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <InstitutionSelector
                selectedInstitutions={selectedInstitutions}
                onSelectionChange={setSelectedInstitutions}
              />
              <CustomerForm
                customerInfo={customerInfo}
                onCustomerInfoChange={setCustomerInfo}
              />
            </div>

            <div className="space-y-8">
              <DocumentCapture
                documents={documents}
                onDocumentsChange={setDocuments}
              />
              <SubmissionQueue
                institutions={selectedInstitutions}
                documents={documents}
                customerInfo={customerInfo}
                onSubmissionComplete={handleSubmissionComplete}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
