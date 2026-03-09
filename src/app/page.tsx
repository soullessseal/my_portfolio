import HomePage from "@/components/pages/HomePage";
import { getSiteAssets } from "@/sanity/lib/queries";

export default async function Home() {
  const siteAssets = await getSiteAssets();

  return <HomePage siteAssets={siteAssets} />;
}
