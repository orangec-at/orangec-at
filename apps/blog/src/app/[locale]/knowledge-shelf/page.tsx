import { redirect } from "next/navigation";
import { withLocalePath } from "@/lib/locale-path";

interface KnowledgeShelfPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function KnowledgeShelfPage({
  params,
}: KnowledgeShelfPageProps) {
  const { locale } = await params;
  redirect(withLocalePath(locale, "/"));
}
