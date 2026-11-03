"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  AlertCircle,
  Sparkles,
} from "lucide-react";

export interface ExplanationAudioControlProps {
  textToRead: string;
  language: string;
}

interface VoiceMatchResult {
  voice: SpeechSynthesisVoice | null;
  isNative: boolean;
  voiceDescription: string;
  needsFallbackConsent: boolean;
}

function cleanAndChunkText(text: string): string[] {
  if (!text) return [];

  const rawSections = text.split(/\r?\n\s*\r?\n/);
  const chunks: string[] = [];

  for (const rawSec of rawSections) {
    const trimmed = rawSec.trim();
    if (!trimmed) continue;

    const cleaned = trimmed
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/^#{1,6}\s+/gm, "")
      .replace(/^[-*•]\s+/gm, ", ")
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (cleaned) {
      chunks.push(cleaned);
    }
  }

  return chunks.length > 0 ? chunks : [text.trim()];
}

function matchVoiceForLanguage(
  voices: SpeechSynthesisVoice[],
  language: string
): VoiceMatchResult {
  if (!voices || voices.length === 0) {
    return {
      voice: null,
      isNative: false,
      voiceDescription: "Default device voice",
      needsFallbackConsent: false,
    };
  }

  const findEnNG = () =>
    voices.find(
      (v) =>
        v.lang.toLowerCase() === "en-ng" ||
        v.lang.toLowerCase().replace("_", "-") === "en-ng" ||
        v.name.toLowerCase().includes("nigeria")
    );

  const findAnyEnglish = () =>
    voices.find((v) => v.lang.toLowerCase().startsWith("en")) ||
    voices.find((v) => v.default) ||
    voices[0];

  if (language === "Simple English") {
    const enNG = findEnNG();
    if (enNG) {
      return {
        voice: enNG,
        isNative: true,
        voiceDescription: `${enNG.name} (en-NG)`,
        needsFallbackConsent: false,
      };
    }
    const anyEn = findAnyEnglish();
    return {
      voice: anyEn,
      isNative: true,
      voiceDescription: anyEn.name,
      needsFallbackConsent: false,
    };
  }

  if (language === "Nigerian Pidgin") {
    const enNG = findEnNG();
    if (enNG) {
      return {
        voice: enNG,
        isNative: true,
        voiceDescription: `${enNG.name} (en-NG)`,
        needsFallbackConsent: false,
      };
    }
    const fallbackEnglish = findAnyEnglish();
    return {
      voice: fallbackEnglish,
      isNative: false,
      voiceDescription: fallbackEnglish.name,
      needsFallbackConsent: true,
    };
  }

  if (language === "Yoruba") {
    const yoVoice = voices.find(
      (v) =>
        v.lang.toLowerCase().startsWith("yo") ||
        v.name.toLowerCase().includes("yoruba")
    );
    if (yoVoice) {
      return {
        voice: yoVoice,
        isNative: true,
        voiceDescription: `${yoVoice.name} (yo-NG)`,
        needsFallbackConsent: false,
      };
    }
    const fallbackEnglish = findAnyEnglish();
    return {
      voice: fallbackEnglish,
      isNative: false,
      voiceDescription: fallbackEnglish.name,
      needsFallbackConsent: true,
    };
  }

  if (language === "Hausa") {
    const haVoice = voices.find(
      (v) =>
        v.lang.toLowerCase().startsWith("ha") ||
        v.name.toLowerCase().includes("hausa")
    );
    if (haVoice) {
      return {
        voice: haVoice,
        isNative: true,
        voiceDescription: `${haVoice.name} (ha-NG)`,
        needsFallbackConsent: false,
      };
    }
    const fallbackEnglish = findAnyEnglish();
    return {
      voice: fallbackEnglish,
      isNative: false,
      voiceDescription: fallbackEnglish.name,
      needsFallbackConsent: true,
    };
  }

  if (language === "Igbo") {
    const igVoice = voices.find(
      (v) =>
        v.lang.toLowerCase().startsWith("ig") ||
        v.name.toLowerCase().includes("igbo")
    );
    if (igVoice) {
      return {
        voice: igVoice,
        isNative: true,
        voiceDescription: `${igVoice.name} (ig-NG)`,
        needsFallbackConsent: false,
      };
    }
    const fallbackEnglish = findAnyEnglish();
    return {
      voice: fallbackEnglish,
      isNative: false,
      voiceDescription: fallbackEnglish.name,
      needsFallbackConsent: true,
    };
  }

  const def = voices.find((v) => v.default) || voices[0];
  return {
    voice: def,
    isNative: false,
    voiceDescription: def.name,
    needsFallbackConsent: false,
  };
}

