'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Bot, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { ChatMessage, SourceDocument } from '@/lib/rag-client';
import Link from 'next/link';

interface ChatMessagesProps {
  messages: ChatMessage[];
  sources: SourceDocument[];
  isLoading: boolean;
  welcomeMessage: string;
}

export function ChatMessages({
  messages,
  sources,
  isLoading,
  welcomeMessage,
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* Welcome Message */}
      {messages.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-muted-foreground py-8"
        >
          <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>{welcomeMessage}</p>
        </motion.div>
      )}

      {/* Messages */}
      {messages.map((message, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`flex gap-3 ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          {message.role === 'assistant' && (
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
          )}

          <div
            className={`flex-1 max-w-[85%] ${
              message.role === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {message.content}
              </p>
            </div>
          </div>

          {message.role === 'user' && (
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                <User className="h-5 w-5" />
              </div>
            </div>
          )}
        </motion.div>
      ))}

      {/* Sources */}
      {sources.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <p className="text-xs font-semibold text-muted-foreground">📚 Sources:</p>
          <div className="space-y-2">
            {sources.map((source, index) => (
              <Card key={index} className="p-3 hover:bg-accent transition-colors">
                <Link
                  href={source.url}
                  className="flex items-start justify-between gap-2 group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium group-hover:text-primary transition-colors truncate">
                      {source.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {source.excerpt}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {source.content_type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {Math.round(source.similarity * 100)}% match
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 flex-shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      {/* Loading */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-3"
        >
          <div className="flex-shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-lg bg-muted px-4 py-2">
            <div className="flex gap-1">
              <span className="h-2 w-2 animate-bounce rounded-full bg-foreground/50" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-foreground/50 [animation-delay:0.2s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-foreground/50 [animation-delay:0.4s]" />
            </div>
          </div>
        </motion.div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
