import type { DefaultSession } from "next-auth";
import type { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user?: DefaultSession["user"] & {
      id: string;
      role: Role;
      inkPoints: number;
    };
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
    role: Role;
    inkPoints: number;
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser {
    role: Role;
    inkPoints: number;
  }
}
