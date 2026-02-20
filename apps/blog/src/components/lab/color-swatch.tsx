export function ColorSwatch({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="inline-block h-5 w-5 rounded-full border border-border"
        style={{ backgroundColor: color }}
      />
      <span className="text-xs text-muted-foreground">
        <span className="font-mono">{color}</span>
        <span className="ml-1.5 text-foreground">{label}</span>
      </span>
    </div>
  );
}
