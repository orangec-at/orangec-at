"use client";

import { useLocale } from "next-intl";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function LocaleError({ error, reset }: ErrorPageProps) {
  const locale = useLocale();
  const isKo = locale === "ko";

  return (
    <section className="container-narrow py-section">
      <div className="rounded-2xl border border-border bg-card p-8 md:p-10">
        <p className="text-micro uppercase tracking-[0.2em] text-ember-accent">
          {isKo ? "문제가 발생했습니다" : "Something went wrong"}
        </p>
        <h1 className="mt-3 text-h1 font-serif text-foreground">
          {isKo ? "페이지를 불러오지 못했습니다." : "We could not load this page."}
        </h1>
        <p className="mt-4 max-w-2xl text-body text-muted-foreground">
          {isKo
            ? "잠시 후 다시 시도해 주세요. 문제가 계속되면 다른 경로로 이동해 주세요."
            : "Please try again in a moment. If the problem continues, continue browsing from another page."}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center rounded-full border border-ember-accent/40 bg-ember-accent-bg px-5 py-2 text-small font-medium text-ember-accent transition-colors hover:bg-ember-accent/15"
          >
            {isKo ? "다시 시도" : "Try again"}
          </button>
          <a
            href={isKo ? "/" : "/en"}
            className="inline-flex items-center rounded-full border border-border px-5 py-2 text-small text-muted-foreground transition-colors hover:border-ember-accent/40 hover:text-ember-accent"
          >
            {isKo ? "홈으로 이동" : "Go to home"}
          </a>
        </div>
        {error.digest && (
          <p className="mt-6 text-micro font-mono text-muted-foreground">Digest: {error.digest}</p>
        )}
      </div>
    </section>
  );
}
