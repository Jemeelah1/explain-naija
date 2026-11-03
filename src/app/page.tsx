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
      <Navbar />

      <main className="flex-1">
        <HeroSection selectedSample={selectedSample} />
        <ExampleSection onSelectSample={handleSelectSample} />
        <HowItWorks />
        <FeaturesSection />
        <AboutSection />
      </main>

      <Footer />
    </div>
  );
}
