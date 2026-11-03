import React from "react";
import { ClipboardPaste, Languages, CheckCircle2, ArrowRight } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Paste or upload information",
      description:
        "Copy text directly from circulars, gazettes, WhatsApp messages, news announcements, or official memos into the Explain Naija simplifier.",
      icon: ClipboardPaste,
      detail: "No sign-up or paperwork required. Just paste the raw text.",
    },
    {
      number: "02",
      title: "Choose how you want it explained",
      description:
        "Select your preferred language: Simple English, Nigerian Pidgin, Yoruba, Hausa, or Igbo, adapted for everyday understanding.",
      icon: Languages,
      detail: "Preserves important Nigerian context and culturally relevant phrasing.",
    },
    {
      number: "03",
      title: "Get a clear explanation and actionable next steps",
      description:
        "Receive an immediate breakdown of what the notice actually means, who it affects, and a numbered checklist of exact steps you should take.",
      icon: CheckCircle2,
      detail: "Key dates, fees, and requirements highlighted upfront.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-[#FDFBF7] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#1C543C] bg-[#E7F3EC] px-3.5 py-1.5 rounded-full border border-[#C6E6D2] inline-block mb-4">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0C281C] tracking-tight">
            How it works
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#4B5E55] leading-relaxed">
            From confusing civil service memos to crystal-clear steps in less than 30 seconds.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative rounded-3xl bg-[#FAF7F0] border border-[#E8E2D5] p-8 flex flex-col justify-between hover:border-[#1C543C] transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-4xl font-black text-[#0C281C]/20 tracking-tighter">
                      {step.number}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-[#0C281C] text-[#BEF264] flex items-center justify-center shadow-md shadow-[#0C281C]/15 border border-[#184E37]">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-[#0C281C] leading-snug">
                    {step.title}
                  </h3>

                  <p className="mt-3.5 text-sm text-[#4B5E55] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-[#E8E2D5]/70 flex items-center gap-2 text-xs text-[#1C543C] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]" />
                  <span>{step.detail}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-14 max-w-2xl mx-auto text-center">
          <a
            href="#input-section"
            className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full text-sm font-semibold bg-[#0C281C] text-white hover:bg-[#143F2D] transition-all shadow-md shadow-[#0C281C]/15 border border-[#184E37] cursor-pointer"
          >
            <span>Try explaining your document now</span>
            <ArrowRight className="w-4 h-4 text-[#84CC16]" />
          </a>
        </div>
      </div>
    </section>
  );
}
