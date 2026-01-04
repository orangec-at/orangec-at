"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Droplets,
  ShoppingCart,
  Package,
  TrendingUp,
  ArrowLeft,
  Clock,
  Crown,
} from "lucide-react";
import Link from "next/link";
import type { DashboardData } from "@/actions/admin";
import { withLocalePath } from "@/lib/locale-path";

interface DashboardClientProps {
  data: DashboardData;
  locale: string;
}

type TabType = "overview" | "orders" | "users" | "products";

export default function DashboardClient({ data, locale }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  const t = {
    title: locale === "ko" ? "관리자 대시보드" : "Admin Dashboard",
    back: locale === "ko" ? "돌아가기" : "Back",
    overview: locale === "ko" ? "개요" : "Overview",
    orders: locale === "ko" ? "주문 내역" : "Orders",
    users: locale === "ko" ? "사용자" : "Users",
    products: locale === "ko" ? "상품" : "Products",
    inbox: locale === "ko" ? "서신함" : "Inbox",
    subscribers: locale === "ko" ? "구독자" : "Subscribers",
    totalUsers: locale === "ko" ? "전체 사용자" : "Total Users",
    totalPoints: locale === "ko" ? "총 잉크 포인트" : "Total Ink Points",
    avgPoints: locale === "ko" ? "평균 포인트" : "Avg Points",
    admins: locale === "ko" ? "관리자" : "Admins",
    recentOrders: locale === "ko" ? "최근 주문" : "Recent Orders",
    topUsers: locale === "ko" ? "상위 사용자" : "Top Users",
    popularProducts: locale === "ko" ? "인기 상품" : "Popular Products",
    noData: locale === "ko" ? "데이터 없음" : "No data",
    points: locale === "ko" ? "포인트" : "pts",
    completed: locale === "ko" ? "완료" : "Completed",
    pending: locale === "ko" ? "대기" : "Pending",
  };

  const tabs = [
    { id: "overview" as const, label: t.overview, icon: TrendingUp },
    { id: "orders" as const, label: t.orders, icon: ShoppingCart },
    { id: "users" as const, label: t.users, icon: Users },
    { id: "products" as const, label: t.products, icon: Package },
  ];

  const statCards = [
    { label: t.totalUsers, value: data.userStats.totalUsers, icon: Users },
    { label: t.totalPoints, value: data.userStats.totalInkPoints.toLocaleString(), icon: Droplets },
    { label: t.avgPoints, value: data.userStats.averageInkPoints, icon: TrendingUp },
    { label: t.admins, value: data.userStats.adminCount, icon: Crown },
  ];

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(locale === "ko" ? "ko-KR" : "en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen paper-texture bg-[#fdfcf5] dark:bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link
          href={withLocalePath(locale, "/")}
          className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800 dark:hover:text-stone-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.back}
        </Link>

        <header className="mb-12">
          <div className="flex items-start justify-between gap-4">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-100 mb-2">
              {t.title}
            </h1>
            <div className="flex items-center gap-2">
              <Link
                href={withLocalePath(locale, "/dashboard/dm")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700"
              >
                {t.inbox}
              </Link>
              <Link
                href={withLocalePath(locale, "/dashboard/subscribers")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700"
              >
                {t.subscribers}
              </Link>
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-stone-900 dark:bg-red-900 text-white"
                    : "bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </header>

        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-6"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <stat.icon className="w-5 h-5 text-stone-400 dark:text-red-500" />
                    <span className="text-xs font-medium uppercase tracking-wider text-stone-500">
                      {stat.label}
                    </span>
                  </div>
                  <p className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">
                    {stat.value}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 mb-4">
                  {t.recentOrders}
                </h3>
                <div className="space-y-3">
                  {data.recentOrders.slice(0, 5).map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between py-2 border-b border-stone-100 dark:border-stone-800 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                          <Package className="w-4 h-4 text-stone-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-stone-900 dark:text-stone-100">
                            {order.product.name}
                          </p>
                          <p className="text-xs text-stone-500">
                            {order.user.name || order.user.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-stone-900 dark:text-stone-100">
                          {order.product.pointPrice} {t.points}
                        </p>
                        <p className="text-xs text-stone-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {data.recentOrders.length === 0 && (
                    <p className="text-sm text-stone-400 text-center py-4">{t.noData}</p>
                  )}
                </div>
              </div>

              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 mb-4">
                  {t.topUsers}
                </h3>
                <div className="space-y-3">
                  {data.topUsers.slice(0, 5).map((user, i) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between py-2 border-b border-stone-100 dark:border-stone-800 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-xs font-bold text-stone-600 dark:text-stone-400">
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-stone-900 dark:text-stone-100">
                            {user.name || "Anonymous"}
                          </p>
                          <p className="text-xs text-stone-500">{user.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-stone-900 dark:text-stone-100 flex items-center gap-1">
                          <Droplets className="w-3 h-3 text-stone-500 dark:text-red-500" />
                          {user.inkPoints}
                        </p>
                        <p className="text-xs text-stone-400">
                          {user.orderCount} orders
                        </p>
                      </div>
                    </div>
                  ))}
                  {data.topUsers.length === 0 && (
                    <p className="text-sm text-stone-400 text-center py-4">{t.noData}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-stone-50 dark:bg-stone-800">
                <tr>
                  <th className="text-left text-xs font-bold uppercase tracking-wider text-stone-500 px-6 py-4">
                    {locale === "ko" ? "상품" : "Product"}
                  </th>
                  <th className="text-left text-xs font-bold uppercase tracking-wider text-stone-500 px-6 py-4">
                    {locale === "ko" ? "구매자" : "Buyer"}
                  </th>
                  <th className="text-left text-xs font-bold uppercase tracking-wider text-stone-500 px-6 py-4">
                    {locale === "ko" ? "가격" : "Price"}
                  </th>
                  <th className="text-left text-xs font-bold uppercase tracking-wider text-stone-500 px-6 py-4">
                    {locale === "ko" ? "상태" : "Status"}
                  </th>
                  <th className="text-left text-xs font-bold uppercase tracking-wider text-stone-500 px-6 py-4">
                    {locale === "ko" ? "일시" : "Date"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {data.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-stone-900 dark:text-stone-100">
                        {order.product.name}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-stone-600 dark:text-stone-400">
                        {order.user.name || order.user.email}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-stone-900 dark:text-stone-100">
                        {order.product.pointPrice} {t.points}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                          order.status === "COMPLETED"
                            ? "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300"
                            : "bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300"
                        }`}
                      >
                        {order.status === "COMPLETED" ? t.completed : t.pending}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-stone-500">{formatDate(order.createdAt)}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.recentOrders.length === 0 && (
              <p className="text-sm text-stone-400 text-center py-8">{t.noData}</p>
            )}
          </div>
        )}

        {activeTab === "users" && (
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-stone-50 dark:bg-stone-800">
                <tr>
                  <th className="text-left text-xs font-bold uppercase tracking-wider text-stone-500 px-6 py-4">
                    {locale === "ko" ? "사용자" : "User"}
                  </th>
                  <th className="text-left text-xs font-bold uppercase tracking-wider text-stone-500 px-6 py-4">
                    {locale === "ko" ? "이메일" : "Email"}
                  </th>
                  <th className="text-left text-xs font-bold uppercase tracking-wider text-stone-500 px-6 py-4">
                    {locale === "ko" ? "잉크 포인트" : "Ink Points"}
                  </th>
                  <th className="text-left text-xs font-bold uppercase tracking-wider text-stone-500 px-6 py-4">
                    {locale === "ko" ? "주문 수" : "Orders"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {data.topUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-stone-900 dark:text-stone-100">
                        {user.name || "Anonymous"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-stone-600 dark:text-stone-400">{user.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-stone-900 dark:text-stone-100 flex items-center gap-1">
                        <Droplets className="w-3 h-3 text-stone-500 dark:text-red-500" />
                        {user.inkPoints}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-stone-600 dark:text-stone-400">{user.orderCount}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.topUsers.length === 0 && (
              <p className="text-sm text-stone-400 text-center py-8">{t.noData}</p>
            )}
          </div>
        )}

        {activeTab === "products" && (
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-stone-50 dark:bg-stone-800">
                <tr>
                  <th className="text-left text-xs font-bold uppercase tracking-wider text-stone-500 px-6 py-4">
                    {locale === "ko" ? "상품명" : "Product"}
                  </th>
                  <th className="text-left text-xs font-bold uppercase tracking-wider text-stone-500 px-6 py-4">
                    {locale === "ko" ? "카테고리" : "Category"}
                  </th>
                  <th className="text-left text-xs font-bold uppercase tracking-wider text-stone-500 px-6 py-4">
                    {locale === "ko" ? "판매 수" : "Sales"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {data.productStats.map((product) => (
                  <tr key={product.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-stone-900 dark:text-stone-100">
                        {product.name}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-stone-900 dark:text-stone-100">
                        {product.orderCount}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.productStats.length === 0 && (
              <p className="text-sm text-stone-400 text-center py-8">{t.noData}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
