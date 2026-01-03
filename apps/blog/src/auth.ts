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

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google,
    Resend({
      from: "Archives <onboarding@resend.dev>",
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        session.user.role = getRoleFromUser(user) ?? "USER"
        session.user.inkPoints = (user as any).inkPoints ?? 0
      }

      return session
    },
  },
})
