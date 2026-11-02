"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Languages,
  Copy,
  Check,
  RotateCcw,
  Info,
  FileText,
  Loader2,
  Calendar,
  HelpCircle,
  Users,
  ArrowRight,
} from "lucide-react";

export interface BreakdownContent {
  summary: string;
  whoIsAffected: string;
  actionSteps: string[];
}

export interface DocumentSample {
  id: string;
  label: string;
  title: string;
  category: string;
  originalText: string;
  sampleBreakdown?: BreakdownContent;
  translations?: Record<string, BreakdownContent>;
}

export const SAMPLE_DOCUMENTS: DocumentSample[] = [
  {
    id: "tax-reform",
    label: "Tax Reform Notice",
    title: "Federal Inland Revenue Service (FIRS) Circular 2025/03",
    category: "Government Announcement",
    originalText:
      "Pursuant to the provisions of Section 40 of the Finance Act and subsequent statutory amendments, all designated Small and Medium Enterprises (SMEs) with an aggregate turnover exceeding the statutory threshold of ₦50,000,000 per annum are hereby mandated to effect withholding adjustments on qualifying vendor disbursements, notwithstanding prior administrative waivers, failure of which shall incur compound fiscal penalties under Section 62(b).",
  },
  {
    id: "msme-grant",
    label: "MSME Federal Grant",
    title: "Presidential Conditional Grant Scheme & Palliative Fund",
    category: "Grants & Opportunities",
    originalText:
      "The Federal Government hereby announces tranche allocations under the Presidential Conditional Grant Programme. Eligible nano-businesses within the 774 Local Government Areas are invited to submit verified National Identity Numbers (NIN), Bank Verification Numbers (BVN), and operational proof of commercial domicile to access non-repayable disbursement vouchers capped at ₦50,000 per qualifying applicant.",
  },
  {
    id: "land-title",
    label: "Land Registry Notice",
    title: "State Ministry of Physical Planning & Urban Development Gazette",
    category: "Official Documents",
    originalText:
      "Notice is hereby given that under the Urban and Regional Planning and Development Law, all holders of customary titles, deeds of assignment, and unperfected excision claims within newly delineated urban zones must present certificates of occupancy or file regularization memorandums within 90 calendar days, failing which properties will be designated non-compliant.",
  },
];

export const LANGUAGES = [
  { value: "Simple English", label: "Simple English", tag: "Most Popular" },
  { value: "Nigerian Pidgin", label: "Nigerian Pidgin", tag: "Wazobia" },
  { value: "Yoruba", label: "Yorùbá", tag: "Èdè Yorùbá" },
  { value: "Hausa", label: "Hausa", tag: "Harshen Hausa" },
  { value: "Igbo", label: "Asụsụ Igbo", tag: "Asụsụ Igbo" },
] as const;

export type SupportedLanguage = (typeof LANGUAGES)[number]["value"];

interface ContentBlock {
  type: "paragraph" | "bullet" | "numbered";
  text?: string;
  items?: string[];
}

export interface ParsedSection {
  num: number;
  title: string;
  content: string;
  blocks: ContentBlock[];
}

export interface ExplainApiResponse {
  success: boolean;
  explanation: string;
  language: string;
  model?: string;
}

/**
 * Split section body content into paragraphs, bullet lists, and numbered lists
 * without losing any text or formatting.
 */
function parseContentBlocks(content: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const lines = content.split(/\r?\n/);
  let currentList: string[] = [];
  let currentListType: "bullet" | "numbered" = "bullet";

  const flushList = () => {
    if (currentList.length > 0) {
      blocks.push({
        type: currentListType,
        items: [...currentList],
      });
      currentList = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    // Check for bullet items (- or * or •)
    const bulletMatch = trimmed.match(/^[-*•]\s+(.+)$/);
    if (bulletMatch) {
      if (currentList.length > 0 && currentListType !== "bullet") {
        flushList();
      }
      currentListType = "bullet";
      currentList.push(bulletMatch[1]);
      continue;
    }

    // Check for numbered sub-items (e.g. 1. or 1) )
    const numberedMatch = trimmed.match(/^(\d+)[\.\)]\s+(.+)$/);
    if (numberedMatch) {
      if (currentList.length > 0 && currentListType !== "numbered") {
        flushList();
      }
      currentListType = "numbered";
      currentList.push(numberedMatch[2]);
      continue;
    }

    // Regular paragraph
    flushList();
    blocks.push({ type: "paragraph", text: trimmed });
  }

  flushList();
  return blocks;
}

