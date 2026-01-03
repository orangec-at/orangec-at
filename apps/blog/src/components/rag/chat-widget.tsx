'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChatMessages } from './chat-messages';
import { ChatInput } from './chat-input';
import { streamChat, type ChatMessage, type SourceDocument } from '@/lib/rag-client';
import { useLocale } from 'next-intl';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sources, setSources] = useState<SourceDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const locale = useLocale();

  const handleSubmit = async (query: string) => {
    if (!query.trim() || isLoading) return;

    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: query,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setSources([]);

    try {
      // Start streaming
      let assistantContent = '';
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: '',
      };

      for await (const chunk of streamChat(query, locale)) {
        if (chunk.type === 'sources') {
          // Backend sends: {type: 'sources', sources: [...]}
          setSources(chunk.sources || []);
        } else if (chunk.type === 'content') {
          // Backend sends: {type: 'content', content: '...'}
          assistantContent += chunk.content || '';
          assistantMessage.content = assistantContent;

          // Update message with streaming content
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage?.role === 'assistant') {
              return [...prev.slice(0, -1), assistantMessage];
            } else {
              return [...prev, assistantMessage];
            }
          });
        } else if (chunk.type === 'done') {
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error('Chat error:', error);

      const errorMessage: ChatMessage = {
        role: 'assistant',
        content:
          locale === 'ko'
            ? '죄송합니다. 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
            : 'Sorry, an error occurred. Please try again later.',
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  const welcomeMessage = locale === 'ko'
    ? '안녕하세요! 블로그 콘텐츠에 대해 궁금한 점을 물어보세요. 😊'
    : 'Hello! Ask me anything about the blog content. 😊';

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <Button
              size="lg"
              onClick={() => setIsOpen(true)}
              className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-8 right-8 z-50 w-full max-w-md"
          >
            <Card className="flex h-[600px] flex-col overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b p-4">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  <h3 className="font-semibold">
                    {locale === 'ko' ? 'AI 어시스턴트' : 'AI Assistant'}
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Messages */}
              <ChatMessages
                messages={messages}
                sources={sources}
                isLoading={isLoading}
                welcomeMessage={welcomeMessage}
              />

              {/* Input */}
              <ChatInput onSubmit={handleSubmit} isLoading={isLoading} locale={locale} />
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
