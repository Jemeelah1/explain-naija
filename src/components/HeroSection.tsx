import React from "react";
import DocumentInputCard, { DocumentSample } from "./DocumentInputCard";
import { ShieldCheck, Globe2, Zap } from "lucide-react";

interface HeroSectionProps {
  selectedSample?: DocumentSample | null;
}

export default function HeroSection({ selectedSample }: HeroSectionProps) {
  return (
    <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden bg-[#FDFBF7]">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#E7F3EC]/50 via-[#F8F5EE]/40 to-transparent rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute top-20 right-0 w-72 h-72 bg-[#84CC16]/10 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E7F3EC] border border-[#C6E6D2] text-[#0C281C] text-xs font-semibold tracking-wider uppercase shadow-xs mb-6 sm:mb-8 animate-in fade-in duration-300">
          <span className="w-2 h-2 rounded-full bg-[#84CC16] animate-pulse" />
          <span>MADE FOR EVERYDAY NIGERIANS</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#0C281C] tracking-tight max-w-4xl mx-auto leading-[1.12]">
          Big information.{" "}
          <span className="text-[#184E37] relative inline-block">
            Made simple.
            <svg
              className="absolute -bottom-2 left-0 w-full h-3 text-[#84CC16]/70 pointer-events-none"
              viewBox="0 0 200 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <path
                d="M3 9C50 3 150 3 197 9"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-[#3E5248] max-w-2xl mx-auto leading-relaxed font-normal">
          Understand public notices, official documents, and important information in language that makes sense to you.
        </p>

        <div className="mt-10 sm:mt-12">
          <DocumentInputCard selectedSample={selectedSample} />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-[#4B5E55]">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-[#1C543C]" />
            <span>5 Nigerian Dialects & Languages</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#84CC16]" />
            <span>Instant Document Breakdown</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#1C543C]" />
            <span>Actionable Next Steps</span>
          </div>
        </div>
      </div>
    </section>
  );
}