/**
 * Robustly parse AI output into structured sections.
 * Detects numbered headers like "1. In Plain Words:", "**1. In Plain Words:**", "1. Ni Ọ̀rọ̀ Rọ̀rùn:", etc.
 * Falls back gracefully to single explanation section so NO CONTENT is ever omitted.
 */
export function parseExplanation(text: string): ParsedSection[] {
  if (!text || typeof text !== "string") return [];

  const lines = text.split(/\r?\n/);
  const sections: { num: number; title: string; content: string }[] = [];
  let currentHeader = "";
  let currentNum = 0;
  let currentContent: string[] = [];
  let preamble: string[] = [];

  const headerRegex = /^\s*(?:#{1,6}\s*)?(?:\*\*)?([1-9]\d*)[\.\)]\s*([^\n\r]+?)(?:\*\*)?:?\s*$/;

  for (const line of lines) {
    const match = line.match(headerRegex);
    if (match) {
      const num = parseInt(match[1], 10);
      // Valid top-level section: 1-6 advancing sequentially
      if ((currentNum === 0 && num === 1) || (num > currentNum && num <= 6)) {
        if (currentHeader) {
          sections.push({
            num: currentNum,
            title: currentHeader,
            content: currentContent.join("\n").trim(),
          });
          currentContent = [];
        } else if (currentContent.length > 0) {
          preamble = currentContent;
          currentContent = [];
        }
        currentNum = num;
        currentHeader = `${num}. ${match[2].replace(/[:\*]+$/, "").trim()}`;
        continue;
      }
    }
    currentContent.push(line);
  }

  if (currentHeader) {
    sections.push({
      num: currentNum,
      title: currentHeader,
      content: currentContent.join("\n").trim(),
    });
  }

  if (sections.length === 0) {
    return [
      {
        num: 1,
        title: "Explanation Breakdown",
        content: text.trim(),
        blocks: parseContentBlocks(text.trim()),
      },
    ];
  }

  if (preamble.join("\n").trim()) {
    sections.unshift({
      num: 0,
      title: "Overview",
      content: preamble.join("\n").trim(),
    });
  }

  return sections.map((sec) => ({
    ...sec,
    blocks: parseContentBlocks(sec.content),
  }));
}

/**
 * Format markdown bold text (**text**) safely into <strong> elements
 */
function renderFormattedText(text?: string) {
  if (!text) return null;
  if (!text.includes("**")) {
    return text;
  }
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-[#0C281C]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

/**
 * Returns tailored badge colors and icons for each numbered section
 */
function getSectionStyle(num: number) {
  switch (num) {
    case 1:
      return {
        badgeClass: "bg-[#84CC16]/20 text-[#0C281C] border-[#84CC16]/40",
        icon: <Sparkles className="w-3.5 h-3.5 text-[#1C543C]" />,
      };
    case 2:
      return {
        badgeClass: "bg-[#E7F3EC] text-[#1C543C] border-[#C6E6D2]",
        icon: <Users className="w-3.5 h-3.5 text-[#1C543C]" />,
      };
    case 3:
      return {
        badgeClass: "bg-[#E7F3EC] text-[#1C543C] border-[#C6E6D2]",
        icon: <ArrowRight className="w-3.5 h-3.5 text-[#1C543C]" />,
      };
    case 4:
      return {
        badgeClass: "bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]",
        icon: <Calendar className="w-3.5 h-3.5 text-[#92400E]" />,
      };
    case 5:
      return {
        badgeClass: "bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]",
        icon: <HelpCircle className="w-3.5 h-3.5 text-[#991B1B]" />,
      };
    default:
      return {
        badgeClass: "bg-[#E7F3EC] text-[#1C543C] border-[#C6E6D2]",
        icon: <FileText className="w-3.5 h-3.5 text-[#1C543C]" />,
      };
  }
}

interface DocumentInputCardProps {
  selectedSample?: DocumentSample | null;
}

export default function DocumentInputCard({ selectedSample }: DocumentInputCardProps) {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState<SupportedLanguage>("Simple English");
  const [validationError, setValidationError] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [explanationResult, setExplanationResult] = useState<ExplainApiResponse | null>(null);
  const [activeSample, setActiveSample] = useState<DocumentSample | null>(null);
  const [copied, setCopied] = useState(false);
  const [prevSample, setPrevSample] = useState<DocumentSample | null | undefined>(selectedSample);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync state when selectedSample prop changes during user navigation
  if (selectedSample !== prevSample) {
    setPrevSample(selectedSample);
    if (selectedSample) {
      setText(selectedSample.originalText);
      setActiveSample(selectedSample);
      setValidationError("");
      setApiError(null);
      setExplanationResult(null);
    }
  }

  const loadSample = useCallback((sample: DocumentSample) => {
    setText(sample.originalText);
    setActiveSample(sample);
    setValidationError("");
    setApiError(null);
    setExplanationResult(null);
    if (textareaRef.current) {
      textareaRef.current.value = sample.originalText;
      textareaRef.current.focus();
    }
  }, []);

  // Support global custom event from external trigger buttons
  useEffect(() => {
    const handleCustomSample = (e: Event) => {
      const customEvent = e as CustomEvent<DocumentSample>;
      if (customEvent.detail) {
        loadSample(customEvent.detail);
      }
    };
    window.addEventListener("explain-naija-load-sample", handleCustomSample);
    return () => {
      window.removeEventListener("explain-naija-load-sample", handleCustomSample);
    };
  }, [loadSample]);

  // Scroll into view on explanation ready
  useEffect(() => {
    if (explanationResult) {
      const breakdownEl = document.getElementById("breakdown-preview");
      if (breakdownEl) {
        breakdownEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [explanationResult]);

  // Scroll into view when loading starts
  useEffect(() => {
    if (isLoading) {
      const loadingEl = document.getElementById("breakdown-loading");
      if (loadingEl) {
        loadingEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [isLoading]);

  // Scroll into view when error occurs
  useEffect(() => {
    if (apiError) {
      const errorEl = document.getElementById("breakdown-error");
      if (errorEl) {
        errorEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [apiError]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (validationError && e.target.value.trim().length > 0) {
      setValidationError("");
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as SupportedLanguage);
  };

  const handleClear = () => {
    setText("");
    setActiveSample(null);
    setValidationError("");
    setApiError(null);
    setExplanationResult(null);
    if (textareaRef.current) {
      textareaRef.current.value = "";
      textareaRef.current.focus();
    }
  };

  const handleExplain = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Prevent duplicate requests while already in flight
    if (isLoading) return;

    const domValue = textareaRef.current ? textareaRef.current.value : "";
    const currentText = (text && text.trim().length > 0 ? text : domValue) || "";
    const trimmed = currentText.trim();

    if (!trimmed) {
      setValidationError(
        "Please paste or type an announcement, circular, or document text first to get an explanation."
      );
      setExplanationResult(null);
      setApiError(null);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
      return;
    }

    if (trimmed.length < 10) {
      setValidationError(
        "Please enter a bit more text (at least a full sentence or paragraph) so we can provide a meaningful explanation."
      );
      setExplanationResult(null);
      setApiError(null);
      return;
    }

    if (trimmed.length > 15000) {
      setValidationError("Please submit a shorter document (under 15,000 characters).");
      setExplanationResult(null);
      setApiError(null);
      return;
    }

    if (text !== currentText) {
      setText(currentText);
    }

    setValidationError("");
    setApiError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/explain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: trimmed,
          language: language,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        const errorMsg =
          data?.error ||
          "Unable to explain this document right now. Please try again.";
        setApiError(errorMsg);
        setExplanationResult(null);
      } else {
        setExplanationResult({
          success: true,
          explanation: data.explanation,
          language: data.language,
          model: data.model || "muse-spark-1.3",
        });
        setApiError(null);
      }
    } catch (err) {
      console.error("Explain request failed:", err);
      setApiError(
        "Unable to connect to the server. Please check your internet connection and try again."
      );
      setExplanationResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const copyBreakdown = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedLangOption = LANGUAGES.find((l) => l.value === language);
  const selectedLangLabel = selectedLangOption?.label || "Simple English";

  const parsedSections = explanationResult
    ? parseExplanation(explanationResult.explanation)
    : [];

  return (
    <div
      id="input-section"
      className="w-full max-w-4xl mx-auto rounded-3xl bg-white border border-[#E8E2D5] shadow-2xl shadow-[#0C281C]/8 overflow-hidden transition-all duration-300 relative"
    >
      {/* Top subtle decorative accent bar */}
      <div className="h-2 w-full bg-gradient-to-r from-[#0C281C] via-[#1C543C] to-[#84CC16]" />

      <div className="p-6 sm:p-8 md:p-10">
        {/* Card Header with quick status and sample pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F2EDE2]">
          <div className="flex items-center gap-2.5">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#84CC16] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#84CC16]" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1C543C]">
              Document Simplifier Engine
            </span>
          </div>

          {/* Quick sample chips */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            <span className="text-[#5A6D64] font-medium hidden sm:inline">Try sample:</span>
            {SAMPLE_DOCUMENTS.map((sample) => (
              <button
                key={sample.id}
                type="button"
                disabled={isLoading}
                onClick={(e) => {
                  e.preventDefault();
                  loadSample(sample);
                }}
                className={`px-3 py-1 rounded-full border transition-all text-xs font-medium cursor-pointer ${activeSample?.id === sample.id
                    ? "bg-[#0C281C] text-white border-[#0C281C] shadow-sm"
                    : "bg-[#F8F5EE] hover:bg-[#EDE7DA] text-[#1C543C] border-[#E8E2D5]"
                  } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                title={`Load ${sample.label}`}
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form area */}
        <form onSubmit={handleExplain} className="mt-6 space-y-6">
          {/* Textarea container */}
          <div className="relative">
            <label htmlFor="document-input" className="sr-only">
              Paste notice or announcement
            </label>
            <textarea
              id="document-input"
              ref={textareaRef}
              rows={6}
              value={text}
              disabled={isLoading}
              onChange={handleTextChange}
              placeholder="Paste a notice, announcement, or anything you want explained…"
              className={`w-full rounded-2xl p-4 sm:p-5 text-base sm:text-lg text-[#1A2421] placeholder-[#8C9B93] bg-[#FCFAF6] border transition-all resize-y focus:outline-none focus:bg-white leading-relaxed ${validationError
                  ? "border-red-400 focus:ring-2 focus:ring-red-400 bg-red-50/20"
                  : "border-[#DDD5C5] focus:border-[#1C543C] focus:ring-2 focus:ring-[#84CC16]/50"
                } ${isLoading ? "opacity-75 bg-[#F9F7F2]" : ""}`}
            />

            {/* Bottom textarea utility bar */}
            <div className="flex items-center justify-between text-xs text-[#6F8279] mt-2 px-1">
              <div className="flex items-center gap-2">
                <span>{text.length} characters</span>
                {text.length > 0 && !isLoading && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="inline-flex items-center gap-1 text-[#1C543C] hover:text-[#0C281C] font-medium cursor-pointer underline underline-offset-2 ml-2"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Clear text
                  </button>
                )}
              </div>
              <span className="text-[#8C9B93] hidden sm:inline">
                Supports circulars, bills, gazettes & statements
              </span>
            </div>

            {/* Validation Message */}
            {validationError && (
              <div
                role="alert"
                className="mt-3 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-sm text-red-700 animate-in fade-in-50 duration-200"
              >
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-800">Please provide some content</p>
                  <p className="mt-0.5 text-red-700">{validationError}</p>
                </div>
              </div>
            )}
          </div>

          {/* Action Row: Language dropdown + Primary Explain button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
            {/* Language Selector */}
            <div className="relative min-w-[220px]">
              <label
                htmlFor="language-select"
                className="text-xs font-semibold uppercase tracking-wider text-[#4B5E55] block mb-1.5"
              >
                Explain in language:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#1C543C]">
                  <Languages className="w-4 h-4" />
                </div>
                <select
                  id="language-select"
                  value={language}
                  disabled={isLoading}
                  onChange={handleLanguageChange}
                  className={`w-full appearance-none rounded-xl bg-[#F8F5EE] hover:bg-[#F2EDE2] border border-[#DDD5C5] pl-10 pr-10 py-3 text-sm font-semibold text-[#0C281C] focus:outline-none focus:ring-2 focus:ring-[#84CC16] focus:border-[#1C543C] cursor-pointer transition-colors ${isLoading ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label} ({lang.tag})
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[#5A6D64]">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Explain Button */}
            <div className="flex flex-col sm:items-end justify-end pt-2 sm:pt-0">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full text-base font-semibold bg-[#0C281C] text-white hover:bg-[#143F2D] active:scale-[0.98] transition-all shadow-lg shadow-[#0C281C]/25 border border-[#184E37] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#84CC16]/60 cursor-pointer group ${isLoading ? "opacity-75 cursor-not-allowed" : ""
                  }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#84CC16]" />
                    <span>Explaining…</span>
                  </>
                ) : (
                  <>
                    <span>Explain this</span>
                    <div className="w-6 h-6 rounded-full bg-[#84CC16]/20 flex items-center justify-center group-hover:bg-[#84CC16]/30 transition-colors">
                      <Sparkles className="w-3.5 h-3.5 text-[#84CC16]" />
                    </div>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Helper message */}
          <div className="flex items-start gap-2.5 pt-3 text-xs text-[#52655D] bg-[#F8F5EE]/80 rounded-xl p-3 border border-[#E8E2D5]">
            <Info className="w-4 h-4 text-[#1C543C] shrink-0 mt-0.5" />
            <p>
              <strong className="font-semibold text-[#0C281C]">Tip:</strong> Paste text from any
              government gazette, policy paper, CBN circular, or agency announcement. You can also click the
              quick samples above to test how it works right away.
            </p>
          </div>
        </form>

        {/* Loading State Display */}
        {isLoading && (
          <div
            id="breakdown-loading"
            aria-live="polite"
            className="mt-8 pt-8 border-t border-[#E8E2D5] animate-in fade-in duration-300"
          >
            <div className="rounded-2xl bg-[#F0F8F3] border border-[#C6E6D2] p-6 sm:p-8 text-center flex flex-col items-center justify-center">
              <div className="relative mb-4">
                <div className="w-14 h-14 rounded-full bg-[#0C281C] flex items-center justify-center text-[#BEF264] shadow-lg shadow-[#0C281C]/20">
                  <Sparkles className="w-6 h-6 animate-pulse text-[#84CC16]" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#84CC16] flex items-center justify-center text-[#0C281C] shadow-sm">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                </div>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-[#0C281C]">
                Making this easier to understand…
              </h3>
              <p className="text-xs sm:text-sm text-[#3E5248] mt-1.5 max-w-md leading-relaxed">
                Muse Spark is translating official terminology into clear, structured {selectedLangLabel}.
              </p>

              {/* Pulsing placeholder skeleton */}
              <div className="w-full max-w-md mt-6 space-y-3">
                <div className="h-3 bg-[#D4E8DC] rounded-full w-3/4 mx-auto animate-pulse" />
                <div
                  className="h-3 bg-[#D4E8DC] rounded-full w-5/6 mx-auto animate-pulse"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="h-3 bg-[#D4E8DC] rounded-full w-2/3 mx-auto animate-pulse"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* API Error Display */}
        {apiError && !isLoading && (
          <div
            id="breakdown-error"
            role="alert"
            className="mt-8 pt-8 border-t border-[#E8E2D5] animate-in fade-in duration-300"
          >
            <div className="rounded-2xl bg-red-50 border border-red-200 p-5 sm:p-6 text-red-900 flex flex-col sm:flex-row items-start gap-4">
              <div className="p-2.5 rounded-xl bg-red-100 text-red-700 shrink-0 mt-0.5">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-red-900">
                  Unable to generate explanation
                </h4>
                <p className="text-xs sm:text-sm text-red-700 mt-1 leading-relaxed">
                  {apiError}
                </p>
                <div className="mt-3.5 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleExplain()}
                    className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#0C281C] hover:bg-[#143F2D] text-white transition-colors cursor-pointer"
                  >
                    Try again
                  </button>
                  <button
                    type="button"
                    onClick={() => setApiError(null)}
                    className="text-xs font-medium text-red-700 hover:text-red-900 underline underline-offset-2 cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Real AI Explanation Breakdown Section */}
        {explanationResult && !isLoading && (
          <div
            id="breakdown-preview"
            className="mt-8 pt-8 border-t border-[#E8E2D5] animate-in fade-in slide-in-from-bottom-3 duration-300"
          >
            {/* Status notice */}
            <div className="rounded-2xl bg-[#F0F8F3] border border-[#C6E6D2] p-5 mb-6">
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-[#0C281C] text-[#BEF264] shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold text-[#0C281C]">
                      Document Verified & Explained in {explanationResult.language}
                    </h4>
                    {explanationResult.model && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#BEF264] text-[#0C281C] border border-[#A3E635]">
                        Model: {explanationResult.model}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#273730] mt-1 leading-relaxed">
                    Explain Naija simplified this document into clear sections: plain language, impacted
                    groups, action steps, key dates, and unclear points.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive breakdown preview card */}
            <div className="rounded-2xl bg-[#FCFAF6] border border-[#DDD5C5] p-5 sm:p-7 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8E2D5]">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#1C543C]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0C281C]">
                    Standard Output Structure in {explanationResult.language}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyBreakdown(explanationResult.explanation)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1C543C] hover:text-[#0C281C] self-start sm:self-auto cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#84CC16]" />
                      <span>Copied {explanationResult.language} explanation!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy {explanationResult.language} explanation</span>
                    </>
                  )}
                </button>
              </div>

              {/* Breakdown body rendered in structured readable sections */}
              <div className="mt-6 space-y-6">
                {parsedSections.map((sec, sIdx) => {
                  const style = getSectionStyle(sec.num);
                  return (
                    <div key={sIdx} className="space-y-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${style.badgeClass}`}
                      >
                        {style.icon}
                        <span>{sec.title}</span>
                      </span>

                      <div className="space-y-2 text-sm sm:text-base text-[#1A2421] pl-1">
                        {sec.blocks.map((block, bIdx) => {
                          if (block.type === "paragraph") {
                            return (
                              <p
                                key={bIdx}
                                className="leading-relaxed font-normal whitespace-pre-line text-[#1A2421]"
                              >
                                {renderFormattedText(block.text)}
                              </p>
                            );
                          }
                          if (block.type === "numbered") {
                            return (
                              <ol key={bIdx} className="space-y-2 my-2">
                                {block.items?.map((item, iIdx) => (
                                  <li
                                    key={iIdx}
                                    className="flex items-start gap-2.5 text-[#273730]"
                                  >
                                    <span className="w-5 h-5 rounded-full bg-[#0C281C] text-[#BEF264] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                      {iIdx + 1}
                                    </span>
                                    <span className="leading-relaxed">
                                      {renderFormattedText(item)}
                                    </span>
                                  </li>
                                ))}
                              </ol>
                            );
                          }
                          if (block.type === "bullet") {
                            return (
                              <ul key={bIdx} className="space-y-2 my-2">
                                {block.items?.map((item, iIdx) => (
                                  <li
                                    key={iIdx}
                                    className="flex items-start gap-2.5 text-[#273730]"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16] shrink-0 mt-2" />
                                    <span className="leading-relaxed">
                                      {renderFormattedText(item)}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
