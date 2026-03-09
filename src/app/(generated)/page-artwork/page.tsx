import ArtworkPage from "@/components/pages/ArtworkPage";
import { getProjectsList, getSiteAssets } from "@/sanity/lib/queries";

export const revalidate = 300;
export const dynamic = "force-static";

export default async function GeneratedPageArtworkPage() {
  const [projects, siteAssets] = await Promise.all([
    getProjectsList(),
    getSiteAssets(),
  ]);

  return <ArtworkPage projects={projects} siteAssets={siteAssets} />;
}
