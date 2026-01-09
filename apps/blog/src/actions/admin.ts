"use server";

import { auth } from "@/auth";
import { blogApiServerFetch } from "@/lib/blog-api-server";

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

type ApiDashboardData = {
  user_stats: {
    total_users: number;
    total_ink_points: number;
    average_ink_points: number;
    admin_count: number;
  };
  recent_orders: Array<{
    id: string;
    status: string;
    created_at: string;
    user: {
      name: string | null;
      email: string | null;
      image: string | null;
    };
    product: {
      name: string;
      point_price: number;
      image: string | null;
    };
  }>;
  top_users: Array<{
    id: string;
    name: string | null;
    email: string | null;
    ink_points: number;
    order_count: number;
  }>;
  product_stats: Array<{
    id: string;
    name: string;
    category: string;
    order_count: number;
  }>;
};

type ApiSimpleResult = {
  success: boolean;
  message: string;
};

type ApiAdminUser = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  ink_points: number;
  role: string;
  created_at: string;
  order_count: number;
};

export async function isUserAdmin(): Promise<boolean> {
  const session = await auth();
  return session?.user?.role === "ADMIN";
}

export async function getDashboardData(): Promise<DashboardData | null> {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return null;

  const res = await blogApiServerFetch("/api/admin/dashboard", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ user_role: "ADMIN" }),
  });

  const data = (await res.json()) as ApiDashboardData | null;
  if (!res.ok || !data) return null;

  return {
    userStats: {
      totalUsers: data.user_stats.total_users,
      totalInkPoints: data.user_stats.total_ink_points,
      averageInkPoints: data.user_stats.average_ink_points,
      adminCount: data.user_stats.admin_count,
    },
    recentOrders: data.recent_orders.map((o) => ({
      id: o.id,
      status: o.status,
      createdAt: new Date(o.created_at),
      user: o.user,
      product: {
        name: o.product.name,
        pointPrice: o.product.point_price,
        image: o.product.image,
      },
    })),
    topUsers: data.top_users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      inkPoints: u.ink_points,
      orderCount: u.order_count,
    })),
    productStats: data.product_stats.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      orderCount: p.order_count,
    })),
  };
}

export async function getAllUsers() {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) return [];

  const res = await blogApiServerFetch("/api/admin/users", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ user_role: "ADMIN" }),
  });

  if (!res.ok) return [];

  const data = (await res.json()) as ApiAdminUser[];

  return data.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    image: u.image,
    inkPoints: u.ink_points,
    role: u.role,
    createdAt: new Date(u.created_at),
    _count: { orders: u.order_count },
  }));
}

export async function updateUserInkPoints(
  userId: string,
  points: number
): Promise<{ success: boolean; message: string }> {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    return { success: false, message: "Unauthorized" };
  }

  const res = await blogApiServerFetch("/api/admin/users/ink-points", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      user_role: "ADMIN",
      target_user_id: userId,
      points,
    }),
  });

  const data = (await res.json()) as ApiSimpleResult;

  if (!res.ok) {
    return { success: false, message: data?.message ?? "Failed to update points" };
  }

  return { success: data.success, message: data.message };
}
