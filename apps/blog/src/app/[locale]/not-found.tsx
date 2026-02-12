import { getLocale } from "next-intl/server";

export default async function LocaleNotFound() {
  const locale = await getLocale();
  const isKo = locale === "ko";

  return (
    <section className="container-narrow py-section">
      <div className="rounded-2xl border border-border bg-card p-8 md:p-10">
        <p className="text-micro uppercase tracking-[0.2em] text-ember-accent">404</p>
        <h1 className="mt-3 text-h1 font-serif text-foreground">
          {isKo ? "페이지를 찾을 수 없습니다." : "Page not found."}
        </h1>
        <p className="mt-4 max-w-2xl text-body text-muted-foreground">
          {isKo
            ? "주소가 변경되었거나 존재하지 않는 페이지입니다. 아래 버튼으로 홈으로 이동해 주세요."
            : "The URL may have changed or the page no longer exists. Use the link below to return home."}
        </p>
        <a
          href={isKo ? "/" : "/en"}
          className="mt-8 inline-flex items-center rounded-full border border-border px-5 py-2 text-small text-muted-foreground transition-colors hover:border-ember-accent/40 hover:text-ember-accent"
        >
          {isKo ? "홈으로 이동" : "Back to home"}
        </a>
      </div>
    </section>
  );
}
