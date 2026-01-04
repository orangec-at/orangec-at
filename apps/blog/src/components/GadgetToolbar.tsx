
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Droplets, Quote, Mail, Sparkles, Footprints, Settings, User, X, Music, Highlighter, Play, Pause, Send, Loader2, CloudRain, Book, Coffee, Keyboard as KeyboardIcon, Moon, Sun } from 'lucide-react';
import { sendAdminDM } from "@/actions/admin-dm";

interface GadgetToolbarProps {
  isLoggedIn?: boolean;
  onLoginToggle?: () => void;
  inkPoints?: number;
  highlightedTexts?: Set<string>;
  onAdminSecret?: () => void;
  onThemeToggle?: () => void;
}

type TabType = 'steps' | 'highlights' | 'music' | 'chat' | 'dm' | 'settings';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  hasContext?: boolean;
  sourceCount?: number;
  isError?: boolean;
}

const AMBIENT_LAYERS = [
  { id: 'rain', icon: CloudRain, label: "Rainfall", initial: 40 },
  { id: 'library', icon: Book, label: "Library Hum", initial: 20 },
  { id: 'coffee', icon: Coffee, label: "Cafe White Noise", initial: 10 },
  { id: 'keyboard', icon: KeyboardIcon, label: "Keystrokes", initial: 60 },
];

