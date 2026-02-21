"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

import { completeOnboarding } from "@/actions/onboarding";

export default function OnboardingClient({
  email,
  from,
}: {
  email: string;
  from: string | null;
}) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [newsletterOptIn, setNewsletterOptIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const target = useMemo(() => {
    if (from && from.startsWith("/") && !from.includes("/onboarding")) return from;
    return "/";
  }, [from]);

  const onSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await completeOnboarding({
        acceptTerms,
        newsletterOptIn,
        locale: "en",
      });

      if (!result.success) {
        setError(result.message);
        return;
      }

      router.push(target);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-xl mx-auto px-4 py-section">
        <h1 className="font-serif text-3xl font-bold text-foreground">
          Finish setup
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Review the required items to continue.
        </p>

        <div className="mt-8 rounded-lg border border-border bg-card p-6">
          <div className="text-xs tracking-widest text-muted-foreground">
            Signed-in email
          </div>
          <div className="mt-2 text-sm font-medium text-foreground">
            {email || "-"}
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <div className="text-xs tracking-widest text-muted-foreground">
              Step {step}/2
            </div>
            <div className="text-xs tracking-widest text-muted-foreground">
              {step === 1
                ? "Required"
                : "Newsletter"}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {step === 1 ? (
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1"
                />
                <div>
                  <div className="text-sm font-medium text-foreground">
                    <>
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        className="text-ember-accent underline underline-offset-4"
                      >
                        terms
                      </Link>
                      {" and "}
                      <Link
                        href="/privacy"
                        className="text-ember-accent underline underline-offset-4"
                      >
                        privacy policy
                      </Link>
                    </>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Required to use the service.
                  </div>
                </div>
              </label>
            ) : (
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={newsletterOptIn}
                  onChange={(e) => setNewsletterOptIn(e.target.checked)}
                  className="mt-1"
                />
                <div>
                  <div className="text-sm font-medium text-foreground">
                    Subscribe to the newsletter
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Get occasional updates by email.
                  </div>
                </div>
              </label>
            )}
          </div>

          {error && (
            <div className="mt-6 text-sm text-destructive">{error}</div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-ember-accent hover:text-ember-accent"
              >
                Back
              </button>
            )}

            <button
              type="button"
              onClick={() => (step === 1 ? setStep(2) : void onSubmit())}
              disabled={isSubmitting || (step === 1 && !acceptTerms)}
              className="inline-flex items-center justify-center rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-ember-accent hover:text-primary-foreground disabled:pointer-events-none disabled:opacity-50"
            >
              {isSubmitting
                ? "Saving..."
                : step === 1
                  ? "Continue"
                  : "Finish"}
            </button>

            <button
              type="button"
              onClick={() => void signOut({ callbackUrl: "/" })}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-ember-accent hover:text-ember-accent"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
