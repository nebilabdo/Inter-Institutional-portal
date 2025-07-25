"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Users, TrendingUp, Shield, Zap, Globe } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Data Analytics",
    description:
      "Gain insights from your data with powerful analytics tools. Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    color: "blue",
  },
  {
    icon: Users,
    title: "User Management",
    description:
      "Efficiently manage users and their permissions. Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    color: "red",
  },
  {
    icon: TrendingUp,
    title: "Growth Tracking",
    description:
      "Monitor your growth and identify key trends. Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    color: "green",
  },
  {
    icon: Shield,
    title: "Advanced Security",
    description:
      "Protect your data with industry-leading security measures. Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    color: "red",
  },
  {
    icon: Zap,
    title: "High Performance",
    description:
      "Experience lightning-fast performance for all your tasks. Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    color: "blue",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description:
      "Expand your operations with global accessibility. Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    color: "green",
  },
];

const colorClasses = {
  red: { bg: "bg-red-100", icon: "text-red-600" },
  green: { bg: "bg-green-100", icon: "text-green-600" },
  blue: { bg: "bg-blue-100", icon: "text-blue-600" },
};

export function PowerfulFeatures() {
  return (
    <section className="py-12 md:py-20 bg-[#e0f2f7]">
      <div className="container mx-auto px-4 md:px-12 max-w-[1200px] text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Powerful Features
        </h2>
        <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
          A brief description of what makes your product or service unique. We
          believe in simple, intuitive & powerful solutions.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            const colors =
              colorClasses[feature.color as keyof typeof colorClasses];
            return (
              <Card
                key={index}
                className="bg-white border-0 shadow-lg h-full w-[90%] max-w-sm transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl min-h-[16rem]"
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center mx-auto mb-4`}
                  >
                    <IconComponent className={`w-6 h-6 ${colors.icon}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
