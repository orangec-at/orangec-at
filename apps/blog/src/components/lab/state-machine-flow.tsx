export function StateMachineFlow({ states }: { states: string[][] }) {
  return (
    <div className="space-y-3">
      {states.map((flow, fi) => (
        <div key={fi} className="flex flex-wrap items-center gap-2">
          {flow.map((state, si) => (
            <span key={`${fi}-${si}`} className="flex items-center gap-2">
              <span className="inline-block rounded-lg border border-border bg-muted px-3 py-1.5 text-xs font-medium text-foreground">
                {state}
              </span>
              {si < flow.length - 1 && (
                <svg
                  width="20"
                  height="12"
                  viewBox="0 0 20 12"
                  className="shrink-0 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="0" y1="6" x2="15" y2="6" />
                  <polyline points="12,2 16,6 12,10" />
                </svg>
              )}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}
