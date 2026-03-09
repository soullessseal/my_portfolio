import { client } from "@/sanity/lib/client";
import ProjectDetailModal from "@/components/sections/ProjectDetailModal";

const query = `*[_type=="project" && _id==$id][0]{
  _id,
  designName,
  category,
  customCategoryLabel,
  extraTag,
  gallerySections[]{
    _key,
    subtitle,
    images,
    convertedMedia[]{
      sourceImageRef,
      video{
        asset
      }
    }
  }
}`;

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await client.fetch(query, { id });

  return (
    <ProjectDetailModal
      project={project}
      closeHref="/page-artwork"
    />
  );
}
