import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  if (!token || !email) {
    return NextResponse.redirect(new URL("/login?error=invalid", request.url));
  }

  const blogApiUrl = process.env.BLOG_API_URL ?? process.env.NEXT_PUBLIC_BLOG_API_URL ?? "http://localhost:8080";

  try {
    const response = await fetch(`${blogApiUrl}/api/auth/verify`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-internal-api-key": process.env.BLOG_API_INTERNAL_KEY ?? "",
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();

    if (!data.success || !data.session_token) {
      return NextResponse.redirect(new URL("/login?error=expired", request.url));
    }

    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === "production";
    const cookieName = isProduction 
      ? "__Secure-next-auth.session-token" 
      : "next-auth.session-token";
    
    cookieStore.set(cookieName, data.session_token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    return NextResponse.redirect(new URL("/", request.url));
  } catch (error) {
    console.error("Email callback error:", error);
    return NextResponse.redirect(new URL("/login?error=server", request.url));
  }
}
