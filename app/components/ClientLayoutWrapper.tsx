"use client";

import dynamic from "next/dynamic";
import type React from "react";

const Header = dynamic(() => import("@/components/header").then(mod => mod.default));
const Providers = dynamic(() => import("@/app/providers").then(mod => mod.default));

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="flex min-h-screen flex-col">
        <Header />
        {children}
      </div>
    </Providers>
  );
}
