import React from "react";
import Link from "next/link";
import BrandLogo from "./BrandLogo";
import { AlertCircle } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#FAF7F0] border-t border-[#E8E2D5] pt-16 pb-12 text-[#273730]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#E8E2D5]">
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#84CC16] rounded-xl">
              <BrandLogo size="md" />
            </Link>
            <p className="text-lg font-medium text-[#0C281C] tracking-tight">
              Clarity for everyone.
            </p>
            <p className="text-sm text-[#4B5E55] max-w-md leading-relaxed">
              Converting complicated Nigerian public announcements, circulars, and official documents into simple, actionable explanations.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0C281C] mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="#how-it-works"
                  className="text-[#4B5E55] hover:text-[#0C281C] transition-colors"
                >
                  How it works
                </a>
              </li>
              <li>
                <a
                  href="#examples"
                  className="text-[#4B5E55] hover:text-[#0C281C] transition-colors"
                >
                  Examples & Scenarios
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-[#4B5E55] hover:text-[#0C281C] transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-[#4B5E55] hover:text-[#0C281C] transition-colors"
                >
                  About Our Mission
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0C281C] mb-4">
              Languages
            </h4>
            <ul className="space-y-2.5 text-sm text-[#4B5E55]">
              <li>Simple English</li>
              <li>Nigerian Pidgin (Wazobia)</li>
              <li>Èdè Yorùbá</li>
              <li>Harshen Hausa</li>
              <li>Asụsụ Igbo</li>
            </ul>
          </div>
        </div>

        <div className="my-8 rounded-2xl bg-[#F2EDE2]/70 border border-[#E2DDD1] p-4 sm:p-5 flex items-start gap-3 text-xs text-[#4B5E55] leading-relaxed">
          <AlertCircle className="w-5 h-5 text-[#1C543C] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-[#0C281C] block mb-0.5">
              Notice: Experimental AI Civic Assistant
            </span>
            <p>
              Explain Naija is an experimental AI tool designed to promote public understanding. While we strive for maximum accuracy and cultural relevance, users should verify important information, official deadlines, tax calculations, and legal requirements against the original source documents and authorized government bodies.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6F8279] pt-4">
          <p>© {currentYear} Explain Naija. All rights reserved.</p>
          <p className="flex items-center gap-1.5 font-medium text-[#1C543C]">
            <span>Crafted for Nigerians everywhere</span>
            <span aria-label="Nigeria flag">🇳🇬</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
