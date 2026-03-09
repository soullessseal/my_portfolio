import ArtworkPage from "@/components/pages/ArtworkPage";
import { getProjectsList } from "@/sanity/lib/queries";

export const revalidate = 300;
export const dynamic = "force-static";

export default async function GeneratedPageArtworkPage() {
  const projects = await getProjectsList();

  return <ArtworkPage projects={projects} />;
}
