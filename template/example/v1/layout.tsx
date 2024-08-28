"use client";

import { Providers } from "@/core/context/Providers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/layout/Header";
import { SidebarMenu } from "@/components/layout/SidebarMenu";

const queryClient = new QueryClient();

export default function V1Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider client={queryClient}>
      <Providers>
        <div className="h-dvh overflow-hidden relative">
          <Header /> {/** The Header is 56px of height */}
          <div className="h-[calc(100%-56px)] flex">
            <SidebarMenu />
            <main className="flex-grow overflow-y-auto">{children}</main>
          </div>
        </div>
        <Toaster />
      </Providers>
    </QueryClientProvider>
  );
}
