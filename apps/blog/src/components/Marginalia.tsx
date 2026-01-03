
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Heart, Share2, Paperclip, Sparkles, Highlighter } from 'lucide-react';

interface MarginaliaProps {
  onViewAll?: () => void;
  onLike?: () => void;
  highlightedTexts?: Set<string>;
  onHighlight?: (text: string) => void;
}

const SNIPPETS = [
  {
    id: 1,
    content: "리액트 19의 컴파일러 도입은 단순히 성능의 문제가 아니라, 개발자가 '최적화'라는 굴레에서 벗어나 '로직'에 집중하게 만드는 해방 선언이다.",
    date: "2 HOURS AGO",
    tags: ["#React", "#Compiler"],
    rotation: -2
  },
  {
    id: 2,
    content: "디자인 시스템을 만드는 것은 건물을 짓는 것이 아니라, 도시의 문법을 만드는 것과 같다. 확장이 가능해야 하지만, 정체성은 잃지 말아야 한다.",
    date: "6 HOURS AGO",
    tags: ["#DesignSystem", "#UI"],
    rotation: 1
  },
  {
    id: 3,
    content: "Rust를 배우기 시작했다. 소유권 개념은 마치 도서관 대출 시스템 같다. 한 번에 한 명만 빌릴 수 있고, 다 읽으면 반드시 반납해야 한다.",
    date: "1 DAY AGO",
    tags: ["#Rust", "#Learning"],
    rotation: -1
  },
  {
    id: 4,
    content: "최고의 UI는 설명이 필요 없는 UI가 아니라, 사용자가 다음 행동을 '기대'하게 만드는 UI다. 기대감은 몰입을 만든다.",
    date: "3 DAYS AGO",
    tags: ["#UX", "#Philosophy"],
    rotation: 2
  }
];

export const Marginalia: React.FC<MarginaliaProps> = ({ 
  onViewAll, 
  onLike, 
  highlightedTexts = new Set(), 
  onHighlight 
}) => {
  const [likedIds, setLikedIds] = useState<number[]>([]);
  const [tooltip, setTooltip] = useState<{ text: string, x: number, y: number } | null>(null);

  const handleLikeClick = (id: number) => {
    if (likedIds.includes(id)) return;
    setLikedIds(prev => [...prev, id]);
    onLike?.();
  };

  const handleTextClick = (e: React.MouseEvent, text: string) => {
    if (highlightedTexts.has(text)) return;
    setTooltip({
      text,
      x: e.clientX,
      y: e.clientY - 40
    });
  };

  const confirmHighlight = () => {
    if (tooltip && onHighlight) {
      onHighlight(tooltip.text);
      setTooltip(null);
    }
  };

  return (
    <section className="py-24 relative overflow-hidden bg-[#fdfcf5] dark:bg-[#121212] transition-colors duration-500" onClick={() => setTooltip(null)}>
      {/* Tooltip Menu */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            style={{ left: tooltip.x, top: tooltip.y }}
            className="fixed z-[100] -translate-x-1/2 flex items-center gap-3 bg-stone-900 text-white px-4 py-2 rounded-lg shadow-2xl cursor-pointer hover:bg-stone-700 transition-colors border border-stone-700"
            onClick={(e) => {
              e.stopPropagation();
              confirmHighlight();
            }}
          >
            <Highlighter className="w-4 h-4 text-yellow-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Ink this thought?</span>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-stone-900 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Decorative Element */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none select-none overflow-hidden">
        <span className="text-[20rem] font-serif font-bold absolute -top-20 -left-20 dark:text-white">MEMO</span>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-8">
          <div>
            <span className="text-xs tracking-[0.4em] uppercase text-stone-400 dark:text-stone-500 block mb-2">Section 03</span>
            <h2 className="text-4xl font-serif italic text-stone-800 dark:text-stone-200">Marginalia.</h2>
            <p className="text-stone-500 dark:text-stone-400 text-sm mt-2 font-light">여백에 남긴 짤막한 생각들과 기술적 단상들</p>
          </div>
          <button 
            onClick={onViewAll}
            className="flex items-center gap-2 text-[10px] tracking-widest uppercase font-bold text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 transition-colors"
          >
            View All Threads <Paperclip className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {SNIPPETS.map((snippet) => {
            const isLiked = likedIds.includes(snippet.id);
            const isHighlighted = highlightedTexts.has(snippet.content);
            return (
              <motion.div
                key={snippet.id}
                whileHover={{ rotate: 0, y: -10, scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{ rotate: snippet.rotation }}
                className="bg-white dark:bg-stone-900 p-8 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] border border-stone-100 dark:border-stone-800 relative group cursor-pointer transition-colors"
              >
                {/* Tape Effect */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-stone-200/40 dark:bg-stone-700/40 backdrop-blur-sm -rotate-2 group-hover:bg-stone-300/40 transition-colors" />
                
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-[9px] font-bold text-stone-400 dark:text-stone-500 tracking-widest">{snippet.date}</span>
                    <AnimatePresence>
                      {isLiked && (
                        <motion.div 
                          initial={{ scale: 0, opacity: 0 }} 
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-[8px] font-bold text-yellow-600 dark:text-yellow-500 flex items-center gap-1"
                        >
                          <Sparkles className="w-2 h-2" /> +5 INK
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <div 
                    onClick={(e) => { e.stopPropagation(); handleTextClick(e, snippet.content); }}
                    className="relative mb-6 flex-grow"
                  >
                    {isHighlighted && (
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        className="absolute inset-0 bg-yellow-200/50 -z-10 mix-blend-multiply dark:mix-blend-overlay" 
                      />
                    )}
                    <p className={`text-stone-800 dark:text-stone-300 font-handwriting text-base leading-relaxed transition-all ${isHighlighted ? '' : 'hover:underline hover:decoration-dotted hover:decoration-stone-300 hover:underline-offset-4'}`}>
                      {snippet.content}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {snippet.tags.map(tag => (
                      <span key={tag} className="text-[9px] text-stone-400 dark:text-stone-600 uppercase tracking-tighter">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-stone-50 dark:border-stone-800">
                    <div className="flex gap-4">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleLikeClick(snippet.id); }}
                        className={`transition-colors flex items-center gap-1 ${isLiked ? 'text-pink-500 scale-110' : 'text-stone-300 dark:text-stone-600 hover:text-pink-400'}`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-pink-500' : ''}`} />
                        {isLiked && <span className="text-[8px] font-bold">1</span>}
                      </button>
                      <button className="text-stone-300 dark:text-stone-600 hover:text-stone-900 dark:hover:text-stone-400 transition-colors">
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <Share2 className="w-3.5 h-3.5 text-stone-300 dark:text-stone-600 hover:text-stone-900 dark:hover:text-stone-400 cursor-pointer transition-colors" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
