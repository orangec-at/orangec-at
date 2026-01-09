"use server";

import { auth } from "@/auth";
import { blogApiUrl } from "@/lib/blog-api";
import { blogApiServerFetch } from "@/lib/blog-api-server";
import { revalidatePath } from "next/cache";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  pointPrice: number;
  image: string | null;
  category: string;
  isRare: boolean;
};

export type PurchaseResult = {
  success: boolean;
  message: string;
  remainingPoints?: number;
};

type ApiProduct = {
  id: string;
  name: string;
  description: string;
  price: string;
  point_price: number;
  image: string | null;
  category: string;
  is_rare: boolean;
};

type ApiInkPointsResponse = {
  ink_points: number | null;
};

type ApiPurchaseResult = {
  success: boolean;
  message: string;
  remaining_points: number | null;
};

type ApiOrder = {
  id: string;
  status: string;
  created_at: string;
  product: {
    name: string;
    image: string | null;
    point_price: number;
  };
};

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(blogApiUrl("/api/shop/products"), { cache: "no-store" });
  if (!res.ok) return [];

  const products = (await res.json()) as ApiProduct[];

  return products.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: Number(p.price),
    pointPrice: p.point_price,
    image: p.image,
    category: p.category,
    isRare: p.is_rare,
  }));
}

export async function getUserInkPoints(): Promise<number | null> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;

  const res = await blogApiServerFetch("/api/shop/ink-points", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ user_id: userId }),
  });

  if (!res.ok) return null;

  const data = (await res.json()) as ApiInkPointsResponse;
  return data.ink_points ?? null;
}

export async function buyProduct(productId: string): Promise<PurchaseResult> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return {
      success: false,
      message: "로그인이 필요합니다. (Authentication required)",
    };
  }

  const res = await blogApiServerFetch("/api/shop/buy", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ user_id: userId, product_id: productId }),
  });

  const data = (await res.json()) as ApiPurchaseResult;

  if (!res.ok || !data.success) {
    return {
      success: false,
      message: data?.message ?? "구매 중 오류가 발생했습니다.",
    };
  }

  revalidatePath("/shop");

  return {
    success: true,
    message: data.message,
    remainingPoints: data.remaining_points ?? undefined,
  };
}

export async function getUserOrders() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return [];

  const res = await blogApiServerFetch("/api/shop/orders", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ user_id: userId }),
  });

  if (!res.ok) return [];

  const orders = (await res.json()) as ApiOrder[];

  return orders.map((o) => ({
    id: o.id,
    status: o.status,
    createdAt: new Date(o.created_at),
    product: {
      name: o.product.name,
      image: o.product.image,
      pointPrice: o.product.point_price,
    },
  }));
}
