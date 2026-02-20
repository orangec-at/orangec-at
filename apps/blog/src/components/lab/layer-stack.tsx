export interface LayerItem {
  label: string
  sub: string
  color: string // Tailwind classes for border + bg, e.g. border-blue-200 bg-blue-50
}

export function LayerStack({ layers }: { layers: LayerItem[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      {layers.map((layer, i) => (
        <div key={i} className={`rounded-lg border px-4 py-2.5 ${layer.color}`}>
          <p className="text-xs font-medium text-foreground">{layer.label}</p>
          <p className="text-[10px] text-muted-foreground">{layer.sub}</p>
        </div>
      ))}
    </div>
  )
}
