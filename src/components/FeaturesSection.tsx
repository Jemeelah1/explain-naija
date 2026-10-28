import React from "react";
import { MessageSquareText, Sparkles, CheckCheck, Smartphone, ShieldCheck, Zap } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: MessageSquareText,
      title: "5 Nigerian Languages",
      description:
        "Access explanations in Simple English, Nigerian Pidgin, Yorùbá, Hausa, and Asụsụ Igbo. Knowledge should not be trapped behind Queen's English.",
    },
    {
      icon: CheckCheck,
      title: "Actionable Next Steps",
      description:
        "Every explanation extracts specific deadlines, fees, required paperwork, and immediate actions so you never miss an important civic duty or grant window.",
    },
    {
      icon: Sparkles,
      title: "Zero Bureaucratic Jargon",
      description:
        "We filter out legalistic filler and administrative word salads so you can understand government policies in under 60 seconds.",
    },
    {
      icon: Smartphone,
      title: "Optimized for Low Bandwidth",
      description:
        "Built ultra-lightweight so Nigerians on mobile data connections across all 36 states and the FCT can access public clarity instantly.",
    },
    {
      icon: ShieldCheck,
      title: "Privacy First & Anonymous",
      description:
        "Paste public documents and memos freely. We do not store or track your personal identity or device history.",
    },
    {
      icon: Zap,
      title: "Context-Aware Nuance",
      description:
        "Trained specifically on Nigerian governance structures, local terms, currency realities (Naira), and statutory bodies like FIRS, CAC, and CBN.",
    },
  ];

  return (
    <section id="features" className="py-20 sm:py-28 bg-[#F8F5EE] border-t border-[#E8E2D5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#1C543C] bg-[#E7F3EC] px-3.5 py-1.5 rounded-full border border-[#C6E6D2] inline-block mb-4">
            Why Explain Naija
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0C281C] tracking-tight">
            Designed for real clarity, not generic AI summaries.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#4B5E55] leading-relaxed">
            Public institutions communicate in complex legalese. Explain Naija bridges the gap between state policies and everyday citizens.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="rounded-3xl bg-white border border-[#E2DDD1] p-7 flex flex-col justify-between hover:border-[#1C543C] hover:shadow-lg hover:shadow-[#0C281C]/5 transition-all duration-300"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#E7F3EC] text-[#0C281C] flex items-center justify-center mb-5 border border-[#C6E6D2]">
                    <Icon className="w-6 h-6 text-[#1C543C]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0C281C]">
                    {feat.title}
                  </h3>
                  <p className="mt-2.5 text-sm text-[#4B5E55] leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
