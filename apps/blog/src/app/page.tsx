import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function RootPage() {
  // Get the Accept-Language header to determine user's preferred language
  const headersList = headers();
  const acceptLanguage = headersList.get("accept-language") || "";
  
  // Simple language detection - prioritize Korean if detected
  const preferredLanguage = acceptLanguage.includes("ko") ? "ko" : "en";
  
  // Redirect to the appropriate language route
  redirect(`/${preferredLanguage}`);
}