export default function ExplanationAudioControl({
  textToRead,
  language,
}: ExplanationAudioControlProps) {
  const isSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [status, setStatus] = useState<"idle" | "playing" | "paused">("idle");
  const [speed, setSpeed] = useState<number>(1.0);
  const [consentGiven, setConsentGiven] = useState(false);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);

  const speedRef = useRef(1.0);
  const currentChunkIndexRef = useRef(0);
  const isCancelledRef = useRef(false);
  const speakChunkRef = useRef<((index: number, targetRate?: number) => void) | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    const handleVoicesChanged = () => {
      const available = window.speechSynthesis.getVoices();
      if (available && available.length > 0) {
        setVoices(available);
      }
    };

    handleVoicesChanged();

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
    }

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const chunks = useMemo(() => {
    return cleanAndChunkText(textToRead);
  }, [textToRead]);

  const voiceMatch = useMemo(() => {
    return matchVoiceForLanguage(voices, language);
  }, [voices, language]);

  const speakChunk = useCallback(
    (index: number, targetRate?: number) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

      if (index >= chunks.length || isCancelledRef.current) {
        setStatus("idle");
        currentChunkIndexRef.current = 0;
        setCurrentChunkIndex(0);
        return;
      }

      window.speechSynthesis.cancel();

      const rateToUse = targetRate ?? speedRef.current;
      const utterance = new SpeechSynthesisUtterance(chunks[index]);
      utterance.rate = rateToUse;

      const activeVoice = voiceMatch.voice;
      if (activeVoice) {
        utterance.voice = activeVoice;
        utterance.lang = activeVoice.lang;
      } else {
        utterance.lang = "en-US";
      }

      utterance.onstart = () => {
        if (!isCancelledRef.current) {
          setStatus("playing");
          currentChunkIndexRef.current = index;
          setCurrentChunkIndex(index);
        }
      };

      utterance.onend = () => {
        if (isCancelledRef.current) return;
        if (index + 1 < chunks.length) {
          currentChunkIndexRef.current = index + 1;
          setCurrentChunkIndex(index + 1);
          speakChunkRef.current?.(index + 1, rateToUse);
        } else {
          setStatus("idle");
          currentChunkIndexRef.current = 0;
          setCurrentChunkIndex(0);
        }
      };

      utterance.onerror = (e) => {
        if (e.error === "canceled" || e.error === "interrupted") return;
        console.warn("Audio playback ended:", e.error);
        setStatus("idle");
      };

      window.speechSynthesis.speak(utterance);
    },
    [chunks, voiceMatch]
  );

  useEffect(() => {
    speakChunkRef.current = speakChunk;
  }, [speakChunk]);

  const handlePlay = (allowConsent: boolean = false) => {
    if (voiceMatch.needsFallbackConsent && !consentGiven && !allowConsent) {
      return;
    }

    isCancelledRef.current = false;
    currentChunkIndexRef.current = 0;
    setCurrentChunkIndex(0);
    speakChunk(0);
  };

  const handlePause = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.pause();
    setStatus("paused");
  };

  const handleResume = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setStatus("playing");
    } else {
      isCancelledRef.current = false;
      speakChunk(currentChunkIndexRef.current);
    }
  };

  const handleStop = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    isCancelledRef.current = true;
    window.speechSynthesis.cancel();
    setStatus("idle");
    currentChunkIndexRef.current = 0;
    setCurrentChunkIndex(0);
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    speedRef.current = newSpeed;

    if (status === "playing") {
      speakChunk(currentChunkIndexRef.current, newSpeed);
    }
  };

  const handleConsentAndPlay = () => {
    setConsentGiven(true);
    isCancelledRef.current = false;
    currentChunkIndexRef.current = 0;
    setCurrentChunkIndex(0);
    speakChunk(0);
  };

  if (!isSupported) {
    return (
      <div
        role="status"
        className="rounded-2xl bg-[#F8F5EE] border border-[#DDD5C5] p-4 text-xs sm:text-sm text-[#5A6D64] flex items-center gap-3 mb-6"
      >
        <VolumeX className="w-5 h-5 text-[#8C9B93] shrink-0" />
        <p>
          Speech synthesis audio is not supported in this browser. You can read the structured
          breakdown below.
        </p>
      </div>
    );
  }

  const showConsentBanner = voiceMatch.needsFallbackConsent && !consentGiven;

  return (
    <div
      role="region"
      aria-label="Listen to explanation audio control"
      className="rounded-2xl bg-[#FCFAF6] border border-[#DDD5C5] p-5 sm:p-6 mb-6 shadow-xs transition-all"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8E2D5]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#0C281C] text-[#BEF264] flex items-center justify-center shrink-0">
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#0C281C]">
              Listen to explanation
            </h4>
            <span className="text-xs text-[#5A6D64]">
              Audio narration in {language}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2" aria-live="polite">
          {status === "playing" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#BEF264]/40 text-[#0C281C] border border-[#84CC16]/60">
              <span className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 h-3 bg-[#1C543C] rounded-full animate-pulse" />
                <span
                  className="w-0.5 h-2 bg-[#1C543C] rounded-full animate-pulse"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-0.5 h-3 bg-[#1C543C] rounded-full animate-pulse"
                  style={{ animationDelay: "300ms" }}
                />
              </span>
              <span>Playing {currentChunkIndex + 1}/{chunks.length}</span>
            </span>
          )}

          {status === "paused" && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
              Paused
            </span>
          )}

          {status === "idle" && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#E7F3EC] text-[#1C543C] border border-[#C6E6D2]">
              Ready to listen
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 flex-wrap">
          {status === "idle" && (
            <button
              type="button"
              onClick={() => handlePlay()}
              aria-label="Play explanation audio"
              className="px-5 py-2.5 rounded-full font-semibold text-sm bg-[#0C281C] text-white hover:bg-[#143F2D] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#84CC16]"
            >
              <Play className="w-4 h-4 fill-white text-white" />
              <span>Play</span>
            </button>
          )}

          {status === "playing" && (
            <button
              type="button"
              onClick={handlePause}
              aria-label="Pause explanation audio"
              className="px-5 py-2.5 rounded-full font-semibold text-sm bg-[#0C281C] text-white hover:bg-[#143F2D] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#84CC16]"
            >
              <Pause className="w-4 h-4 fill-white text-white" />
              <span>Pause</span>
            </button>
          )}

          {status === "paused" && (
            <button
              type="button"
              onClick={handleResume}
              aria-label="Resume explanation audio"
              className="px-5 py-2.5 rounded-full font-semibold text-sm bg-[#0C281C] text-[#BEF264] hover:bg-[#143F2D] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#84CC16]"
            >
              <Play className="w-4 h-4 fill-[#BEF264] text-[#BEF264]" />
              <span>Resume</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleStop}
            disabled={status === "idle"}
            aria-label="Stop audio playback"
            className={`px-4 py-2.5 rounded-full font-medium text-sm transition-all flex items-center gap-1.5 border focus:outline-none focus-visible:ring-2 focus-visible:ring-[#84CC16] ${
              status === "idle"
                ? "border-[#E8E2D5] text-[#8C9B93] bg-[#F8F5EE] opacity-50 cursor-not-allowed"
                : "border-[#DDD5C5] text-[#1C543C] bg-white hover:bg-[#F2EDE2] active:scale-[0.98] cursor-pointer shadow-xs"
            }`}
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>Stop</span>
          </button>
        </div>

        <div className="flex items-center gap-2" role="group" aria-label="Playback speed selector">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#5A6D64]">
            Speed:
          </span>
          <div className="inline-flex rounded-xl p-1 bg-[#F0ECE1] border border-[#DDD5C5] gap-1">
            {[1, 1.5, 2].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleSpeedChange(s)}
                aria-label={`Playback speed ${s}x`}
                aria-pressed={speed === s}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  speed === s
                    ? "bg-[#0C281C] text-[#BEF264] shadow-xs"
                    : "text-[#4B5E55] hover:text-[#0C281C] hover:bg-[#E8E2D5]"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {showConsentBanner && (
        <div
          role="alert"
          className="mt-4 p-4 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs sm:text-sm animate-in fade-in duration-200"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-amber-900">
                No native {language} voice found on this device
              </p>
              <p className="text-amber-800 mt-1 leading-relaxed text-xs">
                {language === "Nigerian Pidgin"
                  ? "A Nigerian English voice (en-NG) is not installed on your browser. Standard English speech synthesis is available as an alternative."
                  : `Most browsers do not include native text-to-speech for ${language}. You can listen using an available English voice if you wish.`}
              </p>
              <div className="mt-3 flex items-center gap-2.5 flex-wrap">
                <button
                  type="button"
                  onClick={handleConsentAndPlay}
                  className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#0C281C] text-[#BEF264] hover:bg-[#143F2D] transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#BEF264]" />
                  <span>Listen with available English voice</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-3 text-[11px] text-[#6F8279] flex flex-wrap items-center justify-between gap-2">
        <span>
          {voiceMatch.isNative ? (
            <>Matched Voice: <strong className="font-semibold text-[#0C281C]">{voiceMatch.voiceDescription}</strong></>
          ) : consentGiven ? (
            <>Using English voice fallback (<strong className="font-semibold text-[#0C281C]">{voiceMatch.voiceDescription}</strong>) with your consent</>
          ) : (
            <>Voice: <span className="text-[#8C9B93]">{voiceMatch.voiceDescription}</span></>
          )}
        </span>
        <span className="hidden sm:inline">Web Speech Synthesis API</span>
      </div>
    </div>
  );
}
