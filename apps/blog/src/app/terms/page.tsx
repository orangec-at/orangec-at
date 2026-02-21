import Link from "next/link";

export default async function TermsPage() {

  return (
    <div className="container-narrow py-section">
      <div className="space-y-8">
        <h1 className="text-h2 font-serif text-foreground">
          Terms
        </h1>
        <p className="text-body text-muted-foreground">
          This page describes the terms of use.
        </p>

        <div className="space-y-4 text-small text-muted-foreground">
          <p>
            This project is in early stage; full terms will be published later.
          </p>
          <p>
            For inquiries, use the contact page.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-small font-medium text-muted-foreground transition-colors hover:border-ember-accent hover:text-ember-accent"
          >
            Home
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-small font-medium text-background transition-colors hover:bg-ember-accent hover:text-primary-foreground"
          >
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}
