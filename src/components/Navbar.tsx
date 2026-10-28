"use client";

import React, { useState } from "react";
import Link from "next/link";
import BrandLogo from "./BrandLogo";
import { Menu, X, ArrowUpRight } from "lucide-react";

interface NavbarProps {
  onTryItFree?: () => void;
}

export default function Navbar({ onTryItFree }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleTryFree = () => {
    setMobileMenuOpen(false);
    if (onTryItFree) {
      onTryItFree();
    } else {
      const inputSection = document.getElementById("input-section");
      if (inputSection) {
        inputSection.scrollIntoView({ behavior: "smooth" });
        const textarea = document.getElementById("document-input") as HTMLTextAreaElement | null;
        if (textarea) textarea.focus();
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#E8E2D5]/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#84CC16] rounded-xl p-1"
            aria-label="Explain Naija home"
          >
            <BrandLogo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
            <a
              href="#how-it-works"
              onClick={(e) => handleNavClick(e, "how-it-works")}
              className="text-sm font-medium text-[#273730] hover:text-[#0C281C] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#84CC16] after:transition-all"
            >
              How it works
            </a>
            <a
              href="#examples"
              onClick={(e) => handleNavClick(e, "examples")}
              className="text-sm font-medium text-[#273730] hover:text-[#0C281C] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#84CC16] after:transition-all"
            >
              Examples
            </a>
            <a
              href="#features"
              onClick={(e) => handleNavClick(e, "features")}
              className="text-sm font-medium text-[#273730] hover:text-[#0C281C] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#84CC16] after:transition-all"
            >
              Features
            </a>
            <a
              href="#about"
              onClick={(e) => handleNavClick(e, "about")}
              className="text-sm font-medium text-[#273730] hover:text-[#0C281C] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#84CC16] after:transition-all"
            >
              About
            </a>
          </nav>

          {/* Action Button */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={handleTryFree}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-[#0C281C] text-white hover:bg-[#143F2D] active:scale-[0.98] transition-all shadow-sm shadow-[#0C281C]/20 border border-[#184E37] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#84CC16] cursor-pointer"
            >
              <span>Try it free</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16] inline-block" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#0C281C] hover:bg-[#F2EDE2] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#84CC16]"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E8E2D5] bg-[#FDFBF7] px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-3">
            <a
              href="#how-it-works"
              onClick={(e) => handleNavClick(e, "how-it-works")}
              className="px-3 py-2.5 rounded-lg text-base font-medium text-[#1A2421] hover:bg-[#F8F5EE]"
            >
              How it works
            </a>
            <a
              href="#examples"
              onClick={(e) => handleNavClick(e, "examples")}
              className="px-3 py-2.5 rounded-lg text-base font-medium text-[#1A2421] hover:bg-[#F8F5EE]"
            >
              Examples
            </a>
            <a
              href="#features"
              onClick={(e) => handleNavClick(e, "features")}
              className="px-3 py-2.5 rounded-lg text-base font-medium text-[#1A2421] hover:bg-[#F8F5EE]"
            >
              Features
            </a>
            <a
              href="#about"
              onClick={(e) => handleNavClick(e, "about")}
              className="px-3 py-2.5 rounded-lg text-base font-medium text-[#1A2421] hover:bg-[#F8F5EE]"
            >
              About
            </a>

            <div className="pt-2 border-t border-[#E8E2D5] mt-1">
              <button
                onClick={handleTryFree}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full text-base font-semibold bg-[#0C281C] text-white hover:bg-[#143F2D] shadow-md shadow-[#0C281C]/20 cursor-pointer"
              >
                <span>Try it free</span>
                <ArrowUpRight className="w-4 h-4 text-[#84CC16]" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
