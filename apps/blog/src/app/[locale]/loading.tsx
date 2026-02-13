import { getLocale } from "next-intl/server";

export default async function LocaleLoading() {
  const locale = await getLocale();
  const isKo = locale === "ko";

  return (
    <section className="container-narrow py-section" aria-live="polite" aria-busy="true">
      <div className="rounded-2xl border border-border bg-card p-8 md:p-10">
        <p className="text-micro uppercase tracking-[0.2em] text-ember-accent">
          {isKo ? "로딩 중" : "Loading"}
        </p>
        <h1 className="mt-3 text-h2 font-serif text-foreground">
          {isKo ? "페이지를 준비하고 있습니다..." : "Preparing this page..."}
        </h1>
        <p className="mt-4 text-body text-muted-foreground">
          {isKo
            ? "콘텐츠를 불러오고 있습니다. 잠시만 기다려 주세요."
            : "Content is loading. This should only take a moment."}
        </p>
        <div className="mt-8 h-1.5 w-full overflow-hidden rounded-full bg-muted/50">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-ember-accent/70" />
        </div>
      </div>
    </section>
  );
}
