import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { withLocalePath } from "@/lib/locale-path";
import LoginClient from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const title = locale === "ko" ? "로그인 | 심야 서고" : "Sign In | Midnight Archives";
  const description =
    locale === "ko"
      ? "이메일로 간편하게 로그인하세요."
      : "Sign in easily with your email.";

  return {
    title,
    description,
    robots: { index: false, follow: false },
  };
}

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  const session = await auth();
  if (session?.user) {
    redirect(withLocalePath(locale, "/profile"));
  }

  return <LoginClient locale={locale} />;
}
