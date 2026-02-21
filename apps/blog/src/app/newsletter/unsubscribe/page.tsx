import Link from "next/link";

import { unsubscribeNewsletter } from "@/actions/newsletter";

export default async function NewsletterUnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  const result = await unsubscribeNewsletter({ token: token ?? "" });

  return (
    <div className="container-narrow py-section">
      <div className="space-y-8">
        <h1 className="text-h2 font-serif text-foreground">
          {result.success
            ? "Unsubscribed"
            : "Unsubscribe Failed"}
        </h1>
        <p className="text-body text-muted-foreground">
          {result.message}
        </p>

        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-small font-medium text-muted-foreground transition-colors hover:border-ember-accent hover:text-ember-accent"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
