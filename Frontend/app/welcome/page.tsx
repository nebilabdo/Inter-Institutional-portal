"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  User,
  ShieldCheck,
  Database,
  LayoutDashboard,
} from "lucide-react";

const colors = [
  "#ffffff",
  "#ff6b6b",
  "#ffd93d",
  "#6bcB77",
  "#4d88ff",
  "#bb86fc",
  "#ff9f43",
];

const tagline = "Empowering secure data collaboration across institutions.";

export default function WelcomePage() {
  const router = useRouter();
  const [displayedTagline, setDisplayedTagline] = useState("");

  // Typewriter effect for tagline
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedTagline(tagline.slice(0, i + 1));
      i++;
      if (i === tagline.length) clearInterval(interval);
    }, 35);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#6da7cb] to-[#a0c7e0] overflow-hidden px-4 py-12">
      {/* Animated sparkles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(50)].map((_, i) => {
          const color = colors[Math.floor(Math.random() * colors.length)];
          return (
            <span
              key={i}
              className="absolute w-2 h-2 rounded-full animate-sprinkle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 5}s`,
                backgroundColor: color,
                filter: `drop-shadow(0 0 4px ${color})`,
              }}
            />
          );
        })}
      </div>

      {/* Content container */}
      <div className="relative z-10 max-w-5xl mx-auto text-center animate-fade-in">
        {/* Logo & Tagline */}
        <div className="flex justify-center mb-4">
          <div className="bg-white text-[#2c4a61] px-8 py-3 rounded-full text-5xl font-[Italianno] italic shadow-md">
            Mesob
          </div>
        </div>
        <h2 className="text-xl md:text-2xl text-white font-semibold mb-2">
          {displayedTagline}
        </h2>
        <p className="text-white/90 text-base md:text-lg max-w-2xl mx-auto">
          You've successfully signed in to the Mesob Data Exchange Platform.
          Manage, integrate, and collaborate on institutional data securely and
          efficiently.
        </p>

        {/* Action Buttons */}
        <div className="flex justify-center mt-6 gap-4">
          <button
            onClick={() => router.push("/provider/dashboard")}
            className="bg-[#2c4a61] hover:bg-[#1f354a] text-white font-semibold py-2.5 px-6 rounded-lg shadow-lg flex items-center gap-2 transition duration-300"
          >
            <User size={18} />
            Provider Dashboard
          </button>
          <button
            onClick={() => router.push("/consumer/dashboard")}
            className="bg-white border border-[#2c4a61] text-[#2c4a61] hover:bg-[#f0f8ff] font-semibold py-2.5 px-6 rounded-lg shadow-sm flex items-center gap-2 transition duration-300"
          >
            <ArrowRight size={18} />
            Consumer Dashboard
          </button>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 px-4">
          <div className="bg-white/80 p-6 rounded-xl shadow-md backdrop-blur-sm border">
            <ShieldCheck className="text-[#2c4a61] mb-2" size={32} />
            <h3 className="text-lg font-semibold text-[#2c4a61]">
              Secure Exchange
            </h3>
            <p className="text-gray-700 text-sm">
              Advanced encryption and access control ensure your institutional
              data is safe and protected.
            </p>
          </div>

          <div className="bg-white/80 p-6 rounded-xl shadow-md backdrop-blur-sm border">
            <Database className="text-[#2c4a61] mb-2" size={32} />
            <h3 className="text-lg font-semibold text-[#2c4a61]">
              Unified Data Hub
            </h3>
            <p className="text-gray-700 text-sm">
              Connect and manage data from multiple government and educational
              institutions in one platform.
            </p>
          </div>

          <div className="bg-white/80 p-6 rounded-xl shadow-md backdrop-blur-sm border">
            <LayoutDashboard className="text-[#2c4a61] mb-2" size={32} />
            <h3 className="text-lg font-semibold text-[#2c4a61]">
              Real-Time Dashboards
            </h3>
            <p className="text-gray-700 text-sm">
              Get visual insights into data flows and integration activities
              across departments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
