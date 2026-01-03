"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  ShoppingCart, 
  Droplets, 
  Check, 
  X, 
  Loader2,
  ArrowLeft,
  Package
} from "lucide-react";
import Link from "next/link";
import { buyProduct, type Product, type PurchaseResult } from "@/actions/shop";
import { createCheckoutSession } from "@/actions/checkout";
import { withLocalePath } from "@/lib/locale-path";

interface ShopClientProps {
  products: Product[];
  userPoints: number | null;
  locale: string;
}

const CATEGORY_LABELS: Record<string, { ko: string; en: string }> = {
  "bookmark": { ko: "책갈피", en: "Bookmarks" },
  "stationery": { ko: "문구류", en: "Stationery" },
  "collectible": { ko: "수집품", en: "Collectibles" },
  "digital": { ko: "디지털", en: "Digital" },
  "membership": { ko: "멤버십", en: "Membership" },
};

export default function ShopClient({ products, userPoints, locale }: ShopClientProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [purchaseResult, setPurchaseResult] = useState<PurchaseResult | null>(null);
  const [currentPoints, setCurrentPoints] = useState(userPoints);
  const [isPending, startTransition] = useTransition();

  const isLoggedIn = userPoints !== null;

  const t = {
    title: locale === "ko" ? "심야 서고 상점" : "Midnight Archives Shop",
    subtitle: locale === "ko" 
      ? "잉크 포인트나 실제 결제로 특별한 아이템을 수집하세요" 
      : "Collect special items with Ink Points or real payment",
    yourPoints: locale === "ko" ? "보유 포인트" : "Your Points",
    loginRequired: locale === "ko" ? "로그인 후 이용 가능" : "Login required",
    buy: locale === "ko" ? "구매하기" : "Purchase",
    subscribe: locale === "ko" ? "구독하기" : "Subscribe",
    cancel: locale === "ko" ? "취소" : "Cancel",
    confirm: locale === "ko" ? "결제 확인" : "Confirm Payment",
    confirmMessage: locale === "ko" 
      ? "이 아이템을 결제하시겠습니까?" 
      : "Do you want to proceed with the payment?",
    points: locale === "ko" ? "포인트" : "pts",
    rare: locale === "ko" ? "희귀" : "RARE",
    back: locale === "ko" ? "돌아가기" : "Back",
    noProducts: locale === "ko" ? "상품이 없습니다" : "No products available",
    insufficientPoints: locale === "ko" ? "포인트 부족" : "Insufficient points",
  };

  const groupedProducts = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  const handlePurchase = (product: Product) => {
    if (!isLoggedIn) return;
    
    if (product.price === 0 && currentPoints !== null && currentPoints < product.pointPrice) return;
    
    setSelectedProduct(product);
    setPurchaseResult(null);
  };

  const confirmPurchase = () => {
    if (!selectedProduct) return;

    startTransition(async () => {
      if (selectedProduct.price > 0) {
        const isSubscription = selectedProduct.category === "membership";
        const result = await createCheckoutSession(selectedProduct.id, undefined, isSubscription);
        
        if (result.url) {
          window.location.href = result.url;
        } else if (result.error) {
          setPurchaseResult({ success: false, message: result.error });
        }
        return;
      }

      const result = await buyProduct(selectedProduct.id);
      setPurchaseResult(result);
      
      if (result.success && result.remainingPoints !== undefined) {
        setCurrentPoints(result.remainingPoints);
      }
    });
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setPurchaseResult(null);
  };

  return (
    <div className="min-h-screen paper-texture bg-[#fdfcf5] dark:bg-[#1a1a1a]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Link 
          href={withLocalePath(locale, "/")}
          className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800 dark:hover:text-stone-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.back}
        </Link>

        <header className="mb-16 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-stone-900 dark:text-stone-100 mb-4">
            {t.title}
          </h1>
          <p className="text-stone-600 dark:text-stone-400 text-lg">
            {t.subtitle}
          </p>
          
          <div className="mt-8 inline-flex items-center gap-3 px-6 py-3 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
            <Droplets className="w-5 h-5 text-stone-700 dark:text-red-400" />
            <span className="text-sm font-medium text-stone-500">{t.yourPoints}:</span>
            <span className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
              {isLoggedIn ? currentPoints : "—"}
            </span>
            {!isLoggedIn && (
              <span className="text-xs text-stone-400">({t.loginRequired})</span>
            )}
          </div>
        </header>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 mx-auto text-stone-300 dark:text-stone-700 mb-4" />
            <p className="text-stone-500">{t.noProducts}</p>
          </div>
        ) : (
          <div className="space-y-16">
            {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
              <section key={category}>
                <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-stone-400 dark:text-stone-600 mb-6 border-b border-stone-200 dark:border-stone-800 pb-2">
                  {CATEGORY_LABELS[category]?.[locale as "ko" | "en"] || category}
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {categoryProducts.map((product) => {
                    const canAfford = currentPoints !== null && currentPoints >= product.pointPrice;
                    
                    return (
                      <motion.div
                        key={product.id}
                        whileHover={{ y: -4 }}
                        className={`group relative bg-white dark:bg-stone-900 border rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md ${
                          product.isRare 
                            ? "border-amber-300 dark:border-red-800" 
                            : "border-stone-200 dark:border-stone-800"
                        }`}
                      >
                        {product.isRare && (
                          <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-red-950 rounded text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-red-300">
                            <Sparkles className="w-3 h-3" />
                            {t.rare}
                          </div>
                        )}
                        
                        <div className="aspect-square bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                          {product.image ? (
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-12 h-12 text-stone-300 dark:text-stone-600" />
                          )}
                        </div>
                        
                        <div className="p-4">
                          <h3 className="font-serif font-medium text-stone-900 dark:text-stone-100 mb-1">
                            {product.name}
                          </h3>
                          <p className="text-xs text-stone-500 dark:text-stone-400 mb-4 line-clamp-2">
                            {product.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              {product.price > 0 ? (
                                <span className="font-bold text-stone-900 dark:text-stone-100">
                                  ${product.price}
                                </span>
                              ) : (
                                <>
                                  <Droplets className="w-4 h-4 text-stone-500 dark:text-red-500" />
                                  <span className="font-bold text-stone-900 dark:text-stone-100">
                                    {product.pointPrice}
                                  </span>
                                  <span className="text-xs text-stone-400">{t.points}</span>
                                </>
                              )}
                            </div>
                            
                            <button
                              onClick={() => handlePurchase(product)}
                              disabled={!isLoggedIn || (product.price === 0 && !canAfford)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                                !isLoggedIn
                                  ? "bg-stone-100 dark:bg-stone-800 text-stone-400 cursor-not-allowed"
                                  : (product.price > 0 || canAfford)
                                    ? "bg-stone-900 dark:bg-red-900 text-white hover:bg-stone-700 dark:hover:bg-red-800"
                                    : "bg-stone-100 dark:bg-stone-800 text-stone-400 cursor-not-allowed"
                              }`}
                            >
                              <ShoppingCart className="w-3 h-3" />
                              {!canAfford && isLoggedIn && product.price === 0 
                                ? t.insufficientPoints 
                                : product.category === "membership" ? t.subscribe : t.buy}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-sm p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-stone-900 rounded-lg shadow-2xl max-w-sm w-full overflow-hidden border border-stone-200 dark:border-stone-800"
            >
              {purchaseResult ? (
                <div className="p-8 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    purchaseResult.success 
                      ? "bg-green-100 dark:bg-green-950" 
                      : "bg-red-100 dark:bg-red-950"
                  }`}>
                    {purchaseResult.success ? (
                      <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                    ) : (
                      <X className="w-8 h-8 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <p className="text-stone-900 dark:text-stone-100 font-medium mb-2">
                    {purchaseResult.message}
                  </p>
                  {purchaseResult.success && purchaseResult.remainingPoints !== undefined && (
                    <p className="text-sm text-stone-500">
                      {t.yourPoints}: {purchaseResult.remainingPoints} {t.points}
                    </p>
                  )}
                  <button
                    onClick={closeModal}
                    className="mt-6 px-6 py-2 bg-stone-900 dark:bg-stone-800 text-white rounded hover:bg-stone-700 transition-colors"
                  >
                    {t.cancel}
                  </button>
                </div>
              ) : (
                <>
                  <div className="aspect-video bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                    {selectedProduct.image ? (
                      <img 
                        src={selectedProduct.image} 
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-16 h-16 text-stone-300 dark:text-stone-600" />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">
                      {selectedProduct.name}
                    </h3>
                    <p className="text-sm text-stone-500 dark:text-stone-400 mb-4">
                      {selectedProduct.description}
                    </p>
                    <div className="flex items-center gap-2 mb-6">
                      {selectedProduct.price > 0 ? (
                        <span className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                          ${selectedProduct.price}
                        </span>
                      ) : (
                        <>
                          <Droplets className="w-5 h-5 text-stone-600 dark:text-red-500" />
                          <span className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                            {selectedProduct.pointPrice}
                          </span>
                          <span className="text-stone-400">{t.points}</span>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-stone-600 dark:text-stone-400 mb-6">
                      {t.confirmMessage}
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={closeModal}
                        className="flex-1 px-4 py-2 border border-stone-300 dark:border-stone-700 rounded text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                      >
                        {t.cancel}
                      </button>
                      <button
                        onClick={confirmPurchase}
                        disabled={isPending}
                        className="flex-1 px-4 py-2 bg-stone-900 dark:bg-red-900 text-white rounded hover:bg-stone-700 dark:hover:bg-red-800 transition-colors flex items-center justify-center gap-2"
                      >
                        {isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                        {t.confirm}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
