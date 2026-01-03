"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
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

export async function getProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    orderBy: [
      { isRare: "desc" },
      { category: "asc" },
      { name: "asc" },
    ],
  });

  return products.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: Number(p.price),
    pointPrice: p.pointPrice,
    image: p.image,
    category: p.category,
    isRare: p.isRare,
  }));
}

export async function getUserInkPoints(): Promise<number | null> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { inkPoints: true },
  });

  return user?.inkPoints ?? null;
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

  try {
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true, inkPoints: true },
      });

      if (!user) {
        throw new Error("사용자를 찾을 수 없습니다. (User not found)");
      }

      const product = await tx.product.findUnique({
        where: { id: productId },
        select: { id: true, name: true, pointPrice: true },
      });

      if (!product) {
        throw new Error("상품을 찾을 수 없습니다. (Product not found)");
      }

      if (user.inkPoints < product.pointPrice) {
        throw new Error(
          `잉크 포인트가 부족합니다. 필요: ${product.pointPrice}, 보유: ${user.inkPoints}`
        );
      }

      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: { inkPoints: { decrement: product.pointPrice } },
        select: { inkPoints: true },
      });

      await tx.order.create({
        data: {
          userId: user.id,
          productId: product.id,
          status: "COMPLETED",
        },
      });

      return {
        productName: product.name,
        remainingPoints: updatedUser.inkPoints,
      };
    });

    revalidatePath("/shop");

    return {
      success: true,
      message: `"${result.productName}" 구매 완료! (Purchase successful)`,
      remainingPoints: result.remainingPoints,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "구매 중 오류가 발생했습니다.";
    return {
      success: false,
      message,
    };
  }
}

export async function getUserOrders() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return [];

  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      product: {
        select: {
          name: true,
          image: true,
          pointPrice: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return orders;
}
