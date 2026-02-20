export function AnalysisCard({
  index,
  title,
  body,
}: {
  index: number;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="mb-1 text-sm font-bold text-foreground">
        <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
          {index}
        </span>
        {title}
      </p>
      <p className="pl-8 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
