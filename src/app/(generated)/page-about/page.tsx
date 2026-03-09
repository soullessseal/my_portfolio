import AboutPage from "@/components/pages/AboutPage";
import { getSiteAssets } from "@/sanity/lib/queries";

export default async function GeneratedPageAboutPage() {
  const siteAssets = await getSiteAssets();

  return <AboutPage siteAssets={siteAssets} />;
}
