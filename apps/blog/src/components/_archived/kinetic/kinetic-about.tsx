"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Github,
  ExternalLink,
  X,
  Cpu,
  Layers,
  Zap,
  Briefcase,
  Box,
  Star,
  ArrowUpRight,
} from "lucide-react";

interface KineticAboutProps {
  onBack: () => void;
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

export function KineticAbout({ onBack }: KineticAboutProps) {
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(
    null
  );

  return (
    <div className="min-h-screen">
      <section className="bg-kinetic-orange dark:bg-black min-h-[80vh] pt-32 pb-20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onClick={onBack}
            className="group flex items-center gap-3 font-mono text-sm uppercase tracking-widest text-black/60 dark:text-kinetic-orange hover:text-black dark:hover:text-white transition-colors mb-16"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
            Back to Home
          </motion.button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            <div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="font-mono text-sm uppercase tracking-widest text-black/60 dark:text-kinetic-orange mb-4 block"
              >
                (About)
              </motion.span>
              <motion.h1
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="font-serif text-[16vw] md:text-[12vw] lg:text-[10vw] leading-[0.85] font-black uppercase text-black dark:text-white"
              >
                The
                <br />
                <span className="text-black/30 dark:text-kinetic-orange">
                  Archivist
                </span>
              </motion.h1>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col md:flex-row gap-8 items-start"
            >
              <div className="w-40 h-56 md:w-48 md:h-64 shrink-0 relative overflow-hidden border-l-8 border-black dark:border-kinetic-orange bg-black/10 dark:bg-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  alt="Profile"
                />
              </div>
              <p className="font-serif text-xl md:text-2xl leading-relaxed text-black dark:text-white/80">
                안녕하세요, 지식을 큐레이팅하는 개발자입니다. 코드는 단순히
                작동하는 기계가 아니라, 누군가에게 읽히고 영감을 주는{" "}
                <span className="font-bold text-black dark:text-kinetic-orange">
                  &apos;기록물&apos;
                </span>
                이어야 한다고 믿습니다.
              </p>
            </motion.div>
          </div>
        </div>

        <Star
          className="absolute top-20 right-10 w-16 h-16 md:w-24 md:h-24 text-black/10 dark:text-kinetic-orange/20 animate-pulse"
          fill="currentColor"
        />
      </section>

      <section className="bg-[#1c1917] dark:bg-black py-24 md:py-32">
        <div className="container mx-auto px-4 mb-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="text-kinetic-orange font-mono text-sm uppercase tracking-widest mb-2 block">
                (01)
              </span>
              <h2 className="font-serif text-[12vw] md:text-[8vw] leading-[0.85] text-white uppercase font-black">
                Career
              </h2>
            </div>
            <Briefcase className="w-12 h-12 md:w-16 md:h-16 text-kinetic-orange" />
          </div>
        </div>

        <div className="flex flex-col">
          {CAREER_LEDGER.map((job, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="group border-t border-white/10 py-10 md:py-16 hover:bg-white/5 transition-colors duration-500"
            >
              <div className="container mx-auto px-4 flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="font-mono text-kinetic-orange text-base md:text-lg min-w-[180px]">
                  {job.period}
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold uppercase text-white mb-4 group-hover:translate-x-4 transition-transform duration-300">
                    {job.role}
                  </h3>
                  <p className="font-mono text-white/50 text-sm md:text-base mb-6 max-w-2xl">
                    {job.description}
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 border border-white/20 rounded-full text-white/60 font-mono text-xs uppercase group-hover:border-kinetic-orange group-hover:text-kinetic-orange transition-colors duration-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="md:self-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <ArrowUpRight className="w-12 h-12 md:w-16 md:h-16 text-kinetic-orange transform group-hover:rotate-45 transition-transform duration-300" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-kinetic-orange dark:bg-zinc-900 py-24 md:py-32">
        <div className="container mx-auto px-4 mb-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="font-mono text-sm uppercase tracking-widest mb-2 block text-black/60 dark:text-kinetic-orange">
                (02)
              </span>
              <h2 className="font-serif text-[12vw] md:text-[8vw] leading-[0.85] text-black dark:text-white uppercase font-black">
                Artifacts
              </h2>
            </div>
            <Box className="w-12 h-12 md:w-16 md:h-16 text-black dark:text-kinetic-orange" />
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ARTIFACTS.map((art, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ y: -8 }}
                onClick={() => setSelectedArtifact(art)}
                className="group p-8 bg-black dark:bg-black/50 border-2 border-transparent hover:border-kinetic-orange transition-all duration-500 cursor-pointer flex flex-col min-h-[320px]"
              >
                <div className="flex justify-between items-start mb-6">
                  <span className="font-mono text-kinetic-orange text-xs tracking-wider">
                    {art.id}
                  </span>
                  <ArrowUpRight className="w-5 h-5 text-white/30 group-hover:text-kinetic-orange group-hover:rotate-45 transition-all duration-300" />
                </div>

                <h4 className="font-serif text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-kinetic-orange transition-colors duration-300">
                  {art.title}
                </h4>

                <p className="font-mono text-white/50 text-sm leading-relaxed mb-auto flex-grow">
                  {art.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-6 border-t border-white/10 mt-6">
                  {art.tech.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-mono font-bold uppercase text-white/40"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#1c1917] dark:bg-black py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <span className="text-kinetic-orange font-mono text-sm uppercase tracking-widest mb-4 block">
                (03)
              </span>
              <h2 className="font-serif text-[12vw] md:text-[8vw] lg:text-[6vw] leading-[0.85] text-white uppercase font-black mb-8">
                Specialization
              </h2>
            </div>

            <div className="space-y-8">
              {[
                { label: "Primary Language", value: "TypeScript, Rust" },
                {
                  label: "UI/UX Domain",
                  value: "Atomic Architecture, Motion Design",
                },
                { label: "AI Integration", value: "LLM, RAG, Embeddings" },
                { label: "Tools", value: "Claude Code, Cursor, Figma" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="border-b border-white/10 pb-8 group hover:border-kinetic-orange transition-colors duration-500"
                >
                  <span className="font-mono text-xs uppercase tracking-widest text-kinetic-orange mb-2 block">
                    {item.label}
                  </span>
                  <span className="font-serif text-2xl md:text-3xl text-white group-hover:translate-x-4 inline-block transition-transform duration-300">
                    {item.value}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedArtifact && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArtifact(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-5xl h-full max-h-[90vh] overflow-hidden bg-zinc-900 border-t-8 border-kinetic-orange relative z-10 flex flex-col"
            >
              <div className="p-6 md:p-8 border-b border-white/10 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-kinetic-orange/20 rounded-full">
                    <Cpu className="w-6 h-6 text-kinetic-orange" />
                  </div>
                  <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-kinetic-orange block">
                      Technical Blueprint / {selectedArtifact.id}
                    </span>
                    <h2 className="font-serif text-2xl md:text-3xl font-bold text-white">
                      {selectedArtifact.title}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedArtifact(null)}
                  className="p-3 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-6 md:p-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  <div className="lg:col-span-7 space-y-10">
                    <section>
                      <label className="font-mono text-xs uppercase tracking-widest text-kinetic-orange mb-4 block">
                        Overview
                      </label>
                      <p className="font-serif text-xl text-white/80 leading-relaxed italic">
                        {selectedArtifact.longDescription}
                      </p>
                    </section>

                    <section>
                      <label className="font-mono text-xs uppercase tracking-widest text-kinetic-orange mb-6 block">
                        Features
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedArtifact.features.map((feature, i) => (
                          <div
                            key={i}
                            className="p-5 bg-black border-l-4 border-kinetic-orange flex items-center gap-4"
                          >
                            <Zap className="w-4 h-4 text-kinetic-orange shrink-0" />
                            <span className="font-mono text-sm text-white">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section className="p-8 bg-kinetic-orange/10 border border-kinetic-orange/30 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Layers className="w-24 h-24 text-kinetic-orange" />
                      </div>
                      <label className="font-mono text-xs uppercase tracking-widest text-kinetic-orange mb-4 block">
                        Challenges & Solutions
                      </label>
                      <p className="font-serif text-lg text-white/70 leading-relaxed">
                        {selectedArtifact.challenges}
                      </p>
                    </section>
                  </div>

                  <div className="lg:col-span-5 space-y-10">
                    <section className="p-8 bg-black border border-white/10">
                      <h4 className="font-mono text-xs uppercase tracking-widest text-white mb-8 border-b border-white/10 pb-4">
                        Tech Stack Composition
                      </h4>
                      <div className="space-y-6">
                        {selectedArtifact.composition.map((comp, i) => (
                          <div key={i} className="space-y-2">
                            <div className="flex justify-between font-mono text-xs uppercase tracking-widest">
                              <span className="text-white/60">{comp.name}</span>
                              <span className="text-kinetic-orange">
                                {comp.percent}%
                              </span>
                            </div>
                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${comp.percent}%` }}
                                transition={{ delay: 0.3 + i * 0.1, duration: 1 }}
                                className="h-full bg-kinetic-orange"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section className="space-y-4">
                      <h4 className="font-mono text-xs uppercase tracking-widest text-white/60">
                        Access
                      </h4>
                      <a
                        href={`https://${selectedArtifact.link}`}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center justify-between p-5 bg-black border border-white/10 hover:border-kinetic-orange transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <Github className="w-5 h-5 text-white" />
                          <span className="font-mono text-sm uppercase tracking-widest text-white">
                            Repository
                          </span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-kinetic-orange transition-colors" />
                      </a>
                      <button className="w-full py-5 bg-kinetic-orange text-black font-mono text-sm uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-3">
                        Live Preview
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </section>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-white/10 text-center shrink-0 bg-black">
                <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">
                  Archives Technical Dept. • Authenticated Access
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
