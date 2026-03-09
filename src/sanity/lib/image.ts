import createImageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { dataset, projectId } from '../env'

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset })

export const MAX_CMS_IMAGE_WIDTH = 1200

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source)
}

export function buildSanityImageUrl(
  source: SanityImageSource | undefined,
  {
    width,
    height,
    quality = 76,
  }: {
    width: number
    height?: number
    quality?: number
  }
) {
  if (!source) return null

  const safeWidth = Math.min(width, MAX_CMS_IMAGE_WIDTH)
  const image = urlFor(source).width(safeWidth).quality(quality).auto('format').fit('max')

  if (height) {
    image.height(height)
  }

  return image.url()
}

export function getSanityImageDimensions(source: {
  asset?: {
    metadata?: {
      dimensions?: {
        width?: number
        height?: number
      }
    }
  }
}) {
  return {
    width: source.asset?.metadata?.dimensions?.width,
    height: source.asset?.metadata?.dimensions?.height,
  }
}
