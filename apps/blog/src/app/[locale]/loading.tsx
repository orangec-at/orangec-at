export default function LocaleLoading() {
  return (
    <div
      className="fixed inset-x-0 top-0 z-[70] pointer-events-none"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading…</span>
      <div className="h-[2px] w-full bg-transparent">
        <div className="h-full w-1/3 animate-pulse bg-ember-accent/70" />
      </div>
    </div>
  );
}
