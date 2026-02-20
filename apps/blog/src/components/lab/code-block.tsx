export function CodeBlock({ children, title }: { children: string; title?: string }) {
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900">
      {title && (
        <div className="border-b border-zinc-700 px-4 py-1.5 text-[11px] font-medium text-zinc-400">
          {title}
        </div>
      )}
      <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-zinc-100">
        <code>{children}</code>
      </pre>
    </div>
  )
}
