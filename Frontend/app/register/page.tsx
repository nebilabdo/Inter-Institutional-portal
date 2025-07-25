"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2,
  ArrowLeft,
  CheckCircle,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
} from "lucide-react";

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    instituteName: "",
    focalPersonName: "",
    focalPersonEmail: "",
    focalPersonPhone: "",
    organizationType: "",
    address: "",
    description: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/institutions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.instituteName,
            focal_person_name: formData.focalPersonName,
            focal_person_email: formData.focalPersonEmail,
            focal_person_phone: formData.focalPersonPhone,
            organization_type: formData.organizationType,
            address: formData.address,
            contact_info: formData.description, // assuming description is contact info
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to register institution");
      }

      const data = await response.json();
      console.log("Registration success:", data);

      setIsSubmitted(true);
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center shadow-2xl border-0 bg-white/80 backdrop-blur">
          <CardHeader className="pb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-800">
              Registration Submitted!
            </CardTitle>
            <CardDescription className="text-gray-600">
              Your institution registration has been submitted for admin
              approval.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">
                  What's Next?
                </h3>
                <ul className="text-sm text-green-700 space-y-1 text-left">
                  <li>• Admin review (typically 24-48 hours)</li>
                  <li>• Email notification upon approval</li>
                  <li>• Access to your dashboard</li>
                </ul>
              </div>
            </div>
            <Link href="/">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                Return to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <Building2 className="h-7 w-7 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Register Institution
              </h1>
              <p className="text-sm text-gray-500">
                Join the data exchange network
              </p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                    currentStep >= step
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 transition-all duration-300 ${
                      currentStep > step
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600"
                        : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              {currentStep === 1 && "Institution Information"}
              {currentStep === 2 && "Contact Details"}
              {currentStep === 3 && "Review & Submit"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Tell us about your institution"}
              {currentStep === 2 && "Provide contact information"}
              {currentStep === 3 && "Review your information before submitting"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Institution Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="instituteName"
                      className="text-sm font-medium"
                    >
                      Institution Name *
                    </Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="instituteName"
                        placeholder="University of Technology"
                        value={formData.instituteName}
                        onChange={(e) =>
                          handleInputChange("instituteName", e.target.value)
                        }
                        className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="organizationType"
                      className="text-sm font-medium"
                    >
                      Organization Type *
                    </Label>
                    <Select
                      value={formData.organizationType}
                      onValueChange={(value) =>
                        handleInputChange("organizationType", value)
                      }
                      required
                    >
                      <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select organization type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consumer">
                          API Consumer - Request data from others
                        </SelectItem>
                        <SelectItem value="provider">
                          API Provider - Provide data to others
                        </SelectItem>
                        <SelectItem value="both">
                          Both Consumer & Provider
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="description"
                      className="text-sm font-medium"
                    >
                      Institution Description
                    </Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Textarea
                        id="description"
                        placeholder="Brief description of your institution and data exchange needs..."
                        value={formData.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        className="pl-10 min-h-[100px] border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Contact Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="focalPersonName"
                        className="text-sm font-medium"
                      >
                        Focal Person Name *
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="focalPersonName"
                          placeholder="John Doe"
                          value={formData.focalPersonName}
                          onChange={(e) =>
                            handleInputChange("focalPersonName", e.target.value)
                          }
                          className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="focalPersonEmail"
                        className="text-sm font-medium"
                      >
                        Email Address *
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="focalPersonEmail"
                          type="email"
                          placeholder="john.doe@university.edu"
                          value={formData.focalPersonEmail}
                          onChange={(e) =>
                            handleInputChange(
                              "focalPersonEmail",
                              e.target.value
                            )
                          }
                          className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="focalPersonPhone"
                      className="text-sm font-medium"
                    >
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="focalPersonPhone"
                        placeholder="+1 (555) 123-4567"
                        value={formData.focalPersonPhone}
                        onChange={(e) =>
                          handleInputChange("focalPersonPhone", e.target.value)
                        }
                        className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium">
                      Institution Address *
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Textarea
                        id="address"
                        placeholder="123 University Ave, City, State, ZIP"
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        className="pl-10 min-h-[80px] border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                    <h3 className="font-semibold text-lg mb-4">
                      Review Your Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Institution Name
                        </label>
                        <p className="font-medium">{formData.instituteName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Organization Type
                        </label>
                        <p className="font-medium capitalize">
                          {formData.organizationType}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Focal Person
                        </label>
                        <p className="font-medium">
                          {formData.focalPersonName}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Email
                        </label>
                        <p className="font-medium">
                          {formData.focalPersonEmail}
                        </p>
                      </div>
                    </div>

                    {formData.focalPersonPhone && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Phone
                        </label>
                        <p className="font-medium">
                          {formData.focalPersonPhone}
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Address
                      </label>
                      <p className="font-medium">{formData.address}</p>
                    </div>

                    {formData.description && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Description
                        </label>
                        <p className="font-medium">{formData.description}</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      Next Steps
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>
                        • Your registration will be reviewed by our admin team
                      </li>
                      <li>
                        • You'll receive an email notification within 24-48
                        hours
                      </li>
                      <li>• Once approved, you can access your dashboard</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                {currentStep > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="px-6 bg-transparent"
                  >
                    Previous
                  </Button>
                ) : (
                  <div></div>
                )}

                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="px-8 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </div>
                    ) : (
                      "Submit Registration"
                    )}
                  </Button>
                )}
              </div>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Already registered? </span>
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign in here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
