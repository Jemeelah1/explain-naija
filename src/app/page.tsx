"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ExampleSection from "@/components/ExampleSection";
import HowItWorks from "@/components/HowItWorks";
import FeaturesSection from "@/components/FeaturesSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import { DocumentSample } from "@/components/DocumentInputCard";

export default function Home() {
  const [selectedSample, setSelectedSample] = useState<DocumentSample | null>(null);

  const handleSelectSample = (sample: DocumentSample) => {
    setSelectedSample(sample);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#1A2421] selection:bg-[#BEF264] selection:text-[#0C281C]">
      {/* 1. NAVBAR */}
      <Navbar />

      <main className="flex-1">
        {/* 2. HERO SECTION (contains prominent DocumentInputCard) */}
        <HeroSection selectedSample={selectedSample} />

        {/* 3. EXAMPLE SECTION */}
        <ExampleSection onSelectSample={handleSelectSample} />

        {/* 4. HOW IT WORKS */}
        <HowItWorks />

        {/* BONUS ENHANCEMENTS: FEATURES & ABOUT */}
        <FeaturesSection />
        <AboutSection />
      </main>

      {/* 5. FOOTER */}
      <Footer />
    </div>
  );
}
