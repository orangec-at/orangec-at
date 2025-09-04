"use client";

export default function Footer() {
  return (
    <footer className="hidden md:flex items-center justify-center py-6 bg-gray-100 text-gray-700">
      © {new Date().getFullYear()} My Portfolio. All rights reserved.
    </footer>
  );
}
