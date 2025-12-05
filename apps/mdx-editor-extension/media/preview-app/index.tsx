/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { compile, run } from '@mdx-js/mdx';
import { MDXProvider, type MDXComponents } from '@mdx-js/react';
import * as runtime from 'react/jsx-runtime';
import matter from 'gray-matter';
import * as DesignSystem from '@orangec-at/design';

declare function acquireVsCodeApi(): {
  postMessage: (msg: any) => void;
  setState: (state: any) => void;
  getState: () => any;
};

type RenderState =
  | { status: 'idle' }
  | { status: 'rendering' }
  | { status: 'error'; message: string };

const vscode = acquireVsCodeApi();

const designComponents: MDXComponents = {
  ...DesignSystem
};

/**
 * 프론트매터/불필요한 import/export 제거
 */
function sanitizeMdx(raw: string): string {
  const { content } = matter(raw);
  const lines = content.split('\n').filter(line => {
    const trimmed = line.trim();
    return !trimmed.startsWith('import ') && !trimmed.startsWith('export ');
  });
  return lines.join('\n');
}

async function renderMdx(raw: string): Promise<React.ReactElement> {
  const cleaned = sanitizeMdx(raw);

  const compiled = await compile(cleaned, {
    outputFormat: 'function-body',
    development: true
  });

  const { default: Content } = await run(compiled, {
    ...runtime,
    useMDXComponents: () => designComponents
  });

  return (
    <MDXProvider components={designComponents}>
      <Content />
    </MDXProvider>
  );
}

function App() {
  const [state, setState] = useState<RenderState>({ status: 'idle' });
  const [content, setContent] = useState<React.ReactNode>(null);

  useEffect(() => {
    const handler = async (event: MessageEvent) => {
      const message = event.data;
      if (message?.command !== 'update') return;

      setState({ status: 'rendering' });
      try {
        const element = await renderMdx(message.content);
        setContent(element);
        setState({ status: 'idle' });
      } catch (error: any) {
        console.error('MDX render error', error);
        const messageText = error?.message || 'Failed to render MDX';
        setState({ status: 'error', message: messageText });
        vscode.postMessage({ command: 'error', text: messageText });
      }
    };

    window.addEventListener('message', handler);
    vscode.postMessage({ command: 'ready' });

    return () => {
      window.removeEventListener('message', handler);
    };
  }, []);

  return (
    <div id="preview-container">
      {state.status === 'rendering' && <div id="loading">Rendering MDX...</div>}
      {state.status === 'error' && (
        <div id="error">{state.message}</div>
      )}
      <div id="preview-content">{content}</div>
    </div>
  );
}

const root = createRoot(document.getElementById('preview-container')!);
root.render(<App />);
