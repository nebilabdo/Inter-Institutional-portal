"use client";

import { ShieldCheck, FileText, MessageSquare, RefreshCcw } from "lucide-react";

const steps = [
  {
    id: 1,
    icon: <ShieldCheck className="w-6 h-6 text-blue-500" />,
    title: "Register Institution",
    description: "Sign up and get your institution verified by our admin team",
    circleColor: "bg-gradient-to-br from-blue-100 to-blue-200",
  },
  {
    id: 2,
    icon: <FileText className="w-6 h-6 text-green-500" />,
    title: "Submit Requests",
    description:
      "Create detailed API requests with specifications and requirements",
    circleColor: "bg-gradient-to-br from-green-100 to-green-200",
  },
  {
    id: 3,
    icon: <MessageSquare className="w-6 h-6 text-purple-500" />,
    title: "Review & Respond",
    description: "Providers review requests and respond with API documentation",
    circleColor: "bg-gradient-to-br from-purple-100 to-purple-200",
  },
  {
    id: 4,
    icon: <RefreshCcw className="w-6 h-6 text-pink-500" />,
    title: "Start Exchanging",
    description: "Begin secure data exchange with full admin oversight",
    circleColor: "bg-gradient-to-br from-pink-100 to-pink-200",
  },
];

export function HowItWorks() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-[#67ababff] to-blue py-20 relative overflow-hidden flex items-center">
      <div className="max-w-6xl mx-auto px-4 text-center">
        {/* Heading */}
        <p className="text-sm font-semibold text-indigo-500 uppercase mb-2">
          A Simple Process
        </p>
        <h2 className="text-4xl font-bold text-gray-900 mb-16">
          Our Working Process
        </h2>

        {/* Steps */}
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-14 md:gap-0">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="flex flex-col items-center text-center w-full md:w-1/4 relative"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 right-[-50%] w-[100%] h-[2px] border-t border-dashed border-gray-300 z-0"></div>
              )}

              {/* Step Icon Circle */}
              <div
                className={`w-16 h-16 rounded-full ${step.circleColor} shadow-md flex items-center justify-center mb-4 z-10`}
              >
                {step.icon}
              </div>

              {/* Step Title */}
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                {step.title}
              </h4>

              {/* Step Description */}
              <p className="text-sm text-gray-600 max-w-xs">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
