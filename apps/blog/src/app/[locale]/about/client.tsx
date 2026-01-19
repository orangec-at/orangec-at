"use client";

import { KineticAbout } from "@/components/kinetic/kinetic-about";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { withLocalePath } from "@/lib/locale-path";

export default function AboutClient() {
  const router = useRouter();
  const locale = useLocale();

  const handleBack = () => {
    router.push(withLocalePath(locale, "/"));
  };

  return <KineticAbout onBack={handleBack} />;
}
