import ProfileClient from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isKo = locale === "ko";

  return {
    title: isKo ? "프로필 | OrangeCat" : "Profile | OrangeCat",
    description: isKo
      ? "사용자 프로필 및 서고 활동 내역을 확인합니다."
      : "View user profile and library activity history.",
  };
}

export default function ProfilePage() {
  return <ProfileClient />;
}
