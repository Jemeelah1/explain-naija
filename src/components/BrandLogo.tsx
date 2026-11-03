import React from "react";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function BrandLogo({ className = "", size = "md" }: BrandLogoProps) {
  const iconDimensions = {
    sm: "w-8 h-8",
    md: "w-9 h-9",
    lg: "w-11 h-11",
  }[size];

  const textSize = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 font-bold tracking-tight select-none ${className}`}>
      <div
        className={`${iconDimensions} rounded-xl bg-[#0C281C] text-white flex items-center justify-center shadow-md shadow-[#0C281C]/15 border border-[#184E37] relative overflow-hidden group`}
        aria-hidden="true"
      >
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#84CC16]/30 blur-sm pointer-events-none" />

        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-white transform group-hover:scale-105 transition-transform duration-200"
        >
          <path
            d="M4 6C4 4.89543 4.89543 4 6 4H14L19 9V18C19 19.1046 18.1046 20 17 20H6C4.89543 20 4 19.1046 4 18V6Z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 4V9H19"
            stroke="#84CC16"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 12H13"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          <path
            d="M8 15.5H15"
            stroke="#BEF264"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <span className={`${textSize} font-bold text-[#0C281C] tracking-tight flex items-center gap-1`}>
        Explain <span className="text-[#184E37]">Naija</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16] inline-block -ml-0.5" />
      </span>
    </div>
  );
}
