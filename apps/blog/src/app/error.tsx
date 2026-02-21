"use client";

import Link from "next/link";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function LocaleError({ error, reset }: ErrorPageProps) {
  return (
    <section className="container-narrow py-section">
      <div className="rounded-2xl border border-border bg-card p-8 md:p-10">
        <p className="text-micro uppercase tracking-[0.2em] text-ember-accent">
          Something went wrong
        </p>
        <h1 className="mt-3 text-h1 font-serif text-foreground">
          We could not load this page.
        </h1>
        <p className="mt-4 max-w-2xl text-body text-muted-foreground">
          Please try again in a moment. If the problem continues, continue browsing from another page.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center rounded-full border border-ember-accent/40 bg-ember-accent-bg px-5 py-2 text-small font-medium text-ember-accent transition-colors hover:bg-ember-accent/15"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-border px-5 py-2 text-small text-muted-foreground transition-colors hover:border-ember-accent/40 hover:text-ember-accent"
          >
            Go to home
          </Link>
        </div>
        {error.digest && (
          <p className="mt-6 text-micro font-mono text-muted-foreground">Digest: {error.digest}</p>
        )}
      </div>
    </section>
  );
}
