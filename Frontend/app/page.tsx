"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PowerfulFeatures } from "@/components/powerful-features";
import { HowItWorks } from "@/components/how-it-works";
import { AboutUs } from "@/components/about-us";
import { NewFooter } from "@/components/new-footer";

const heroImages = [
  "/images/image.png",
  "/images/image1.png",
  "/images/image2.png",
];

export default function VegasWebLandingPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [prevImageIndex, setPrevImageIndex] = useState(heroImages.length - 1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setPrevImageIndex(currentImageIndex);
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentImageIndex]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="min-h-screen flex flex-col bg-white text-gray-800">
      {/* Header */}
      <header className="fixed w-full top-0 z-50 py-4 px-6 flex items-center justify-between bg-white bg-opacity-95 backdrop-blur-sm shadow-sm border-b border-gray-100">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-[#6da7cb] to-[#a0c7e0] rounded-xl text-white text-lg font-bold">
              DE
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-[#6da7cb] to-[#a0c7e0] bg-clip-text text-transparent">
              DataExchange
            </h1>
          </div>
        </div>

        {/* Navigation */}
<nav className="hidden md:flex items-center space-x-6 text-lg font-bold bg-gradient-to-r from-[#6da7cb] to-[#a0c7e0] bg-clip-text text-transparent">
          <button
            onClick={() => scrollTo("hero")}
            className="hover:text-blue-600 transition"
          >
            Home
          </button>
          <button
            onClick={() => scrollTo("features")}
className="transition duration-300 transform hover:scale-105 bg-gradient-to-r from-[#6da7cb] to-[#a0c7e0] bg-clip-text text-transparent hover:from-[#5c96b8] hover:to-[#8bb8d6]"
          >
            Features
          </button>
          <button
            onClick={() => scrollTo("how-it-works")}
            className="hover:text-blue-600 transition"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollTo("about-us")}
            className="hover:text-blue-600 transition"
          >
            About Us
          </button>
        </nav>

        {/* Sign In */}
        <Link href="/login">
          <Button className="bg-[#4a6d8c] text-white hover:bg-[#3e5c73]">
            Sign In
          </Button>
        </Link>
      </header>

      {/* Hero Section */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden"
      >
        {/* Background Slideshow */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {heroImages.map((src, index) => {
            let className =
              "absolute inset-0 transition-all duration-1000 ease-in-out";

            if (index === currentImageIndex) {
              className += " opacity-80 z-10 animate-zoomFloat translate-x-0";
            } else if (index === prevImageIndex) {
              className +=
                " opacity-0 z-0 -translate-x-full pointer-events-none";
            } else {
              className +=
                " opacity-0 z-0 translate-x-full pointer-events-none";
            }

            return (
              <Image
                key={index}
                src={src}
                alt={`Slide ${index + 1}`}
                layout="fill"
                objectFit="cover"
                objectPosition="center"
                className={className}
                priority={index === 0}
                draggable={false}
              />
            );
          })}

          {/* Gradient Overlay: Always Visible */}
          <div
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              background:
                "linear-gradient(to right, #4a6d8ccc 0%, #4a6d8c33 40%, transparent 50%, #4a6d8c33 60%, #4a6d8ccc 100%)",
            }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-30 text-center px-4 max-w-4xl pointer-events-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight drop-shadow-md">
            Connecting Institutions, Sharing Data{" "}
            <span className="text-[#4a6d8c]">& Serving People.</span>
          </h1>
       <p className="text-xl md:text-2xl font-medium leading-relaxed tracking-wide text-[#dededc] mt-6 mb-10 max-w-2xl mx-auto drop-shadow-sm">
  This website helps Ethiopian government institutions share information and services easily and safely.
  You can explore what each institution offers and how they work together using digital technology.
  & Serving People.
</p>
    {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 pt-10">
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-gray-900">99.9%</span>
  <span className="text-sm text-gray-500">System Reliability</span>
</div>
<div className="flex flex-col">
  <span className="text-3xl font-bold text-gray-900">24/7</span>
  <span className="text-sm text-gray-500">Institutional Access</span>
</div>
<div className="flex flex-col">
  <span className="text-3xl font-bold text-gray-900">20+</span>
  <span className="text-sm text-gray-500">Integrated Services</span>

            </div>
          </div>
        </div>
      </section>

      {/* Sections */}
      <section id="features">
        <PowerfulFeatures />
      </section>

      <section id="how-it-works">
        <HowItWorks />
      </section>

      <section id="about-us">
        <AboutUs />
      </section>

      <NewFooter />

      {/* Animation Keyframes */}
      <style jsx>{`
        @keyframes zoomFloat {
          0% {
            transform: scale(1) translateX(0);
          }
          50% {
            transform: scale(1.05) translateX(15px);
          }
          100% {
            transform: scale(1) translateX(0);
          }
        }
        .animate-zoomFloat {
          animation: zoomFloat 20s ease-in-out infinite;
          will-change: transform;
        }
      `}</style>
    </main>
  );
}
