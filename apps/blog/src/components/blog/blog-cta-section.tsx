"use client";

import React from "react";
import { Button } from "@orangec-at/design";
import { Title, Body } from "@orangec-at/design/blog";
import Link from "next/link";

export function BlogCTASection() {
  return (
    <div className="mt-12 rounded-2xl border border-border bg-card/80 p-4 text-center shadow-sm sm:mt-16 sm:p-6 lg:p-8">
      <Title
        variant="l-700"
        as="h3"
        className="text-gray-900 dark:text-white mb-3 sm:mb-4"
      >
        Need these technologies for your project?
      </Title>
      <Body
        variant="m-400"
        className="text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 max-w-2xl mx-auto"
      >
        I can turn your ideas into real services using the technologies covered above.
        <br className="hidden sm:block" />
        <strong>Fast MVP Development</strong>
         to 
        <strong>Stable Operations</strong>
        , let&apos;s work together.
      </Body>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href="/contact">Start Project</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="w-full sm:w-auto"
        >
          <Link href="/projects">View Portfolio</Link>
        </Button>
      </div>
    </div>
  );
}
