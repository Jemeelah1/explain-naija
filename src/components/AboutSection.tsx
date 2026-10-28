import React from "react";
import { Compass, Users2, ShieldCheck } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-20 sm:py-28 bg-[#FDFBF7] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#0C281C] text-white p-8 sm:p-12 md:p-16 relative overflow-hidden shadow-2xl border border-[#184E37]">
          {/* Subtle lime decorative glow */}
          <div
            className="absolute top-0 right-0 w-96 h-96 bg-[#84CC16]/15 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-0 left-0 w-80 h-80 bg-[#1C543C]/40 rounded-full blur-2xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#BEF264] bg-[#143F2D] px-3.5 py-1.5 rounded-full border border-[#1C543C] inline-block mb-6">
              Our Mission
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Democratizing public clarity for 220+ million Nigerians.
            </h2>
            <p className="mt-6 text-base sm:text-lg text-[#D5E6DC] leading-relaxed">
              In Nigeria, official communication is often published in lengthy gazettes, dense PDF circulars, and legalistic language that feels intentionally obscure. When public notices are hard to decipher, ordinary citizens miss out on life-changing opportunities and face unfair penalties.
            </p>
            <p className="mt-4 text-base sm:text-lg text-[#D5E6DC] leading-relaxed">
              Explain Naija was created to translate that institutional complexity into crystal-clear everyday knowledge. Whether you are a roadside shop owner in Aba, a software engineer in Yaba, a student in Kano, or a civil servant in Abuja—clarity belongs to you.
            </p>

            {/* Core Values / Stats */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-[#1C543C]">
              <div className="flex items-start gap-3">
                <Users2 className="w-5 h-5 text-[#84CC16] shrink-0 mt-1" />
                <div>
                  <h4 className="text-base font-bold text-white">For Every Citizen</h4>
                  <p className="text-xs text-[#A8C7B5] mt-1">From market traders to corporate directors.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Compass className="w-5 h-5 text-[#84CC16] shrink-0 mt-1" />
                <div>
                  <h4 className="text-base font-bold text-white">Action Focused</h4>
                  <p className="text-xs text-[#A8C7B5] mt-1">Direct answers on what you need to do.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#84CC16] shrink-0 mt-1" />
                <div>
                  <h4 className="text-base font-bold text-white">Public Good</h4>
                  <p className="text-xs text-[#A8C7B5] mt-1">Built to empower informed communities.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
