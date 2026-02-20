export function InsightCard({
  index,
  title,
  body,
}: {
  index: number;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border-l-4 border-l-blue-500 bg-card py-3 pl-4 pr-4 dark:border-l-blue-400">
      <p className="mb-1 text-sm font-bold text-foreground">
        <span className="mr-2 text-blue-600 dark:text-blue-400">#{index}</span>
        {title}
      </p>
      <p className="pl-6 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
