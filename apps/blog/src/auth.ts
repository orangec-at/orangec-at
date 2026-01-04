import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Resend from "next-auth/providers/resend"
import { PrismaAdapter } from "@auth/prisma-adapter"
import type { Role } from "@prisma/client"
import { prisma } from "@/lib/prisma"

function getRoleFromUser(user: unknown): Role | undefined {
  if (typeof user !== "object" || user === null) return;
  if (!("role" in user)) return;

  const { role } = user as { role: unknown };
  if (role === "ADMIN" || role === "USER") return role;

  return;
}

function getInkPointsFromUser(user: unknown): number {
  if (typeof user !== "object" || user === null) return 0;
  if (!("inkPoints" in user)) return 0;

  const { inkPoints } = user as { inkPoints: unknown };
  return typeof inkPoints === "number" ? inkPoints : 0;
}

function getOnboardingCompletedFromUser(user: unknown): boolean {
  if (typeof user !== "object" || user === null) return false;
  if (!("onboardingCompletedAt" in user)) return false;

  const { onboardingCompletedAt } = user as { onboardingCompletedAt: unknown };
  return Boolean(onboardingCompletedAt);
}

const authEmailFrom =
  process.env.AUTH_EMAIL_FROM ?? "Archives <onboarding@resend.dev>"

const providers = [
  Google,
  ...(process.env.RESEND_API_KEY
    ? [
        Resend({
          from: authEmailFrom,
        }),
      ]
    : []),
]

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers,
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        session.user.role = getRoleFromUser(user) ?? "USER"
        session.user.inkPoints = getInkPointsFromUser(user)
        session.user.onboardingCompleted = getOnboardingCompletedFromUser(user)
      }

      return session
    },
  },
})