export const GadgetToolbar: React.FC<GadgetToolbarProps> = ({ 
  isLoggedIn = false, 
  onLoginToggle, 
  inkPoints = 450, 
  highlightedTexts = new Set(),
  onAdminSecret,
  onThemeToggle,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('steps');
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Note: Theme handling is now done via CSS classes (dark:), assuming a parent provider toggles the 'dark' class on <html>.
  // We can't easily read 'isDark' here without a hook, but standardized Tailwind usage doesn't need it for styling.
  // For icons/logic that DEPENDS on theme state, we might need a context, but here we can just rely on CSS variables or props if needed.
  // For this port, we assumes the 'dark' class is present on documentElement if dark mode is active.
  
  // Music State
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [volumes, setVolumes] = useState<Record<string, number>>({
    rain: 40, library: 20, coffee: 10, keyboard: 60
  });

  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: 'model', text: '안녕하십니까, 심야 서고의 관리자입니다. 아카이브의 기록물에 대해 궁금한 점이 있으신가요?' }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // DM State
  const [dmContent, setDmContent] = useState('');
  const [isSendingDm, setIsSendingDm] = useState(false);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  const tabs = [
    { id: 'steps', icon: Footprints, label: 'Log', 
      color: 'bg-[#e8e4d9] dark:bg-stone-800', border: 'border-stone-300 dark:border-stone-700', textColor: 'text-stone-800 dark:text-stone-300' }, 
    { id: 'highlights', icon: Highlighter, label: 'Ink', 
      color: 'bg-[#e2ddd1] dark:bg-stone-700', border: 'border-stone-300 dark:border-stone-600', textColor: 'text-stone-700 dark:text-stone-200' },
    { id: 'music', icon: Music, label: 'Focus', 
      color: 'bg-[#d6d3c9] dark:bg-stone-800', border: 'border-stone-400 dark:border-stone-700', textColor: 'text-stone-600 dark:text-stone-400' },
    { id: 'chat', icon: Bot, label: 'Librarian', 
      color: 'bg-[#ccc8bc] dark:bg-stone-900', border: 'border-stone-400 dark:border-stone-800', textColor: 'text-stone-800 dark:text-stone-100' },
    { id: 'dm', icon: Mail, label: 'Master', 
      color: 'bg-[#b5b1a2] dark:bg-red-950', border: 'border-stone-500 dark:border-red-900', textColor: 'text-stone-900 dark:text-red-100' },
    { id: 'settings', icon: Settings, label: 'User', 
      color: 'bg-[#fdfcf5] dark:bg-stone-900', border: 'border-stone-200 dark:border-stone-800', textColor: 'text-stone-500 dark:text-stone-500' },
  ] as const;

  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);

  const sendMessage = async (userMsg: string, isRetry = false) => {
    if (!userMsg.trim() || isChatLoading) return;

    if (!isRetry) {
      setChatInput('');
      setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    }
    setIsChatLoading(true);
    setLastFailedMessage(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          locale: 'ko',
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      if (!res.body) throw new Error('No response body');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      
      setChatHistory(prev => [...prev, { role: 'model', text: '' }]);

      let currentModelResponse = '';
      let currentSources: unknown[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          
          const jsonStr = line.slice(6);
          if (!jsonStr || jsonStr === '[DONE]') continue;

          try {
            const data = JSON.parse(jsonStr);
            
            if (data.type === 'sources') {
              currentSources = data.sources;
            } else if (data.type === 'content') {
              currentModelResponse += data.content;
              
              setChatHistory(prev => {
                const newHistory = [...prev];
                const lastMsg = newHistory[newHistory.length - 1];
                if (lastMsg && lastMsg.role === 'model') {
                  lastMsg.text = currentModelResponse;
                  lastMsg.hasContext = currentSources.length > 0;
                  lastMsg.sourceCount = currentSources.length;
                }
                return newHistory;
              });
            }
          } catch (e) {
          }
        }
      }

    } catch (error) {
      console.error(error);
      setLastFailedMessage(userMsg);
      const errorMsg = error instanceof Error && error.name === 'AbortError'
        ? "응답 시간이 초과되었습니다. 다시 시도해주세요."
        : "서고 연결이 불안정합니다. 잠시 후 다시 시도해주세요.";
      
      setChatHistory(prev => {
        const newHistory = [...prev];
        if (newHistory[newHistory.length - 1]?.text === '') {
          newHistory[newHistory.length - 1] = { role: 'model', text: errorMsg, isError: true };
        } else {
          newHistory.push({ role: 'model', text: errorMsg, isError: true });
        }
        return newHistory;
      });
    } finally {
      clearTimeout(timeoutId);
      setIsChatLoading(false);
    }
  };

  const handleSendMessage = () => sendMessage(chatInput);
  const handleRetry = () => lastFailedMessage && sendMessage(lastFailedMessage, true);

  const handleSendDm = async () => {
    if (!dmContent.trim()) return;
    setIsSendingDm(true);
    
    try {
      const result = await sendAdminDM(dmContent);
      if (result.success) {
        setDmContent('');
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('서신 발송에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSendingDm(false);
    }
  };

  const inkList = Array.from(highlightedTexts);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] flex flex-col items-center pointer-events-none">
      <div className="relative w-full max-w-lg pointer-events-auto">
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute bottom-14 left-4 right-4 shadow-2xl border-t border-x rounded-t-xl min-h-[550px] max-h-[80vh] flex flex-col overflow-hidden paper-texture bg-[#fdfcf5] dark:bg-[#1a1a1a] border-stone-300 dark:border-stone-800 text-stone-800 dark:text-stone-300"
            >
              <div className="p-6 border-b flex justify-between items-center bg-transparent backdrop-blur-sm sticky top-0 z-10 border-stone-200 dark:border-stone-800">
                <div className="flex items-baseline gap-3">
                  <h3 className="font-handwriting text-3xl leading-none">
                    {tabs.find(t => t.id === activeTab)?.label}.
                  </h3>
                  <div className="h-px w-8 bg-stone-300 dark:bg-stone-800" />
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 dark:text-stone-600">Archives Index / v.1.2</span>
                </div>
                <button onClick={() => setIsExpanded(false)} className="p-2 hover:bg-stone-800/10 rounded-full transition-colors">
                   <X className="w-5 h-5 text-stone-400" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto custom-scrollbar p-8">
                 {activeTab === 'chat' && (
                    <div className="flex flex-col h-full min-h-[400px]">
                       <div className="flex-grow space-y-4 mb-6">
                           {chatHistory.map((msg, i) => (
                             <motion.div 
                               key={i} 
                               initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                               animate={{ opacity: 1, x: 0 }}
                               className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                             >
                                <div className={`max-w-[85%] p-4 rounded-lg text-sm leading-relaxed ${
                                   msg.role === 'user' 
                                   ? 'bg-stone-800 dark:bg-red-900 text-white'
                                   : msg.isError
                                     ? 'bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
                                     : 'bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800'
                                } shadow-sm`}>
                                   {msg.text}
                                   {msg.hasContext && msg.sourceCount && msg.sourceCount > 0 && (
                                     <div className="mt-2 pt-2 border-t border-stone-200 dark:border-stone-700 text-[10px] text-stone-400 flex items-center gap-1">
                                       <Book className="w-3 h-3" />
                                       {msg.sourceCount}개의 기록물 참조
                                     </div>
                                   )}
                                   {msg.isError && lastFailedMessage && (
                                     <button 
                                       onClick={handleRetry}
                                       className="mt-2 text-xs underline hover:no-underline"
                                     >
                                       다시 시도
                                     </button>
                                   )}
                                </div>
                             </motion.div>
                          ))}
                           {isChatLoading && (
                             <div className="flex justify-start">
                                <div className="p-4 rounded-lg bg-stone-100/50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800">
                                   <div className="flex items-center gap-2">
                                      <div className="flex gap-1">
                                         <div className="w-1.5 h-1.5 bg-stone-400 dark:bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                         <div className="w-1.5 h-1.5 bg-stone-400 dark:bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                         <div className="w-1.5 h-1.5 bg-stone-400 dark:bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                      </div>
                                      <span className="text-[10px] text-stone-400 ml-1">기록물 검색 중...</span>
                                   </div>
                                </div>
                             </div>
                          )}
                          <div ref={chatEndRef} />
                       </div>
                       <div className="mt-auto flex gap-2">
                          <input 
                             type="text" 
                             value={chatInput}
                             onChange={(e) => setChatInput(e.target.value)}
                             onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                             placeholder="서고 관리자에게 질문하기..."
                             className="flex-grow p-4 text-sm font-serif border-none outline-none rounded-lg bg-white dark:bg-stone-950 text-stone-900 dark:text-white shadow-inner"
                          />
                          <button 
                             onClick={handleSendMessage}
                             disabled={isChatLoading || !chatInput.trim()}
                             className={`p-4 rounded-lg transition-all ${
                               isChatLoading || !chatInput.trim()
                                 ? 'bg-stone-300 dark:bg-stone-700 text-stone-500 cursor-not-allowed'
                                 : 'bg-stone-800 dark:bg-red-900 text-white hover:bg-stone-700 dark:hover:bg-red-800'
                             }`}
                          >
                             {isChatLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                          </button>
                       </div>
                    </div>
                 )}

                 {activeTab === 'music' && (
                    <div className="space-y-10">
                       <div className="p-8 border rounded-lg flex items-center justify-between bg-white dark:bg-stone-900/50 border-stone-100 dark:border-stone-800 shadow-sm">
                          <div className="flex items-center gap-6">
                             <button 
                                onClick={() => setIsMusicPlaying(!isMusicPlaying)}
                                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-xl ${isMusicPlaying ? 'bg-stone-900 dark:bg-red-900' : 'bg-stone-200 dark:bg-stone-800'}`}
                             >
                                {isMusicPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-stone-500 ml-1" />}
                             </button>
                             <div>
                                <h4 className="font-serif font-bold text-xl">Midnight Focus Mix</h4>
                                <p className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">{isMusicPlaying ? 'Now Resonating' : 'Mix Stagnant'}</p>
                             </div>
                          </div>
                          {isMusicPlaying && (
                             <div className="flex gap-1 h-8 items-end">
                                {[...Array(6)].map((_, i) => (
                                   <motion.div 
                                      key={i} 
                                      animate={{ height: [10, 30, 10] }} 
                                      transition={{ duration: 0.5 + Math.random(), repeat: Infinity }} 
                                      className="w-1 bg-stone-800 dark:bg-red-900" 
                                   />
                                ))}
                             </div>
                          )}
                       </div>

                       <div className="space-y-8">
                          <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-stone-500">Atmospheric Layers</label>
                          {AMBIENT_LAYERS.map(layer => (
                             <div key={layer.id} className="space-y-3">
                                <div className="flex justify-between items-center">
                                   <div className="flex items-center gap-3">
                                      <layer.icon className="w-4 h-4 text-stone-400 dark:text-red-900" />
                                      <span className="text-xs font-bold uppercase tracking-widest">{layer.label}</span>
                                   </div>
                                   <span className="text-[10px] font-mono opacity-50">{volumes[layer.id]}%</span>
                                </div>
                                <div className="h-1 rounded-full relative bg-stone-100 dark:bg-stone-900">
                                   <input 
                                      type="range" 
                                      min="0" max="100" 
                                      value={volumes[layer.id]}
                                      onChange={(e) => setVolumes({...volumes, [layer.id]: parseInt(e.target.value)})}
                                      className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
                                   />
                                   <motion.div 
                                      animate={{ width: `${volumes[layer.id]}%` }}
                                      className="h-full rounded-full bg-stone-800 dark:bg-red-900"
                                   />
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>
                 )}

                 {activeTab === 'dm' && (
                    <div className="space-y-8">
                       <div className="p-10 border-l-[12px] shadow-sm relative overflow-hidden bg-stone-50 dark:bg-red-950/20 border-stone-800 dark:border-red-900">
                          <Sparkles className="absolute top-4 right-4 w-12 h-12 opacity-5" />
                           <h4 className="font-serif italic text-2xl mb-4">{"The Master's Bureau"}</h4>

                          <p className="text-xs text-stone-500 leading-relaxed font-light">
                             서고의 마스터(Archivist)에게 전달할 긴밀한 서신을 작성하십시오. <br />
                             기술 협업, 기록물 정정 요청, 혹은 익명의 감사 인사 모두 환영합니다.
                          </p>
                       </div>

                       <div className="space-y-4">
                          <textarea 
                             value={dmContent}
                             onChange={(e) => setDmContent(e.target.value)}
                             placeholder="서신 내용을 입력하십시오..."
                             className="w-full h-48 p-6 text-sm font-handwriting leading-relaxed outline-none border transition-all bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 focus:border-stone-800 dark:focus:border-red-900 shadow-inner"
                          />
                          <button 
                             onClick={handleSendDm}
                             disabled={isSendingDm || !dmContent.trim()}
                             className={`w-full py-5 text-[10px] font-bold uppercase tracking-[0.4em] flex items-center justify-center gap-3 transition-all ${
                                isSendingDm 
                                ? 'bg-stone-400 cursor-wait' 
                                : 'bg-stone-900 dark:bg-red-900 hover:bg-stone-700 dark:hover:bg-red-800 text-white shadow-xl'
                             }`}
                          >
                             {isSendingDm ? (
                                <> <Loader2 className="w-4 h-4 animate-spin" /> DISPATCHING... </>
                             ) : (
                                <> <Send className="w-4 h-4" /> DISPATCH MEMO </>
                             )}
                          </button>
                       </div>
                    </div>
                 )}

                 {activeTab === 'settings' && (
                    <div className="space-y-8">
                       <div className="p-10 border flex flex-col items-center gap-8 text-center shadow-sm relative overflow-hidden bg-white dark:bg-stone-900/50 border-stone-200 dark:border-stone-800">
                          <div className="w-24 h-24 border-4 flex items-center justify-center overflow-hidden rounded-sm shadow-inner bg-stone-50 dark:bg-stone-800 border-stone-100 dark:border-stone-700">
                             <User className="w-10 h-10 text-stone-600" />
                          </div>
                          <div>
                             <p className="font-handwriting text-2xl mb-2">{isLoggedIn ? 'John Archivist' : '방문객 (Guest)'}</p>
                             <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-50">인증 상태: {isLoggedIn ? 'Academic Researcher' : 'Guest Session'}</p>
                          </div>
                       </div>
                       
                       <div className="space-y-4">
                          <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-stone-500 mb-2 block">Display Mode</label>
                          <div className="p-1 rounded-lg flex gap-1 bg-stone-100 dark:bg-stone-950 border border-transparent dark:border-stone-800">
                             <button 
                                onClick={onThemeToggle}
                                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-white dark:hover:bg-stone-800"
                             >
                                <Sun className="w-3.5 h-3.5" /> Toggle Theme
                             </button>
                             {/* Simplified theme toggle for now since we don't have direct access to current theme state from prop in this snippet logic. 
                                 Ideally we would read the current theme. 
                             */}
                          </div>
                       </div>

                       <button onClick={onLoginToggle} className="w-full py-5 border-2 text-[11px] font-bold uppercase tracking-[0.3em] transition-all shadow-xl bg-stone-900 dark:bg-red-950 border-stone-900 dark:border-red-900 text-white dark:text-red-100 hover:bg-stone-700 dark:hover:bg-red-900">
                          {isLoggedIn ? '연구원 권한 반납' : '아카이브 본인 인증'}
                       </button>
                    </div>
                 )}

                 {activeTab === 'highlights' && (
                    <div className="space-y-10 pb-10">
                       <div className="p-6 border rounded-sm bg-stone-100/50 dark:bg-stone-900/50 border-stone-200 dark:border-stone-800">
                          <div className="flex justify-between items-end mb-4">
                             <div className="flex items-center gap-2">
                                <Droplets className="w-4 h-4 text-stone-800 dark:text-red-500" />
                                <span className="text-[10px] uppercase tracking-widest font-bold opacity-60">Ink Point reservoir</span>
                             </div>
                             <span className="text-xs font-mono">{inkPoints} / 1000 PTS</span>
                          </div>
                          <div className="w-full h-3 rounded-full overflow-hidden border bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${Math.min((inkPoints / 1000) * 100, 100)}%` }}
                               className="h-full bg-stone-800 dark:bg-red-900"
                             />
                          </div>
                       </div>
                       
                       <div className="space-y-4">
                          {inkList.map((text, i) => (
                             <motion.div 
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-5 border relative group transition-colors bg-white dark:bg-stone-900 border-stone-100 dark:border-stone-800"
                             >
                                <div className="absolute top-0 left-0 w-1 h-full bg-yellow-200 dark:bg-red-900" />
                                <Quote className="w-3 h-3 opacity-20 mb-2" />
                                 <p className="text-sm font-handwriting italic leading-relaxed">{`"${text}"`}</p>

                             </motion.div>
                          ))}
                       </div>
                    </div>
                 )}

                 {activeTab === 'steps' && (
                    <div className="space-y-12">
                       <div className="p-10 border-l-[12px] shadow-inner bg-[#f0f0f0] dark:bg-stone-900/50 border-stone-800 dark:border-red-900">
                          <span className="text-[10px] font-bold opacity-40 uppercase tracking-[0.4em] block mb-6">Archive Reading Index</span>
                          <div className="flex items-end gap-6">
                             <span className="text-7xl font-serif font-bold">72<span className="text-2xl ml-1">%</span></span>
                             <div className="flex-grow h-3 rounded-full overflow-hidden mb-3 border bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800">
                                <motion.div initial={{ width: 0 }} animate={{ width: '72%' }} className="h-full bg-stone-800 dark:bg-red-900" />
                             </div>
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-6">
                          <div className="p-6 border shadow-sm flex flex-col items-center bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
                             <span className="text-[9px] opacity-40 font-bold uppercase tracking-widest mb-3 block">잉크 수집량</span>
                             <span className="text-4xl font-handwriting">{inkPoints}</span>
                          </div>
                          <div className="p-6 border shadow-sm flex flex-col items-center bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
                             <span className="text-[9px] opacity-40 font-bold uppercase tracking-widest mb-3 block">연구 연속성</span>
                             <span className="text-4xl font-handwriting">12</span>
                          </div>
                       </div>
                    </div>
                 )}
              </div>
              
              <div className="h-6 border-t flex items-center justify-center bg-stone-100/50 dark:bg-stone-950 border-stone-200 dark:border-stone-900">
                 <div onClick={activeTab === 'settings' ? onAdminSecret : undefined} className="w-12 h-1 rounded-full cursor-pointer hover:bg-red-500 transition-colors bg-stone-300 dark:bg-stone-800" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative flex items-end h-14 px-4 pb-0 pointer-events-auto">
          <div className="flex items-end gap-[1px] w-full">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              // Note: tab.color/border are strings with dark variants embedded in the `tabs` definition above
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (activeTab === tab.id && isExpanded) setIsExpanded(false);
                    else {
                      setActiveTab(tab.id);
                      setIsExpanded(true);
                    }
                  }}
                  className={`relative flex-1 flex flex-col items-center justify-center transition-all duration-300 rounded-t-lg border-t border-x ${tab.border} shadow-sm ${tab.color} ${
                    isActive && isExpanded ? 'h-14 -translate-y-1 z-30 shadow-md' : 'h-11 hover:h-13 z-20 opacity-70'
                  }`}
                >
                  <tab.icon className={`w-4 h-4 ${tab.textColor} ${isActive && isExpanded ? 'scale-110' : 'scale-100'} transition-transform`} />
                </button>
              );
            })}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 z-40 bg-stone-800 dark:bg-red-900" />
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
            className="fixed inset-0 bg-stone-900/20 backdrop-blur-[4px] -z-10 pointer-events-auto"
          />
        )}
      </AnimatePresence>
    </div>
  );
};
