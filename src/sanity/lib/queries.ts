import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { defineQuery } from "next-sanity";

import { client } from "./client";

export type Category = "uiux" | "graphic" | "other";
export type ImageFolder = "featured" | "hero" | "contact" | "nav" | "buttons" | "icons";

export type MigratedImage = {
  alt?: string;
  caption?: string;
  order?: number;
  folder?: ImageFolder;
  image?: SanityImageSource & {
    asset?: {
      _id: string;
      url: string;
      metadata?: {
        lqip?: string;
        dimensions?: {
          width?: number;
          height?: number;
          aspectRatio?: number;
        };
      };
    };
  };
};

export type MigratedFeaturedMedia = MigratedImage & {
  _type?: string;
  asset?: {
    _id: string;
    url: string;
    originalFilename?: string;
    metadata?: {
      lqip?: string;
      dimensions?: {
        width?: number;
        height?: number;
        aspectRatio?: number;
      };
    };
  };
  hotspot?: unknown;
  crop?: unknown;
  video?: {
    asset?: {
      _id: string;
      url: string;
      originalFilename?: string;
    };
  };
};

export type ProjectListItem = {
  id: string;
  designName: string;
  category: Category;
  customCategoryLabel?: string;
  extraTag?: string;
  cover?: MigratedImage["image"];
};

export type SiteAssets = {
  hero?: {
    desktopImage?: MigratedImage;
    mobileImage?: MigratedImage;
  };
  contact?: {
    photo?: MigratedImage;
  };
  brand?: {
    logo?: MigratedImage;
    favicon?: MigratedImage;
    appIcon?: MigratedImage;
  };
  selectIcons?: Array<{
    _key: string;
    key: "project-1" | "project-2" | "project-3";
    label: string;
    order?: number;
    imageItem?: MigratedImage;
  }>;
  toolIcons?: Array<{
    _key: string;
    key:
      | "Figma"
      | "Canva"
      | "Illustrator"
      | "Photoshop"
      | "Indesign"
      | "Premiere"
      | "Aftereffect"
      | "GitMind"
      | "Capcut";
    label: string;
    order?: number;
    imageItem?: MigratedImage;
  }>;
  navigationButtons?: Array<{
    _key: string;
    key: Category;
    title: string;
    href: string;
    order?: number;
    imageItem?: MigratedImage;
  }>;
  bottomButtons?: Array<{
    _key: string;
    key: "home" | "gallery" | "about";
    label: string;
    href: string;
    order?: number;
    inactiveIcon?: MigratedImage;
    activeIcon?: MigratedImage;
  }>;
  featuredDetails?: Array<{
    _key: string;
    projectKey: string;
    title: string;
    order?: number;
    images?: MigratedFeaturedMedia[];
  }>;
};

const migratedImageFragment = /* groq */ `
  alt,
  caption,
  order,
  folder,
  image{
    asset->{
      _id,
      url,
      metadata{
        lqip,
        dimensions{
          width,
          height,
          aspectRatio
        }
      }
    },
    hotspot,
    crop
  }
`;

export const PROJECTS_LIST_QUERY = defineQuery(/* groq */ `*[_type=="project"] | order(_createdAt desc)[0...100]{
  "id": _id,
  designName,
  category,
  customCategoryLabel,
  extraTag,
  "cover": coalesce(coverImage, gallerySections[0].images[0])
}`);

export const SITE_ASSETS_QUERY = defineQuery(/* groq */ `*[_id=="siteAssets"][0]{
  hero{
    desktopImage{
      ${migratedImageFragment}
    },
    mobileImage{
      ${migratedImageFragment}
    }
  },
  contact{
    photo{
      ${migratedImageFragment}
    }
  },
  brand{
    logo{
      ${migratedImageFragment}
    },
    favicon{
      ${migratedImageFragment}
    },
    appIcon{
      ${migratedImageFragment}
    }
  },
  "selectIcons": selectIcons[] | order(order asc){
    _key,
    key,
    label,
    order,
    imageItem{
      ${migratedImageFragment}
    }
  },
  "toolIcons": toolIcons[] | order(order asc){
    _key,
    key,
    label,
    order,
    imageItem{
      ${migratedImageFragment}
    }
  },
  "navigationButtons": navigationButtons[] | order(order asc){
    _key,
    key,
    title,
    href,
    order,
    imageItem{
      ${migratedImageFragment}
    }
  },
  "bottomButtons": bottomButtons[] | order(order asc){
    _key,
    key,
    label,
    href,
    order,
    inactiveIcon{
      ${migratedImageFragment}
    },
    activeIcon{
      ${migratedImageFragment}
    }
  },
  "featuredDetails": featuredDetails[] | order(order asc){
    _key,
    projectKey,
    title,
    order,
    "images": images[] | order(order asc){
      _type,
      alt,
      caption,
      order,
      folder,
      asset->{
        _id,
        url,
        originalFilename,
        metadata{
          lqip,
          dimensions{
            width,
            height,
            aspectRatio
          }
        }
      },
      hotspot,
      crop,
      ${migratedImageFragment},
      video{
        asset->{
          _id,
          url,
          originalFilename
        }
      }
    }
  }
}`);

export async function getProjectsList(): Promise<ProjectListItem[]> {
  return client.fetch(PROJECTS_LIST_QUERY);
}

export async function getSiteAssets(): Promise<SiteAssets | null> {
  return client.fetch(SITE_ASSETS_QUERY);
}
