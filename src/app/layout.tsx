import type { Metadata } from "next";
import { Geist_Mono, Noto_Sans } from "next/font/google";
import AppMobileBottomBar from "@/components/sections/AppMobileBottomBar";
import AppSharedHeader from "@/components/sections/AppSharedHeader";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Betty | Designer",
  description:
    "UI/UX、平面設計與品牌視覺作品集，收錄網站介面、海報文宣、活動視覺與專案流程，展示 Betty 的設計思維與實作成果。",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal?: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body className={`${notoSans.variable} ${geistMono.variable} antialiased`}>
        <AppSharedHeader />
        {children}
        {modal}
        <AppMobileBottomBar />
      </body>
    </html>
  );
}
