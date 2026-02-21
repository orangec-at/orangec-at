import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import LoginClient from "./client";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Sign In | Midnight Archives",
    description: "Sign in easily with your email.",
    robots: { index: false, follow: false },
  };
}

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/about");
  }

  return <LoginClient />;
}
