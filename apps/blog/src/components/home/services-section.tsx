"use client";

import { Button } from "@orangec-at/design";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { RocketIcon, CodeIcon, UsersIcon } from "lucide-react";

export default function ServicesSection() {
  const t = useTranslations("home.services");

  const services = [
    {
      icon: <RocketIcon className="w-6 h-6" />,
      title: t("website.title"),
      description: t("website.description"),
      price: t("website.price"),
      features: [
        t("website.features.0"),
        t("website.features.1"),
        t("website.features.2"),
        t("website.features.3"),
      ],
    },
    {
      icon: <CodeIcon className="w-6 h-6" />,
      title: t("designSystem.title"),
      description: t("designSystem.description"),
      price: t("designSystem.price"),
      features: [
        t("designSystem.features.0"),
        t("designSystem.features.1"),
        t("designSystem.features.2"),
        t("designSystem.features.3"),
      ],
    },
    {
      icon: <UsersIcon className="w-6 h-6" />,
      title: t("coaching.title"),
      description: t("coaching.description"),
      price: t("coaching.price"),
      features: [
        t("coaching.features.0"),
        t("coaching.features.1"),
        t("coaching.features.2"),
        t("coaching.features.3"),
      ],
    },
  ];

  return (
    <section className="py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("title")}</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {services.map((service, index) => (
          <div
            key={index}
            className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold">{service.title}</h3>
            </div>
            <p className="text-muted-foreground mb-4">{service.description}</p>
            <div className="text-2xl font-bold mb-4 text-primary">
              {service.price}
            </div>
            <ul className="space-y-2 mb-6">
              {service.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="text-center bg-muted/50 rounded-lg p-8">
        <h3 className="text-2xl font-semibold mb-4">{t("cta.title")}</h3>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          {t("cta.description")}
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/contact">
            <Button size="large">{t("cta.primary")}</Button>
          </Link>
          <Link href="/projects">
            <Button variant="outline" size="large">
              {t("cta.secondary")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
