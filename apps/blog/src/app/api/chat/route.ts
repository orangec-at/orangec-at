import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await auth();
    const { message, locale = 'ko', threadId } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    let currentThreadId = threadId;
    const userId = session?.user?.id;

    if (userId) {
      try {
        if (!currentThreadId) {
          const newThread = await prisma.thread.create({
            data: {
              userId,
              title: message.slice(0, 50),
            },
          });
          currentThreadId = newThread.id;
        }

        await prisma.message.create({
          data: {
            role: 'user',
            content: message,
            threadId: currentThreadId,
          },
        });
      } catch (e) {
        console.error('Failed to save message to DB:', e);
      }
    }

    const ragServiceUrl = process.env.RAG_SERVICE_URL || 'http://localhost:7073/api/chat';
    
    const ragResponse = await fetch(ragServiceUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: message, locale }),
    });

    if (!ragResponse.ok) {
      const errorText = await ragResponse.text();
      throw new Error(`RAG Service Error: ${ragResponse.status} - ${errorText}`);
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    let fullResponseText = '';

    const stream = new ReadableStream({
      async start(controller) {
        const reader = ragResponse.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            
            const lines = chunk.split('\n');
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6));
                  if (data.type === 'content') {
                    fullResponseText += data.content;
                  }
                } catch {
                }
              }
            }

            controller.enqueue(value);
          }

          if (userId && currentThreadId && fullResponseText) {
            await prisma.message.create({
              data: {
                role: 'model',
                content: fullResponseText,
                threadId: currentThreadId,
              },
            });
            await prisma.thread.update({
              where: { id: currentThreadId },
              data: { updatedAt: new Date() },
            });
          }
        } catch (e) {
          controller.error(e);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
