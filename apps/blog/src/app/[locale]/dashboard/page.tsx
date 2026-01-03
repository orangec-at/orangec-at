import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getDashboardData, isUserAdmin } from "@/actions/admin";
import { withLocalePath } from "@/lib/locale-path";
import DashboardClient from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const title = locale === "ko" ? "관리자 대시보드" : "Admin Dashboard";
  const description =
    locale === "ko"
      ? "심야 서고 관리자 대시보드"
      : "Midnight Archives Admin Dashboard";

  return {
    title,
    description,
    robots: { index: false, follow: false },
  };
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    redirect(withLocalePath(locale, "/"));
  }

  const data = await getDashboardData();
  if (!data) {
    redirect(withLocalePath(locale, "/"));
  }

  return <DashboardClient data={data} locale={locale} />;
}
