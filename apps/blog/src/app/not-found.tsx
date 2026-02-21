import Link from "next/link";

export default function LocaleNotFound() {

  return (
    <section className="container-narrow py-section">
      <div className="rounded-2xl border border-border bg-card p-8 md:p-10">
        <p className="text-micro uppercase tracking-[0.2em] text-ember-accent">404</p>
        <h1 className="mt-3 text-h1 font-serif text-foreground">
          Page not found.
        </h1>
        <p className="mt-4 max-w-2xl text-body text-muted-foreground">
          The URL may have changed or the page no longer exists. Use the link below to return home.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center rounded-full border border-border px-5 py-2 text-small text-muted-foreground transition-colors hover:border-ember-accent/40 hover:text-ember-accent"
        >
          Back to home
        </Link>
      </div>
    </section>
  );
}
