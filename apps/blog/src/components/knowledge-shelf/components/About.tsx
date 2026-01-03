"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Box,
  Stamp,
  X,
  FileSearch,
  Cpu,
  Layers,
  Zap,
  Briefcase,
} from "lucide-react";

import type { ThemeMode } from "../types";

interface AboutProps {
  onBack: () => void;
  theme: ThemeMode;
}

interface Artifact {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  link: string;
  tech: string[];
  features: string[];
  challenges: string;
  composition: { name: string; percent: number }[];
}

const CAREER_LEDGER = [
  {
    period: "2021 — PRESENT",
    company: "Studio Archives",
    role: "Senior Frontend Architect",
    description:
      "디자인 시스템 고도화 및 아토믹 디자인 기반의 아키텍처 설계 주도. React 19 전환 프로젝트 리드.",
    tags: ["React", "TypeScript", "System Design"],
  },
  {
    period: "2019 — 2021",
    company: "Knowledge Flow Inc.",
    role: "Frontend Engineer",
    description:
      "실시간 데이터 시각화 대시보드 개발 및 성능 최적화(Lighthouse 점수 40% 향상).",
    tags: ["Next.js", "D3.js", "GraphQL"],
  },
];

const ARTIFACTS: Artifact[] = [
  {
    id: "ART-042",
    title: "Project: Midnight Library",
    description:
      "현재 보고 계시는 기록물. Framer Motion과 Tailwind를 활용한 인터랙티브 아카이브.",
    longDescription:
      "지식의 파편을 수집하고 정리하는 도서관 컨셉의 개인 블로그입니다. 사용자의 인터랙션에 따라 '잉크(Ink)'가 쌓이고, 이를 통해 서고의 비밀 구역에 접근하는 게임화된 경험을 제공합니다.",
    link: "github.com/archivist/library",
    tech: ["Framer Motion", "React", "Lucide"],
    features: [
      "인터랙티브 잉크 시스템",
      "Gemini API 기반 사서 AI",
      "다크 모드 Midnight 테마",
    ],
    challenges:
      "대량의 애니메이션 요소가 포함된 환경에서 최적의 프레임워크 성능을 유지하기 위해 Framer Motion의 레이아웃 애니메이션을 최적화했습니다.",
    composition: [
      { name: "Frontend Logic", percent: 65 },
      { name: "Motion Design", percent: 25 },
      { name: "Asset Creation", percent: 10 },
    ],
  },
  {
    id: "ART-088",
    title: "Engine: Ink-Query RAG",
    description:
      "로컬 데이터를 벡터화하여 질문에 답변하는 경량화된 AI 관리자 엔진.",
    longDescription:
      "사용자가 업로드한 텍스트 문서를 실시간으로 임베딩하여 질문에 가장 적합한 맥락을 찾아 답변하는 로컬 RAG(Retrieval-Augmented Generation) 시스템입니다.",
    link: "github.com/archivist/ink-query",
    tech: ["Gemini API", "Vector DB", "Node.js"],
    features: [
      "실시간 임베딩 엔진",
      "컨텍스트 기반 정밀 답변",
      "경량형 벡터 저장소",
    ],
    challenges:
      "브라우저 환경에서의 벡터 연산 속도 한계를 극복하기 위해 IndexedDB와 Web Workers를 활용한 병렬 처리를 구현했습니다.",
    composition: [
      { name: "AI Integration", percent: 50 },
      { name: "Data Pipeline", percent: 30 },
      { name: "UI Framework", percent: 20 },
    ],
  },
  {
    id: "ART-105",
    title: "Tool: Atomic Builder",
    description:
      "피그마 설계를 코드로 즉시 변환하는 디자인 시스템 오토메이션 도구.",
    longDescription:
      "반복적인 UI 컴포넌트 생성을 자동화하기 위한 CLI 툴입니다. Figma API를 통해 스타일 가이드를 추출하고, 아토믹 디자인 패턴에 맞는 React 컴포넌트 코드를 생성합니다.",
    link: "npm.com/atomic-builder",
    tech: ["Rust", "AST Parsing", "TypeScript"],
    features: [
      "Figma API 연동",
      "맞춤형 코드 템플릿 엔진",
      "TypeScript 타입 자동 생성",
    ],
    challenges:
      "복잡한 Figma 레이어 구조를 정교한 AST로 파싱하는 과정에서 발생한 예외 상황들을 처리하기 위해 Rust 기반의 강력한 파서를 구축했습니다.",
    composition: [
      { name: "Rust Core", percent: 70 },
      { name: "TS Bridge", percent: 20 },
      { name: "Docs", percent: 10 },
    ],
  },
];

