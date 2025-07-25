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

  const institutions: Institution[] = [
    {
      id: "ics-001",
      name: "Immigration and Citizenship Service (ICS)",
      status: "active",
      description: "Manages legal migration, travel documents, and Ethiopian citizenship.",
      services: [
        "Emergency Passport Renewal",
        "Emergency Service for Damaged or Defaced Passports",
        "Lost or Stolen Passport Replacement",
        "Emergency Temporary Residence Permit Card Issuance",
        "Emergency Permanent Residence Permit Card Issuance",
        "Emergency Investment Visa (IV) Issuance",
        "Emergency Work Visa (WV) for Private Sector Employment",
        "Emergency Issuance of Ethiopian Origin ID (Yellow Card)",
        "Issuance of Ethiopian Origin ID for Individuals Under 18 Years Old"
      ],
      apiEndpoint: "https://api.ics.gov.et/v1",
      logo: "/images/immigirations.jpg",
    },
    {
      id: "mofa-001",
      name: "Ministry of Foreign Affairs (MoFA)",
      status: "active",
      description: "Handles Ethiopia’s international relations and provides document authentication services.",
      services: ["Document Authentication"],
      apiEndpoint: "https://api.mofa.gov.et/v1",
      logo: "/images/foreign.jpg",
    },
    {
      id: "mor-001",
      name: "Ministry of Revenue (MoR)",
      status: "active",
      description: "Responsible for tax collection, customs, and revenue-related services.",
      services: ["Taxpayer Identification Number (TIN) Registration", "Business Registration Certificate"],
      apiEndpoint: "https://api.revenue.gov.et/v1",
      logo: "/images/revenue.jpg",
    },
    {
      id: "dars-001",
      name: "Documents Authentication and Registration Service (DARS)",
      status: "active",
      description: "Authenticates legal documents and registers official contracts and records.",
      services: [
        "Authentication of Contract of Loan",
        "Authentication of Power of Attorney",
        "Authentication of Contract of Property Sales",
        "Authentication of Contract of Lease",
        "Registration of Foreign Document"
      ],
      apiEndpoint: "https://api.dars.gov.et/v1",
      logo: "/images/documents authentication.jpg",
    },
    {
      id: "eaes-001",
      name: "Educational Assessment and Examination Service (EAES)",
      status: "active",
      description: "Administers national exams and certification assessments.",
      services: [
        "Educational Document Replacement Certificate",
        "Educational Document Replacement with True Copy",
        "Educational Document Authentication",
        "Giving a Supporting Letter",
        "Official Transcript",
        "True Copy"
      ],
      apiEndpoint: "https://api.eaes.gov.et/v1",
      logo: "/images/education.jpg",
    },
    {
      id: "epse-001",
      name: "Ethiopian Postal Service Enterprise (EPSE)",
      status: "active",
      description: "Provides mail, parcel, and national ID delivery services across Ethiopia.",
      services: [
        "National ID Card Printing",
        "National Examination Document Handling"
      ],
      apiEndpoint: "https://api.epse.gov.et/v1",
      logo: "/images/postal.jpg",
    },
    {
      id: "moh-001",
      name: "Ministry of Health (MoH)",
      status: "active",
      description: "Safeguards and improves public health through disease control, immunization, and health programs.",
      services: [
        "Medical Treatment Abroad (Non-Transplant)",
        "Organ Transplant Abroad",
        "Renewal of Referral Document",
        "Replacement of Referral Document",
        "New License",
        "License Renewal",
        "Replacement for Lost/Damaged License",
        "Letter of Good Standing"
      ],
      apiEndpoint: "https://api.health.gov.et/v1",
      logo: "/images/ministryOfHealth.jpg",
    },
    {
      id: "eta-001",
      name: "Education and Training Authority (ETA)",
      status: "active",
      description: "Regulates and assures quality in general, technical, vocational, and higher education.",
      services: [
        "Authentication of Educational Credentials",
        "Equivalence of Educational Credentials"
      ],
      apiEndpoint: "https://api.eta.gov.et/v1",
      logo: "/images/educationsAndTraining.jpg",
    },
    {
      id: "mols-001",
      name: "Ministry of Labor and Skills (MoLS)",
      status: "active",
      description: "Oversees labor affairs, employment policies, and skills development.",
      services: [
        "Business Registration Service",
        "Business License Issuance Service",
        "Business License Renewal Service"
      ],
      apiEndpoint: "https://api.mols.gov.et/v1",
      logo: "/images/laborAndSkill.jpg",
    },
    {
      id: "nid-001",
      name: "National ID Program",
      status: "active",
      description: "Manages the issuance and updating of National ID cards.",
      services: [
        "Registration for National ID",
        "Updating an Existing National ID",
        "Accepting Feedback and Inquiries"
      ],
      apiEndpoint: "https://api.nid.gov.et/v1",
      logo: "/images/nationalId.jpg",
    },
    {
      id: "cbe-001",
      name: "Commercial Bank of Ethiopia (CBE)",
      status: "active",
      description: "Provides banking services including account opening and digital banking solutions.",
      services: [
        "Account Opening",
        "Digital Channels (Mobile Banking, CBE Birr, Debit Card, Internet Banking)"
      ],
      apiEndpoint: "https://api.cbe.gov.et/v1",
      logo: "/images/CBE.jpg",
    },
    {
      id: "ethio-telecom-001",
      name: "Ethio Telecom",
      status: "active",
      description: "Provides telecommunications services including mobile money and enterprise solutions.",
      services: [
        "Tele Birr Service",
        "Enterprise Solutions"
      ],
      apiEndpoint: "https://api.ethiotelecom.gov.et/v1",
      logo: "/images/ethioTelecom.jpg",
    },
    {
      id: "eepa-001",
      name: "Ethiopian Environmental Protection Authority (EEPA)",
      status: "active",
      description: "Safeguards Ethiopia’s natural environment through regulations and impact assessments.",
      services: [
        "GMO-Free (Non-GMO) Live Organism Certification Service",
        "Environmental and Social Impact Assessment Approval Service - New License for Organizations",
        "Environmental and Social Impact Assessment Approval Service - License Renewal for Organizations",
        "Environmental and Social Impact Assessment Approval Service - License Upgrade for Individuals"
      ],
      apiEndpoint: "https://api.eepa.gov.et/v1",
      logo: "/images/enviromentalProtection.jpg",
    },
    {
      id: "moj-001",
      name: "Ministry of Justice (MoJ)",
      status: "active",
      description: "Oversees the administration of justice and legal reforms in Ethiopia.",
      services: [
        "Issuance of Advocates License",
        "Renewal of Licensing Advocates",
        "Upgrade the Licensing of Advocates"
      ],
      apiEndpoint: "https://api.moj.gov.et/v1",
      logo: "/images/ministryOfJustice.jpg",
    },
    {
      id: "eaa-001",
      name: "Ethiopian Agricultural Authority (EAA)",
      status: "active",
      description: "Regulates agricultural development, ensuring food security and sustainable practices.",
      services: [
        "New Certification of Agrochemical Manufacturers and Importers",
        "Renewal Certification of Agrochemical Manufacturers and Importers",
        "New Certification of Fertilizer Manufacturers and Importers",
        "Renewal Certification of Fertilizer Manufacturers and Importers",
        "New Certification of Plant and Plant Products Importers and Exporters",
        "Renewal Certification of Plant and Plant Products Importers and Exporters",
        "New Certification of Seed Producers, Importers, Distributors, and Processors",
        "Renewal Certification of Seed Producers, Importers, Distributors, and Processors",
        "New Certification of Veterinary Drug Manufacturers, Importers, Exporters, and Wholesalers"
      ],
      apiEndpoint: "https://api.eaa.gov.et/v1",
      logo: "/images/agriculture.jpg",
    },
    {
      id: "motl-001",
      name: "Ministry of Transport and Logistics (MoTL)",
      status: "active",
      description: "Oversees transportation infrastructure and logistics services.",
      services: [
        "Issuance of Commercial Road Public Transport Operators Competency License",
        "Renewal of Commercial Road Public Transport Operators Competency License",
        "Issuance of Commercial Road Freight Transport Operators Competency License",
        "Renewal of Commercial Road Freight Transport Operators Competency License",
        "Issuance of Drivers and Assistants Cross-Border Entry Permits",
        "Renewal of Drivers and Assistants Cross-Border Entry Permits"
      ],
      apiEndpoint: "https://api.motl.gov.et/v1",
      logo: "/images/transport.jpg",
    },
    {
      id: "eca-001",
      name: "Ethiopian Construction Authority (ECA)",
      status: "active",
      description: "Regulates the construction sector, ensuring quality and safety standards.",
      services: [
        "New Professional Registration",
        "Renewal Professional Registration",
        "Lost Replacement of Professional Certificate",
        "New Registration for Water Works Professional License",
        "Renewal of Water Works Professional License",
        "Upgrading for Water Works Professional License",
        "New Registration of Water Works Competency Certificate for Company",
        "Renewal of Water Works Company Competency Certificate",
        "Change Grade for Water Works Companies Competency Certification",
        "Lost Certificate Substitution for Water Works Companies"
      ],
      apiEndpoint: "https://api.eca.gov.et/v1",
      logo: "/images/construction.jpg",
    },
    {
      id: "mot-001",
      name: "Ministry of Tourism (MoT)",
      status: "active",
      description: "Promotes and regulates Ethiopia’s tourism sector.",
      services: [
        "Support Letter for Expat Professionals in Star-Rated Hotel, Resort, Lodge, Motel, Tour Operators, and Restaurant"
      ],
      apiEndpoint: "https://api.mot.gov.et/v1",
      logo: "/images/tourisim.jpg",
    },
    {
      id: "efda-001",
      name: "Ethiopian Food and Drug Authority (EFDA)",
      status: "active",
      description: "Ensures safety and quality of food, medicines, and medical devices.",
      services: [
        "New Licensing Medicine and Medical Device Importer & Wholesaler",
        "Renewal License Application Processing for Medicine and Medical Device Importer & Wholesaler",
        "Return of Certificate of Competence for Medicine and Medical Device Importer & Wholesaler",
        "Replacement of Certificate of Competence for Medicine and Medical Device Importer & Wholesaler",
        "Variation or Changes (Ownership, Technical Personnel, Product Type/Service Type or Other Change)",
        "Address Change"
      ],
      apiEndpoint: "https://api.efda.gov.et/v1",
      logo: "/images/foodAndDrug.jpg",
    },
    {
      id: "fppa-001",
      name: "Federal Public Procurement and Property Authority (FPPA)",
      status: "active",
      description: "Oversees public procurement and government asset management.",
      services: [
        "Providing Supplier Registration Service",
        "Providing Supplier Registration Revision Service"
      ],
      apiEndpoint: "https://api.fppa.gov.et/v1",
      logo: "/images/publicProcurement.jpg",
    },
    {
      id: "ecc-001",
      name: "Ethiopian Customs Commission (ECC)",
      status: "active",
      description: "Enforces customs laws, regulates imports, exports, and collects duties.",
      services: [
        "Temporary Bonded Customs Warehouse License",
        "Bonded Customs Warehouse License",
        "Private Temporary Customs Warehouse License",
        "Private Bonded Customs Warehouse License",
        "Bonded Warehouse License for Relief Items",
        "Bonded Export Factory License",
        "Bonded Export Factory Warehouse License",
        "Bonded Warehouse License for Gift Deliveries",
        "Duty-Free Goods Warehouse License",
        "Duty-Free Retail Outlet License",
        "Renewal of Temporary Bonded Customs Warehouse License",
        "Renewal of Bonded Customs Warehouse License",
        "Renewal of Private Temporary Customs Warehouse License",
        "Renewal of Private Bonded Customs Warehouse License",
        "Renewal of Bonded Warehouse License for Relief Items",
        "Renewal of Bonded Export Factory License",
        "Renewal of Bonded Export Factory Warehouse License",
        "Renewal of Bonded Warehouse License for Gift Deliveries",
        "Renewal of Duty-Free Goods Warehouse License",
        "Renewal of Duty-Free Retail Outlet License",
        "Customs Broker License",
        "Renewal of Customs Broker License"
      ],
      apiEndpoint: "https://api.ecc.gov.et/v1",
     logo: "/images/customCommision.jpg",
    },
    {
      id: "ephi-001",
      name: "Ethiopian Public Health Institute (EPHI)",
      status: "active",
      description: "Manages disease prevention, health research, and public health emergencies.",
      services: [
        "Inspection of Corpses and Human Remains Entering the Country",
        "Inspection of Corpses and Human Remains Exiting the Country"
      ],
      apiEndpoint: "https://api.ephi.gov.et/v1",
      logo: "/images/publicHealth.jpg",
    }
  ];

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

  const handleSubmitRequest = () => {
    setIsSubmitting(true);

    // Create new request object
    const newRequest = {
      id: uuidv4(),
      institutionId: selectedInstitution?.id || "",
      institutionName: selectedInstitution?.name || "",
      services: selectedServices,
      title: requestTitle,
      description: requestDescription,
      status: "Submitted",
      date: new Date().toISOString(),
    };

    // Get existing requests from localStorage
    const existingRequests = JSON.parse(
      localStorage.getItem("apiRequests") || "[]"
    );

    // Add new request
    const updatedRequests = [...existingRequests, newRequest];

    // Save to localStorage
    localStorage.setItem("apiRequests", JSON.stringify(updatedRequests));

    // Simulate API request delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
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
                    .filter((inst) => inst.status === "active")
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