import type { Metadata } from "next";
import { Geist_Mono, Noto_Sans } from "next/font/google";

import AppFooter from "@/components/sections/AppFooter";
import AppMobileBottomBar from "@/components/sections/AppMobileBottomBar";
import AppSharedHeader from "@/components/sections/AppSharedHeader";
import { buildSanityImageUrl } from "@/sanity/lib/image";
import { SanityLive } from "@/sanity/lib/live";
import { getSiteAssets } from "@/sanity/lib/queries";

import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const siteAssets = await getSiteAssets();
  const faviconUrl = buildSanityImageUrl(siteAssets?.brand?.favicon?.image, { width: 96 });
  const appIconUrl = buildSanityImageUrl(siteAssets?.brand?.appIcon?.image, { width: 192 });

  return {
    title: "Betty 周慧萱｜UI/UX・平面設計作品集",
    description:
      "Betty 周慧萱的設計作品集，收錄 UI/UX 介面設計、平面設計、品牌視覺與網站專案，展示從概念發想到實際執行的設計思維與成果。",
    icons: {
      icon: faviconUrl || undefined,
      shortcut: faviconUrl || undefined,
      apple: appIconUrl || faviconUrl || undefined,
    },
  };
}

export default async function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal?: React.ReactNode;
}>) {
  const siteAssets = await getSiteAssets();

  return (
    <html lang="zh-Hant">
      <body className={`${notoSans.variable} ${geistMono.variable} antialiased`}>
        <AppSharedHeader />
        {children}
        {modal}
        <AppFooter />
        <AppMobileBottomBar bottomButtons={siteAssets?.bottomButtons} />
        <SanityLive />
      </body>
    </html>
  );
}