const PERSONALITY_TRAITS = [
  { left: "CASUAL", right: "FORMAL", value: 25 },
  { left: "FUN", right: "SERIOUS", value: 72 },
  { left: "REALISTIC", right: "IDEALISTIC", value: 42 },
  { left: "APPROACHABLE", right: "EXCLUSIVE", value: 58 },
];

export const About: React.FC<AboutProps> = ({ onBack, theme }) => {
  const isDark = theme === "dark";
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);

  return (
    <div
      data-theme={theme}
      className={`pt-32 pb-40 transition-colors duration-700 selection:bg-stone-300`}
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <button
          onClick={onBack}
          className={`flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase font-bold transition-colors mb-16 ${
            isDark
              ? "text-stone-600 hover:text-white"
              : "text-stone-400 hover:text-stone-900"
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Exit to Main Library
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7 space-y-32">
            <section className="relative">
              <span
                className={`text-[10px] tracking-[0.5em] uppercase block mb-6 font-bold italic ${
                  isDark ? "text-stone-700" : "text-stone-400"
                }`}
              >
                Identity / 001
              </span>
              <h1
                className={`text-5xl sm:text-6xl lg:text-8xl font-serif font-bold leading-[0.85] tracking-tighter mb-12 ${
                  isDark ? "text-white" : "text-stone-900"
                }`}
              >
                The <br />
                <span className={`italic ${isDark ? "text-stone-700" : "text-stone-400"}`}>
                  Archivist
                </span>
                .
              </h1>

              <div className="flex flex-col md:flex-row gap-12 items-start">
                <div
                  className={`w-40 h-56 sm:w-48 sm:h-64 shrink-0 relative overflow-hidden shadow-2xl border-l-[12px] transition-colors ${
                    isDark ? "bg-stone-900 border-red-900" : "bg-stone-200 border-stone-800"
                  }`}
                >
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop"
                    className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-1000"
                    alt="Curator"
                  />
                  <div className="absolute bottom-4 right-4">
                    <Stamp className={`w-10 h-10 opacity-20 ${isDark ? "text-red-500" : "text-stone-900"}`} />
                  </div>
                </div>
                <div className="space-y-6">
                  <p
                    className={`text-lg leading-relaxed font-serif ${
                      isDark ? "text-stone-300" : "text-stone-800"
                    }`}
                  >
                    안녕하세요, 지식을 큐레이팅하는 개발자입니다. <br />
                    코드는 단순히 작동하는 기계가 아니라, 누군가에게 읽히고 영감을 주는{" "}
                    <span className={isDark ? "text-red-500 font-bold" : "text-stone-900 font-bold"}>
                      &apos;기록물&apos;
                    </span>
                    이어야 한다고 믿습니다.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b pb-4 border-stone-200 dark:border-stone-800">
                <Briefcase className={`w-5 h-5 ${isDark ? "text-red-900" : "text-stone-400"}`} />
                <h2
                  className={`text-xs tracking-[0.4em] uppercase font-bold ${
                    isDark ? "text-stone-300" : "text-stone-900"
                  }`}
                >
                  The Service Ledger (Career)
                </h2>
              </div>

              <div className="space-y-16 relative">
                <div
                  className={`absolute left-[3px] top-2 bottom-2 w-px border-l border-dashed ${
                    isDark ? "border-stone-800" : "border-stone-300"
                  }`}
                />
                {CAREER_LEDGER.map((job, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative pl-10"
                  >
                    <div
                      className={`absolute left-0 top-1 w-2 h-2 rounded-full border ${
                        isDark ? "bg-red-900 border-red-800" : "bg-stone-900 border-white"
                      }`}
                    />
                    <span className={`text-[10px] font-mono mb-2 block ${isDark ? "text-stone-600" : "text-stone-400"}`}>
                      {job.period}
                    </span>
                    <h3 className={`text-xl font-serif font-bold ${isDark ? "text-white" : "text-stone-900"}`}>
                      {job.role}
                    </h3>
                    <p
                      className={`text-sm font-light leading-relaxed mb-4 max-w-xl ${
                        isDark ? "text-stone-400" : "text-stone-600"
                      }`}
                    >
                      {job.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b pb-4 border-stone-200 dark:border-stone-800">
                <Box className={`w-5 h-5 ${isDark ? "text-red-900" : "text-stone-400"}`} />
                <h2
                  className={`text-xs tracking-[0.4em] uppercase font-bold ${
                    isDark ? "text-stone-300" : "text-stone-900"
                  }`}
                >
                  Technical Artifacts (Projects)
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {ARTIFACTS.map((art, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -5 }}
                    onClick={() => setSelectedArtifact(art)}
                    className={`p-8 border flex flex-col group transition-all duration-500 cursor-pointer ${
                      isDark
                        ? "bg-stone-900/30 border-stone-800 hover:border-red-900"
                        : "bg-white border-stone-100 shadow-sm hover:border-stone-900"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <span
                        className={`text-[9px] font-mono font-bold tracking-tighter ${
                          isDark ? "text-red-900" : "text-stone-400"
                        }`}
                      >
                        INDEX: {art.id}
                      </span>
                      <FileSearch
                        className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${
                          isDark ? "text-red-900" : "text-stone-900"
                        }`}
                      />
                    </div>
                    <h4 className={`text-lg font-serif font-bold mb-3 ${isDark ? "text-white" : "text-stone-900"}`}>
                      {art.title}
                    </h4>
                    <p
                      className={`text-xs font-light leading-relaxed mb-8 flex-grow ${
                        isDark ? "text-stone-500" : "text-stone-500"
                      }`}
                    >
                      {art.description}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-6 border-t border-stone-800/10 dark:border-white/5">
                      {art.tech.map((t) => (
                        <span key={t} className="text-[8px] font-bold uppercase text-stone-400">
                          {t}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-5 space-y-12">
            <div
              className={`p-10 shadow-2xl relative overflow-hidden transition-colors ${
                isDark
                  ? "bg-stone-900 border border-stone-800 text-stone-100"
                  : "bg-stone-900 text-stone-100"
              }`}
            >
              <h3 className="font-serif italic text-2xl mb-8 border-b border-white/5 pb-4">Specialization</h3>
              <ul className="space-y-6">
                {[
                  { label: "Primary Language", value: "TypeScript, Rust" },
                  { label: "UI/UX Domain", value: "Atomic Architecture, Motion Design" },
                ].map((item, i) => (
                  <li key={i} className={`border-b pb-4 ${isDark ? "border-white/5" : "border-stone-800"}`}>
                    <span className="text-[9px] uppercase tracking-widest text-stone-500 font-bold block mb-1">
                      {item.label}
                    </span>
                    <span className="text-sm font-light">{item.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedArtifact && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArtifact(null)}
              className="absolute inset-0 bg-stone-900/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`w-full max-w-5xl h-full max-h-[90vh] overflow-hidden rounded-sm shadow-2xl relative z-10 border-t-[12px] flex flex-col paper-texture ${
                isDark
                  ? "bg-[#1a1a1a] border-red-900 text-stone-300"
                  : "bg-white border-stone-900 text-stone-800"
              }`}
            >
              <div className="p-8 border-b flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${isDark ? "bg-red-900/20 text-red-500" : "bg-stone-100 text-stone-800"}`}>
                    <Cpu className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-widest opacity-40 uppercase">
                      Technical Blueprint / {selectedArtifact.id}
                    </span>
                    <h2 className="text-3xl font-serif font-bold">{selectedArtifact.title}</h2>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedArtifact(null)}
                  className={`p-3 rounded-full hover:bg-stone-500/10 transition-colors ${
                    isDark ? "text-stone-500" : "text-stone-400"
                  }`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto custom-scrollbar p-10 lg:p-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                  <div className="lg:col-span-7 space-y-12">
                    <section>
                      <label className="text-[10px] uppercase tracking-[0.4em] font-bold text-stone-500 mb-6 block italic">
                        Researcher&apos;s Overview
                      </label>
                      <p className="text-xl font-serif leading-relaxed italic">{selectedArtifact.longDescription}</p>
                    </section>

                    <section className="space-y-6">
                      <label className="text-[10px] uppercase tracking-[0.4em] font-bold text-stone-500 mb-6 block">
                        Structural Components (Features)
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedArtifact.features.map((feature, i) => (
                          <div
                            key={i}
                            className={`p-5 border-l-4 rounded-sm flex items-center gap-4 ${
                              isDark ? "bg-stone-900/50 border-red-900" : "bg-stone-50 border-stone-800 shadow-sm"
                            }`}
                          >
                            <Zap className="w-4 h-4 text-stone-400" />
                            <span className="text-sm font-bold tracking-tight">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section
                      className={`p-10 border relative overflow-hidden ${
                        isDark ? "bg-red-950/10 border-red-900" : "bg-yellow-50 border-stone-200"
                      }`}
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Layers className="w-24 h-24" />
                      </div>
                      <label className="text-[10px] uppercase tracking-[0.4em] font-bold text-stone-500 mb-6 block">
                        Field Challenges & Resolves
                      </label>
                      <p className="font-handwriting text-lg leading-relaxed">{selectedArtifact.challenges}</p>
                    </section>
                  </div>

                  <div className="lg:col-span-5 space-y-12">
                    <section
                      className={`p-8 border rounded-sm ${
                        isDark ? "bg-stone-900/50 border-stone-800" : "bg-white border-stone-100 shadow-sm"
                      }`}
                    >
                      <h4 className="text-[11px] font-bold uppercase tracking-widest mb-8 border-b pb-4 border-stone-200 dark:border-stone-800">
                        Chemical Composition (Stack)
                      </h4>
                      <div className="space-y-8">
                        {selectedArtifact.composition.map((comp, i) => (
                          <div key={i} className="space-y-3">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                              <span>{comp.name}</span>
                              <span className="font-mono">{comp.percent}%</span>
                            </div>
                            <div className={`h-1 w-full rounded-full overflow-hidden ${isDark ? "bg-stone-800" : "bg-stone-100"}`}>
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${comp.percent}%` }}
                                transition={{ delay: 0.3 + i * 0.1, duration: 1 }}
                                className={`h-full ${isDark ? "bg-red-900" : "bg-stone-900"}`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section className="space-y-6">
                      <h4 className="text-[11px] font-bold uppercase tracking-widest text-stone-500">Access Protocols</h4>
                      <div className="flex flex-col gap-4">
                        <a
                          href={`https://${selectedArtifact.link}`}
                          target="_blank"
                          rel="noreferrer"
                          className={`flex items-center justify-between p-5 border group transition-all ${
                            isDark
                              ? "bg-stone-950 border-stone-800 hover:bg-stone-800"
                              : "bg-white border-stone-200 hover:bg-stone-50"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <Github className="w-5 h-5" />
                            <span className="text-xs font-bold uppercase tracking-widest">Repository Archive</span>
                          </div>
                          <ExternalLink className="w-4 h-4 opacity-30 group-hover:opacity-100" />
                        </a>
                        <button
                          className={`w-full py-5 text-[10px] font-bold uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-3 ${
                            isDark
                              ? "bg-red-900 hover:bg-red-800 text-white"
                              : "bg-stone-900 hover:bg-stone-700 text-white"
                          }`}
                        >
                          Live Interface
                        </button>
                      </div>
                    </section>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 border-t text-center shrink-0 ${
                  isDark ? "bg-stone-950 border-stone-800" : "bg-stone-50 border-stone-200"
                }`}
              >
                <span className="text-[9px] uppercase tracking-[0.5em] text-stone-400">
                  Authenticated Access • Archives Technical Dept.
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>

  );
};
