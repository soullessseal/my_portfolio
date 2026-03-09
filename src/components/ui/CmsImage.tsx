"use client";

import Image from "next/image";
import type { MouseEvent } from "react";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { buildSanityImageUrl, getSanityImageDimensions, MAX_CMS_IMAGE_WIDTH } from "@/sanity/lib/image";

type CmsAsset = {
  metadata?: {
    lqip?: string;
    dimensions?: {
      width?: number;
      height?: number;
    };
  };
};

type CmsImageValue = SanityImageSource & {
  asset?: CmsAsset;
};

type BaseProps = {
  image?: CmsImageValue;
  alt?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  maxWidth?: number;
};

type FillProps = BaseProps & {
  fill: true;
};

type FixedProps = BaseProps & {
  fill?: false;
  width: number;
  height?: number;
};

type CmsImageProps = FillProps | FixedProps;

export default function CmsImage(props: CmsImageProps) {
  const { image, alt = "", className, sizes, priority, quality = 76, maxWidth = MAX_CMS_IMAGE_WIDTH } = props;

  if (!image?.asset) {
    return null;
  }

  const { width: originalWidth, height: originalHeight } = getSanityImageDimensions(image);
  const requestedWidth = props.fill
    ? Math.min(originalWidth || maxWidth, maxWidth)
    : Math.min(props.width, maxWidth);
  const requestedHeight =
    props.fill || !props.height
      ? undefined
      : Math.round((props.height / props.width) * requestedWidth);
  const src = buildSanityImageUrl(image, {
    width: requestedWidth,
    height: requestedHeight,
    quality,
  });
  const blurDataURL = image.asset.metadata?.lqip;

  if (!src) {
    return null;
  }

  if (props.fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        priority={priority}
        sizes={sizes}
        draggable={false}
        onContextMenu={(event: MouseEvent<HTMLImageElement>) => event.preventDefault()}
        placeholder={blurDataURL ? "blur" : "empty"}
        blurDataURL={blurDataURL}
      />
    );
  }

  const resolvedHeight =
    props.height ??
    (originalWidth && originalHeight
      ? Math.round((props.width / originalWidth) * originalHeight)
      : Math.round(props.width * 0.75));

  return (
    <Image
      src={src}
      alt={alt}
      width={props.width}
      height={resolvedHeight}
      className={className}
      priority={priority}
      sizes={sizes}
      draggable={false}
      onContextMenu={(event: MouseEvent<HTMLImageElement>) => event.preventDefault()}
      placeholder={blurDataURL ? "blur" : "empty"}
      blurDataURL={blurDataURL}
    />
  );
}
