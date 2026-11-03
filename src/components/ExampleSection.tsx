"use client";

import React from "react";
import { Landmark, Award, FileText, ArrowRight, CheckCircle2 } from "lucide-react";
import { SAMPLE_DOCUMENTS, DocumentSample } from "./DocumentInputCard";

interface ExampleSectionProps {
  onSelectSample?: (sample: DocumentSample) => void;
}

export default function ExampleSection({ onSelectSample }: ExampleSectionProps) {
  const cards = [
    {
      sampleId: "tax-reform",
      title: "Government announcements",
      icon: Landmark,
      description:
        "Presidential executive orders, Central Bank circulars, new tax reforms, and fuel subsidy policies translated into everyday language.",
      tag: "Public Policy",
      typicalJargon: "“Pursuant to statutory amendments under section 40...”",
      plainMeaning: "“If your business made ₦50M, deduct tax before paying suppliers.”",
    },
    {
      sampleId: "msme-grant",
      title: "Grants and opportunities",
      icon: Award,
      description:
        "Federal MSME relief funds, presidential conditional grants, and student loans broken down with exact eligibility criteria and deadlines.",
      tag: "Financial Support",
      typicalJargon: "“Tranche allocations for non-repayable disbursement vouchers...”",
      plainMeaning: "“Small business owners get a free ₦50k grant—no repayment needed.”",
    },
    {
      sampleId: "land-title",
      title: "Official documents",
      icon: FileText,
      description:
        "Land registry regularization notices, CAC corporate annual filings, court processes, and tenancy laws explained without expensive lawyer fees.",
      tag: "Civic & Legal",
      typicalJargon: "“Customary titleholders must file regularization within 90 days...”",
      plainMeaning: "“Landlords without C of O must register their documents within 3 months.”",
    },
  ];

  const handleSampleClick = (sampleId: string) => {
    const sample = SAMPLE_DOCUMENTS.find((s) => s.id === sampleId);
    if (!sample) return;

    if (onSelectSample) {
      onSelectSample(sample);
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("explain-naija-load-sample", { detail: sample })
      );
    }

    const textarea = document.getElementById("document-input") as HTMLTextAreaElement | null;
    if (textarea) {
      textarea.value = sample.originalText;
      const event = new Event("input", { bubbles: true });
      textarea.dispatchEvent(event);
    }

    const inputSection = document.getElementById("input-section");
    if (inputSection) {
      inputSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="examples" className="py-20 sm:py-28 bg-[#F8F5EE] border-y border-[#E8E2D5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#1C543C] bg-[#E7F3EC] px-3.5 py-1.5 rounded-full border border-[#C6E6D2] inline-block mb-4">
            Real Scenarios
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0C281C] tracking-tight">
            Information shouldn’t be confusing.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#4B5E55] leading-relaxed">
            Every week, millions of Nigerians struggle through official documents written in dense administrative code. Here is what Explain Naija translates for you every day.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="rounded-3xl bg-white border border-[#E2DDD1] p-6 sm:p-8 flex flex-col justify-between hover:shadow-xl hover:shadow-[#0C281C]/5 transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#0C281C] group-hover:bg-[#84CC16] transition-colors" />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#E7F3EC] group-hover:bg-[#0C281C] text-[#0C281C] group-hover:text-[#BEF264] flex items-center justify-center transition-colors shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#1C543C] bg-[#F8F5EE] px-3 py-1 rounded-full border border-[#E8E2D5]">
                      {card.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#0C281C] group-hover:text-[#184E37] transition-colors">
                    {card.title}
                  </h3>

                  <p className="mt-3 text-sm text-[#4B5E55] leading-relaxed">
                    {card.description}
                  </p>

                  <div className="mt-6 rounded-2xl bg-[#FCFAF6] border border-[#E8E2D5] p-4 text-xs space-y-2.5">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A6455] block mb-0.5">
                        Before (Official Jargon)
                      </span>
                      <p className="italic text-[#594E46] line-clamp-2">
                        {card.typicalJargon}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-[#E8E2D5]">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#1C543C] flex items-center gap-1 mb-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#84CC16]" />
                        Explained by Us
                      </span>
                      <p className="font-semibold text-[#0C281C]">
                        {card.plainMeaning}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#F2EDE2]">
                  <button
                    type="button"
                    onClick={() => handleSampleClick(card.sampleId)}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-[#0C281C] bg-[#F8F5EE] hover:bg-[#0C281C] hover:text-white transition-all cursor-pointer group/btn"
                  >
                    <span>Try this sample</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
