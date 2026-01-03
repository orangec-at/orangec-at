"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export type UserStats = {
  totalUsers: number;
  totalInkPoints: number;
  averageInkPoints: number;
  adminCount: number;
};

export type OrderWithDetails = {
  id: string;
  status: string;
  createdAt: Date;
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
  product: {
    name: string;
    pointPrice: number;
    image: string | null;
  };
};

export type DashboardData = {
  userStats: UserStats;
  recentOrders: OrderWithDetails[];
  topUsers: Array<{
    id: string;
    name: string | null;
    email: string | null;
    inkPoints: number;
    orderCount: number;
  }>;
  productStats: Array<{
    id: string;
    name: string;
    category: string;
    orderCount: number;
  }>;
};

export async function isUserAdmin(): Promise<boolean> {
  const session = await auth();
  return session?.user?.role === "ADMIN";
}

export async function getDashboardData(): Promise<DashboardData | null> {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return null;

  const [users, orders, products] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        inkPoints: true,
        role: true,
        _count: { select: { orders: true } },
      },
      orderBy: { inkPoints: "desc" },
      take: 10,
    }),
    prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true, image: true } },
        product: { select: { name: true, pointPrice: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.product.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        _count: { select: { orders: true } },
      },
      orderBy: { orders: { _count: "desc" } },
    }),
  ]);

  const totalUsers = users.length;
  const totalInkPoints = users.reduce((sum: number, u: typeof users[number]) => sum + u.inkPoints, 0);
  const adminCount = users.filter((u: typeof users[number]) => u.role === "ADMIN").length;

  return {
    userStats: {
      totalUsers,
      totalInkPoints,
      averageInkPoints: totalUsers > 0 ? Math.round(totalInkPoints / totalUsers) : 0,
      adminCount,
    },
    recentOrders: orders.map((o: typeof orders[number]) => ({
      id: o.id,
      status: o.status,
      createdAt: o.createdAt,
      user: o.user,
      product: o.product,
    })),
    topUsers: users.map((u: typeof users[number]) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      inkPoints: u.inkPoints,
      orderCount: u._count.orders,
    })),
    productStats: products.map((p: typeof products[number]) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      orderCount: p._count.orders,
    })),
  };
}

export async function getAllUsers() {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) return [];

  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      inkPoints: true,
      role: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateUserInkPoints(
  userId: string,
  points: number
): Promise<{ success: boolean; message: string }> {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { inkPoints: points },
    });
    return { success: true, message: "Points updated successfully" };
  } catch {
    return { success: false, message: "Failed to update points" };
  }
}
