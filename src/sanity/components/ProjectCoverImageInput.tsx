'use client'

import {useMemo, useRef, useState} from 'react'
import {Button, Card, Flex, Spinner, Stack, Text} from '@sanity/ui'
import {set, unset, useClient, useFormValue, type ImageValue, type ObjectInputProps} from 'sanity'
import {apiVersion, dataset, projectId} from '@/sanity/env'

type GallerySection = {
  images?: Array<{
    asset?: {
      _ref?: string
    }
  }>
}

function toImageUrl(assetRef: string): string | null {
  const matched = assetRef.match(/^image-([a-f0-9]+)-(\d+x\d+)-([a-z0-9]+)$/i)
  if (!matched) return null

  const [, assetId, dimensions, format] = matched
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${assetId}-${dimensions}.${format}?w=240&h=160&fit=crop&auto=format`
}

function getFileName(assetRef: string): string {
  const matched = assetRef.match(/^image-[a-f0-9]+-\d+x\d+-([a-z0-9]+)$/i)
  const ext = matched?.[1] ?? 'image'
  return `from-gallery.${ext}`
}

export function ProjectCoverImageInput(props: ObjectInputProps<ImageValue>) {
  const client = useClient({apiVersion})
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const gallerySections = useFormValue(['gallerySections']) as GallerySection[] | undefined

  const imageRefs = useMemo(() => {
    const refs = new Set<string>()
    for (const section of gallerySections ?? []) {
      for (const image of section.images ?? []) {
        const ref = image.asset?._ref
        if (typeof ref === 'string' && ref.startsWith('image-')) refs.add(ref)
      }
    }
    return Array.from(refs)
  }, [gallerySections])

  const selectedRef = props.value?.asset?._ref

  async function handleUploadCover(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ''
    if (!file || props.readOnly || isUploading) return

    setIsUploading(true)
    setError(null)
    try {
      const uploadedAsset = await client.assets.upload('image', file, {filename: file.name})
      props.onChange(
        set({
          _type: 'image',
          asset: {_type: 'reference', _ref: uploadedAsset._id},
        })
      )
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Failed to upload cover image')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Stack space={3}>
      <Card border padding={3} radius={2} tone="transparent">
        <Stack space={3}>
          <Flex align="center" justify="space-between" wrap="wrap">
            <Stack space={1}>
              <Text size={1} weight="semibold">
                Cover Image
              </Text>
              <Text muted size={1}>
                Upload a new cover, or pick one from this project images only.
              </Text>
            </Stack>
            <Flex gap={2} wrap="wrap">
              <Button
                mode="ghost"
                onClick={() => inputRef.current?.click()}
                text={isUploading ? 'Uploading...' : 'Upload Cover'}
                disabled={props.readOnly || isUploading}
              />
              <Button
                mode="ghost"
                onClick={() => props.onChange(unset())}
                text="Use Default First Image"
                disabled={props.readOnly}
              />
            </Flex>
          </Flex>

          <input accept="image/*" hidden onChange={handleUploadCover} ref={inputRef} type="file" />

          {isUploading ? (
            <Flex align="center" gap={2}>
              <Spinner muted />
              <Text size={1}>Uploading cover image...</Text>
            </Flex>
          ) : null}

          {error ? (
            <Card border padding={2} radius={2} tone="critical">
              <Text size={1}>{error}</Text>
            </Card>
          ) : null}

          {imageRefs.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gap: '8px',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
              }}
            >
              {imageRefs.map((assetRef) => {
                const imageUrl = toImageUrl(assetRef)
                const isActive = selectedRef === assetRef

                return (
                  <button
                    key={assetRef}
                    disabled={props.readOnly}
                    onClick={() =>
                      props.onChange(
                        set({
                          _type: 'image',
                          asset: {_type: 'reference', _ref: assetRef},
                        })
                      )
                    }
                    style={{
                      background: 'transparent',
                      border: `1px solid ${isActive ? 'var(--card-focus-ring-color)' : 'var(--card-border-color)'}`,
                      borderRadius: '8px',
                      cursor: props.readOnly ? 'default' : 'pointer',
                      overflow: 'hidden',
                      padding: 0,
                      textAlign: 'left',
                    }}
                    type="button"
                  >
                    {imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        alt={getFileName(assetRef)}
                        src={imageUrl}
                        style={{display: 'block', height: '80px', objectFit: 'cover', width: '100%'}}
                      />
                    ) : (
                      <div style={{height: '80px'}} />
                    )}
                    <div style={{padding: '6px 8px'}}>
                      <Text muted size={0}>
                        {isActive ? 'Selected Cover' : 'Set as Cover'}
                      </Text>
                    </div>
                  </button>
                )
              })}
            </div>
          ) : (
            <Text muted size={1}>
              No gallery images yet. Upload section images first, then choose one here.
            </Text>
          )}
        </Stack>
      </Card>
    </Stack>
  )
}
