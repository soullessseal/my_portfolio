import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { client } from "./client";

export type Category = "uiux" | "graphic" | "other";

export type ProjectListItem = {
  id: string;
  designName: string;
  category: Category;
  customCategoryLabel?: string;
  extraTag?: string;
  cover?: SanityImageSource;
};

const projectsListQuery = `*[_type=="project"] | order(_createdAt desc)[0..100]{
  "id": _id,
  designName,
  category,
  customCategoryLabel,
  extraTag,
  "cover": coalesce(coverImage, gallerySections[0].images[0])
}`;

export async function getProjectsList(): Promise<ProjectListItem[]> {
  return client.fetch(projectsListQuery);
}
