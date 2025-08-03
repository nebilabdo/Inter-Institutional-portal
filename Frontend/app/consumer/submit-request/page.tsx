"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Activity, ArrowRight, Check } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { v4 as uuidv4 } from "uuid";

interface Institution {
  id: string;
  name: string;
  status: "active" | "inactive" | "pending";
  description: string;
  services: string[];
  apiEndpoint?: string;
  logo?: string;
}

export default function SubmitRequestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedInstitution = searchParams.get("institution");
  const editRequestId = searchParams.get("edit");
  const resubmitRequestId = searchParams.get("resubmit");

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedInstitution, setSelectedInstitution] =
    useState<Institution | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [requestTitle, setRequestTitle] = useState("");
  const [requestDescription, setRequestDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const sliderRef = useRef<Slider>(null);
  const [requestAttributes, setRequestAttributes] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [requestPurpose, setRequestPurpose] = useState("");
  const [responseFormat, setResponseFormat] = useState("");

  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/requests/institutions", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Fetch failed");
        return res.json();
      })
      .then((data) => setInstitutions(data))
      .catch((err) => console.error("Fetch issue:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (preselectedInstitution) {
      const institution = institutions.find(
        (inst) => inst.id === preselectedInstitution
      );
      if (institution) {
        setSelectedInstitution(institution);
        setCurrentStep(2);
      }
    }
    if (editRequestId || resubmitRequestId) {
      setCurrentStep(2);
    }
  }, [preselectedInstitution, editRequestId, resubmitRequestId]);

  const handleInstitutionSelect = (institution: Institution) => {
    setSelectedInstitution(institution);
  };

  const handlePrevClick = () => {
    sliderRef.current?.slickPrev();
  };

  const handleNextClick = () => {
    sliderRef.current?.slickNext();
  };

  const getReliabilityColor = (reliability: number) => {
    if (reliability >= 99) return "text-green-600";
    if (reliability >= 97) return "text-yellow-600";
    return "text-red-600";
  };

  const getInstitutionColor = (index: number) => {
    const colors = [
      "bg-blue-50 border-blue-200",
      "bg-yellow-50 border-yellow-200",
      "bg-green-50 border-green-200",
      "bg-purple-50 border-purple-200",
    ];
    return colors[index % colors.length];
  };

  const handleServiceToggle = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const handleServiceSelectionComplete = () => {
    if (selectedServices.length > 0) {
      setCurrentStep(3);
    }
  };

  const handleSubmitRequest = async () => {
    if (!selectedInstitution) return;

    setIsSubmitting(true);

    const newRequest = {
      institutionId: selectedInstitution.id,
      institutionName: selectedInstitution.name,
      services: selectedServices,
      title: requestTitle,
      description: requestDescription,
      status: "Submitted",
    };

    try {
      const res = await fetch("http://localhost:5000/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newRequest),
      });

      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(`Failed to submit request: ${errMsg}`);
      }

      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const handleNewRequest = () => {
    setSelectedInstitution(null);
    setSelectedServices([]);
    setRequestTitle("");
    setRequestDescription("");
    setCurrentStep(1);
    setIsSubmitted(false);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    cssEase: "ease-in-out",
    arrows: false,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const institutionId = searchParams.get("institution");

  const institutionIdParam = searchParams.get("institution");

  useEffect(() => {
    if (!institutionIdParam || institutions.length === 0) return;

    const institutionId = parseInt(institutionIdParam, 10);
    const matched = institutions.find((inst) => inst.id === institutionId);

    if (matched) {
      setSelectedInstitution(matched);
      setCurrentStep(2);
    }
  }, [institutionIdParam, institutions]);

  return (
    <DashboardLayout userRole="consumer">
      <style jsx global>{`
        .slider-container {
          position: relative;
          width: 100%;
          max-width: 1080px;
          margin: 0 auto;
          padding: 0 60px 40px 60px;
          overflow: hidden;
        }

        .slick-slider {
          position: relative;
          width: 100%;
        }

        .slick-list {
          overflow: hidden;
          padding: 30px 0;
          margin: 0 -8px;
        }

        .slick-track {
          display: flex;
          align-items: stretch;
        }

        .slick-slide {
          padding: 0 8px;
          box-sizing: border-box;
          width: calc(100% / 3);
        }

        .slick-slide > div {
          height: 100%;
        }

        .slick-dots {
          position: relative;
          bottom: -20px;
          text-align: center;
        }

        .slick-dots li button:before {
          font-size: 12px;
          color: #cbd5e0;
        }

        .slick-dots li.slick-active button:before {
          color: #3b82f6;
        }

        @media (max-width: 1200px) {
          .slider-container {
            max-width: 900px;
            padding: 0 50px 40px 50px;
          }
        }

        @media (max-width: 1024px) {
          .slider-container {
            max-width: 700px;
            padding: 0 40px 40px 40px;
          }
          .slick-slide {
            width: calc(100% / 2);
          }
        }

        @media (max-width: 768px) {
          .slider-container {
            max-width: 600px;
            padding: 0 40px 40px 40px;
          }
          .slick-slide {
            width: calc(100% / 2);
          }
        }

        @media (max-width: 640px) {
          .slider-container {
            max-width: 350px;
            padding: 0 30px 40px 30px;
          }
          .slick-slide {
            width: 100%;
          }
        }

        .slick-slide:hover {
          z-index: 10 !important;
        }

        .slick-slide:hover > div {
          z-index: 10 !important;
        }
      `}</style>

      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href="/consumer/dashboard">
            <Button
              size="sm"
              className="bg-gradient-to-r from-[#D9A299] to-[#F5CBCB] px-4 hover:opacity-90"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {isSubmitted ? "Request Submitted" : "Submit New API Request"}
            </h1>
            <p className="text-gray-600 mt-1">
              {isSubmitted
                ? "Your request has been successfully submitted"
                : currentStep === 1
                ? "Choose an institution to request data from"
                : currentStep === 2
                ? "Select services for your API request"
                : "Provide details about your API requirements"}
            </p>
          </div>
        </div>
        {isSubmitted && (
          <Card className="rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-12 w-12 text-green-600" />
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                API Request Submitted Successfully!
              </h2>

              <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                Your request for {selectedServices.join(", ")} from{" "}
                {selectedInstitution?.name} has been received. You'll be
                notified when the institution responds to your request.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  onClick={() => router.push("/consumer/dashboard")}
                  className="bg-blue-600 hover:bg-blue-700 px-8"
                >
                  Return to Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={handleNewRequest}
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8"
                >
                  Submit Another Request
                </Button>
              </div>
            </div>
          </Card>
        )}
        {!isSubmitted && (
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep >= step
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-16 h-1 ${
                        currentStep > step ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {!isSubmitted && currentStep === 1 && (
          <Card className="rounded-xl shadow-lg border-0 bg-gradient-to-br from-gray-50 to-white">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
                Available Institutions
              </h2>

              <div className="slider-container relative">
                <button
                  className="absolute left-[0px] top-1/2 transform -translate-y-1/2 z-30 cursor-pointer text-gray-600 hover:text-blue-600 transition-all duration-200 bg-white rounded-full shadow-lg hover:shadow-xl border border-gray-200 w-12 h-12 flex items-center justify-center"
                  onClick={handlePrevClick}
                  type="button"
                  aria-label="Previous slide"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  className="absolute right-[0px] top-1/2 transform -translate-y-1/2 z-30 cursor-pointer text-gray-600 hover:text-blue-600 transition-all duration-200 bg-white rounded-full shadow-lg hover:shadow-xl border border-gray-200 w-12 h-12 flex items-center justify-center"
                  onClick={handleNextClick}
                  type="button"
                  aria-label="Next slide"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
                <Slider ref={sliderRef} {...settings}>
                  {institutions
                    .filter((inst) => inst.status.toLowerCase() === "active")

                    .map((institution, index) => (
                      <div key={institution.id}>
                        <div
                          onClick={() => handleInstitutionSelect(institution)}
                          onMouseEnter={() => setHoveredIndex(index)}
                          onMouseLeave={() => setHoveredIndex(null)}
                          className={`
                            h-80 flex flex-col justify-between
                            rounded-xl p-6 cursor-pointer
                            shadow-md hover:shadow-xl
                            transition-all duration-300 ease-in-out
                            ${getInstitutionColor(index)}
                            hover:scale-105 hover:-translate-y-1 hover:z-50
                            border-0 hover:border-blue-200
                            ${
                              selectedInstitution?.id === institution.id
                                ? "ring-2 ring-blue-500 border-blue-500"
                                : "border-transparent"
                            }
                            relative
                          `}
                          style={{
                            zIndex: hoveredIndex === index ? 50 : 1,
                          }}
                        >
                          <div className="flex-1">
                            <div className="flex items-center mb-4">
                              <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden">
                                {institution.logo ? (
                                  <img
                                    src={institution.logo}
                                    alt={`${institution.name} logo`}
                                    className="w-full h-full object-contain"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                    {institution.name.charAt(0)}
                                  </div>
                                )}
                              </div>
                            </div>

                            <h4 className="font-semibold text-lg mb-2 text-gray-800 line-clamp-2">
                              {institution.name}
                            </h4>

                            <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                              {institution.description}
                            </p>
                          </div>

                          {selectedInstitution?.id === institution.id && (
                            <div className="absolute top-3 right-3">
                              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </Slider>
              </div>

              {selectedInstitution && (
                <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg text-blue-900">
                        Selected: {selectedInstitution.name}
                      </h3>
                      <p className="text-blue-700 text-sm mt-1">
                        Ready to select services for your API request
                      </p>
                    </div>
                    <Button
                      onClick={() => setCurrentStep(2)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                    >
                      Select Services <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}
        {!isSubmitted && currentStep === 2 && selectedInstitution && (
          <Card className="rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold">
                  Services for {selectedInstitution.name}
                </h2>
                <p className="text-gray-600 mt-2">
                  Select one or more services for your API request
                </p>
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  className="flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" /> Change Institution
                </Button>
              </div>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedInstitution.services.map((service) => (
                  <div
                    key={service}
                    className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedServices.includes(service)
                        ? "bg-blue-50 border-blue-300 shadow-sm"
                        : "bg-white hover:bg-gray-50"
                    }`}
                    onClick={() => handleServiceToggle(service)}
                  >
                    <div
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedServices.includes(service)
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedServices.includes(service) && (
                        <Check className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <Label className="text-base font-medium cursor-pointer">
                      {service}
                    </Label>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  className="px-6"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                <Button
                  onClick={handleServiceSelectionComplete}
                  disabled={selectedServices.length === 0}
                  className="px-8 bg-blue-600 hover:bg-blue-700"
                >
                  Continue to Request Details{" "}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        )}
        {!isSubmitted && currentStep === 3 && selectedInstitution && (
          <Card className="rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold">API Request Details</h2>
                <p className="text-gray-600 mt-2">
                  Provide detailed information for your{" "}
                  {selectedInstitution.name} API request
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setCurrentStep(2)}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Change Services
              </Button>
            </div>

            <div className="space-y-8">
              {/* Selected Services */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-3">Selected Services:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedServices.map((service, index) => (
                    <Badge key={index} className="bg-blue-100 text-blue-800">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Request Title */}
              <div>
                <Label
                  htmlFor="requestTitle"
                  className="block mb-2 font-medium"
                >
                  Request Title
                </Label>
                <Input
                  id="requestTitle"
                  placeholder="e.g. Student Enrollment Data Access"
                  value={requestTitle}
                  onChange={(e) => setRequestTitle(e.target.value)}
                  className="max-w-lg"
                />
              </div>

              {/* Purpose */}
              <div>
                <Label htmlFor="purpose" className="block mb-2 font-medium">
                  Purpose of the Request
                </Label>
                <Textarea
                  id="purpose"
                  placeholder="Explain why this data is needed..."
                  value={requestPurpose}
                  onChange={(e) => setRequestPurpose(e.target.value)}
                  rows={4}
                  className="max-w-2xl"
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="block mb-2 font-medium">
                  Detailed API Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your API requirements in detail..."
                  value={requestDescription}
                  onChange={(e) => setRequestDescription(e.target.value)}
                  rows={6}
                  className="max-w-2xl"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Include specific data fields, frequency needs, or technical
                  expectations.
                </p>
              </div>

              {/* Response Format */}
              <div>
                <Label htmlFor="format" className="block mb-2 font-medium">
                  Desired Response Format
                </Label>
                <input
                  type="text"
                  id="format"
                  value="PDF"
                  readOnly
                  className="border border-gray-300 rounded px-3 py-2 max-w-xs bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* Required Attributes */}
              <div>
                <Label htmlFor="attributes" className="block mb-2 font-medium">
                  Required Data Attributes
                </Label>
                <Textarea
                  id="attributes"
                  placeholder="List of required fields (e.g. student_id, name, age, enrollment_status)..."
                  value={requestAttributes}
                  onChange={(e) => setRequestAttributes(e.target.value)}
                  rows={4}
                  className="max-w-2xl"
                />
              </div>

              {/* File Upload */}
              <div>
                <Label htmlFor="attachments" className="block mb-2 font-medium">
                  Attach Supporting Documents
                </Label>
                <Input
                  id="attachments"
                  type="file"
                  multiple
                  onChange={(e) =>
                    setAttachments(Array.from(e.target.files || []))
                  }
                  className="max-w-md"
                />
                <p className="text-sm text-gray-500 mt-1">
                  You can upload PDF specifications or sample datasets
                  (optional).
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                  className="px-6"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                <Button
                  onClick={handleSubmitRequest}
                  disabled={!requestTitle.trim() || isSubmitting}
                  className="px-8 bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
