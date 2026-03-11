//讓搜尋引擎知道你的網站可以被收錄，這是 Next.js App Router 官方支援的 metadata file 寫法
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://myportfolio-iota-orpin-95.vercel.app/sitemap.xml",
  };
}