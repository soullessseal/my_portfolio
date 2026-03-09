'use client'

import {useEffect, useMemo, useRef, useState} from 'react'
import {Button, Card, Flex, Menu, MenuButton, MenuItem, Spinner, Stack, Text} from '@sanity/ui'
import {insert, set, setIfMissing, useClient, type ArrayOfObjectsInputProps} from 'sanity'
import {apiVersion, dataset, projectId} from '@/sanity/env'

type ImageArrayItem = {
  _key: string
  _type: 'image'
  asset: {
    _type: 'reference'
    _ref: string
  }
  [key: string]: unknown
}

type GenericArrayItem = {
  _key: string
  [key: string]: unknown
}

function createImageItem(assetId: string): ImageArrayItem {
  return {
    _key: crypto.randomUUID(),
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: assetId,
    },
  }
}

function imageUrlFromAssetRef(assetRef: string): string | null {
  const matched = assetRef.match(/^image-([a-f0-9]+)-(\d+x\d+)-([a-z0-9]+)$/i)
  if (!matched) return null

  const [, assetId, dimensions, format] = matched
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${assetId}-${dimensions}.${format}?w=120&h=120&fit=crop&auto=format`
}

function duplicateImageItem(item: ImageArrayItem): ImageArrayItem {
  return {
    ...item,
    _key: crypto.randomUUID(),
    asset: item.asset
      ? {
          ...item.asset,
        }
      : item.asset,
  }
}

export function MultiImageArrayInput(props: ArrayOfObjectsInputProps<GenericArrayItem>) {
  const client = useClient({apiVersion})
  const inputRef = useRef<HTMLInputElement | null>(null)
  const replaceInputRef = useRef<HTMLInputElement | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDropUploading, setIsDropUploading] = useState(false)
  const [isDropActive, setIsDropActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [assetFileNames, setAssetFileNames] = useState<Record<string, string>>({})
  const [replacingItemKey, setReplacingItemKey] = useState<string | null>(null)
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null)
  const [draggedKey, setDraggedKey] = useState<string | null>(null)
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null)

  const images = useMemo(() => (props.value ?? []) as ImageArrayItem[], [props.value])
  const selectedKeySet = new Set(selectedKeys)
  const selectedCount = selectedKeys.length

  useEffect(() => {
    const imageKeySet = new Set((props.value ?? []).map((image) => image._key))
    setSelectedKeys((prev) => prev.filter((key) => imageKeySet.has(key)))
  }, [props.value])

  useEffect(() => {
    const assetIds = Array.from(
      new Set(
        images
          .map((image) => image.asset?._ref)
          .filter((assetRef): assetRef is string => typeof assetRef === 'string')
      )
    )

    if (assetIds.length === 0) {
      setAssetFileNames({})
      return
    }

    let isDisposed = false

    async function loadAssetFileNames() {
      try {
        const assets = await client.fetch<Array<{_id: string; originalFilename?: string; filename?: string}>>(
          `*[_type == "sanity.imageAsset" && _id in $ids]{_id, originalFilename, filename}`,
          {ids: assetIds}
        )
        if (isDisposed) return

        const nextMap: Record<string, string> = {}
        for (const asset of assets) {
          const fileName = asset.originalFilename || asset.filename
          if (fileName) nextMap[asset._id] = fileName
        }
        setAssetFileNames(nextMap)
      } catch {
        if (!isDisposed) setAssetFileNames({})
      }
    }

    void loadAssetFileNames()

    return () => {
      isDisposed = true
    }
  }, [client, images])

  async function uploadFiles(files: File[]) {
    if (files.length === 0 || isUploading || props.readOnly) return

    setIsUploading(true)
    setError(null)

    try {
      const uploadedAssets = await Promise.all(
        files.map((file) => client.assets.upload('image', file, {filename: file.name}))
      )

      setAssetFileNames((prev) => {
        const next = {...prev}
        for (const asset of uploadedAssets) {
          const fileName = asset.originalFilename || asset.filename
          if (fileName) next[asset._id] = fileName
        }
        return next
      })

      props.onChange([
        setIfMissing([]),
        insert(
          uploadedAssets.map((asset) => createImageItem(asset._id)),
          'after',
          [-1]
        ),
      ])
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Failed to upload images')
    } finally {
      setIsUploading(false)
    }
  }

  async function handleFilesSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.currentTarget.files ?? [])
    event.currentTarget.value = ''
    await uploadFiles(files)
  }

  async function handleFilesDropped(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
    event.stopPropagation()
    if (props.readOnly || isUploading) return

    const files = Array.from(event.dataTransfer.files ?? []).filter((file) =>
      file.type.startsWith('image/')
    )
    if (files.length === 0) {
      setIsDropActive(false)
      return
    }

    setIsDropUploading(true)
    setIsDropActive(false)
    await uploadFiles(files)
    setIsDropUploading(false)
  }

  async function handleReplaceFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ''

    if (!file || !replacingItemKey || props.readOnly || isUploading) return

    setIsUploading(true)
    setError(null)

    try {
      const uploadedAsset = await client.assets.upload('image', file, {filename: file.name})
      const fileName = uploadedAsset.originalFilename || uploadedAsset.filename
      if (fileName) {
        setAssetFileNames((prev) => ({...prev, [uploadedAsset._id]: fileName}))
      }

      const nextImages = images.map((image) =>
        image._key === replacingItemKey
          ? {
              ...image,
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: uploadedAsset._id,
              },
            }
          : image
      )
      props.onChange(set(nextImages))
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Failed to replace image')
    } finally {
      setReplacingItemKey(null)
      setIsUploading(false)
    }
  }

  function toggleSelect(key: string) {
    setSelectedKeys((prev) => {
      if (prev.includes(key)) return prev.filter((selectedKey) => selectedKey !== key)
      return [...prev, key]
    })
  }

  function handleItemClick(event: React.MouseEvent<HTMLDivElement>, index: number, key: string) {
    if (props.readOnly) return

    if (event.shiftKey && lastSelectedIndex !== null) {
      const start = Math.min(lastSelectedIndex, index)
      const end = Math.max(lastSelectedIndex, index)
      const rangeKeys = images.slice(start, end + 1).map((image) => image._key)
      setSelectedKeys((prev) => Array.from(new Set([...prev, ...rangeKeys])))
      setLastSelectedIndex(index)
      return
    }

    if (event.metaKey || event.ctrlKey) {
      toggleSelect(key)
      setLastSelectedIndex(index)
      return
    }

    setSelectedKeys([key])
    setLastSelectedIndex(index)
  }

  function moveImagesByDropSlot(slotIndex: number) {
    if (props.readOnly || !draggedKey || images.length === 0) return

    const draggedIsSelected = selectedKeySet.has(draggedKey)
    const movingKeys = draggedIsSelected ? selectedKeys : [draggedKey]
    const movingKeySet = new Set(movingKeys)
    const movingImages = images.filter((image) => movingKeySet.has(image._key))
    if (movingImages.length === 0) return

    const staticImages = images.filter((image) => !movingKeySet.has(image._key))
    const boundedSlotIndex = Math.max(0, Math.min(slotIndex, images.length))
    let insertAt = 0
    for (let i = 0; i < boundedSlotIndex; i += 1) {
      if (!movingKeySet.has(images[i]._key)) insertAt += 1
    }

    const nextImages = [
      ...staticImages.slice(0, insertAt),
      ...movingImages,
      ...staticImages.slice(insertAt),
    ]

    props.onChange(set(nextImages))
    if (!draggedIsSelected) {
      setSelectedKeys([draggedKey])
    }
  }

  function resetDragState() {
    setDraggedKey(null)
    setDragOverSlot(null)
  }

  function updateDropSlotFromCard(
    event: React.DragEvent<HTMLDivElement>,
    index: number
  ) {
    if (props.readOnly || !draggedKey) return
    event.preventDefault()
    const rect = event.currentTarget.getBoundingClientRect()
    const isTopHalf = event.clientY - rect.top < rect.height / 2
    setDragOverSlot(isTopHalf ? index : index + 1)
  }

  function renderDropLine(slotIndex: number) {
    const isActive = dragOverSlot === slotIndex
    return (
      <div
        key={`drop-slot-${slotIndex}`}
        onDragOver={(event) => {
          if (props.readOnly || !draggedKey) return
          event.preventDefault()
          setDragOverSlot(slotIndex)
        }}
        onDrop={(event) => {
          event.preventDefault()
          moveImagesByDropSlot(slotIndex)
          resetDragState()
        }}
        style={{
          alignItems: 'center',
          display: 'flex',
          height: '12px',
        }}
      >
        <div
          style={{
            background: isActive ? 'var(--card-focus-ring-color)' : 'var(--card-border-color)',
            borderRadius: '999px',
            height: isActive ? '3px' : '1px',
            transition: 'all 120ms ease',
            width: '100%',
          }}
        />
      </div>
    )
  }

  function handleEditItem(itemKey: string) {
    if (props.readOnly || isUploading) return
    setReplacingItemKey(itemKey)
    replaceInputRef.current?.click()
  }

  return (
    <Stack space={3}>
      <Card border padding={3} radius={2} tone="transparent">
        <Stack space={3}>
          <Flex align="center" gap={3} justify="space-between" wrap="wrap">
            <Stack space={2}>
              <Text size={1} weight="semibold">
                Batch Sort
              </Text>
              <Text muted size={1}>
                Select multiple images, then reorder them together.
              </Text>
            </Stack>
            <Flex gap={2} wrap="wrap">
              <Button
                disabled={props.readOnly || selectedCount === 0}
                mode="ghost"
                onClick={() => setSelectedKeys([])}
                text="Clear"
              />
            </Flex>
          </Flex>

          {images.length > 0 ? (
            <Stack
              onDragLeave={(event) => {
                const related = event.relatedTarget as Node | null
                if (!related || !event.currentTarget.contains(related)) {
                  setDragOverSlot(null)
                }
              }}
              space={2}
            >
              {renderDropLine(0)}
              {images.map((image, index) => {
                const previewUrl =
                  typeof image.asset?._ref === 'string'
                    ? imageUrlFromAssetRef(image.asset._ref)
                    : null
                const displayFileName =
                  typeof image.asset?._ref === 'string'
                    ? assetFileNames[image.asset._ref] || image.asset._ref
                    : image._key

                return (
                  <div key={image._key}>
                    <Card
                      border
                      draggable={!props.readOnly && selectedKeySet.has(image._key)}
                      onClick={(event) => handleItemClick(event, index, image._key)}
                      onDragEnd={resetDragState}
                      onDragStart={(event) => {
                        if (props.readOnly || !selectedKeySet.has(image._key)) return
                        event.dataTransfer.effectAllowed = 'move'
                        event.dataTransfer.setData('text/plain', image._key)
                        setDraggedKey(image._key)
                      }}
                      onDragOver={(event) => updateDropSlotFromCard(event, index)}
                      onDrop={(event) => {
                        event.preventDefault()
                        const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect()
                        const isTopHalf = event.clientY - rect.top < rect.height / 2
                        const slotIndex = isTopHalf ? index : index + 1
                        moveImagesByDropSlot(slotIndex)
                        resetDragState()
                      }}
                      padding={2}
                      radius={2}
                      style={{cursor: selectedKeySet.has(image._key) ? 'grab' : 'pointer'}}
                      tone={selectedKeySet.has(image._key) ? 'primary' : 'transparent'}
                    >
                      <Flex align="center" gap={2}>
                        {previewUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            alt={`Preview ${index + 1}`}
                            draggable={false}
                            height={48}
                            src={previewUrl}
                            style={{
                              borderRadius: '4px',
                              display: 'block',
                              objectFit: 'cover',
                              width: '48px',
                            }}
                            width={48}
                          />
                        ) : (
                          <Card border padding={2} radius={2} tone="transparent">
                            <Text muted size={1}>
                              No preview
                            </Text>
                          </Card>
                        )}
                        <Text size={1}>Image {index + 1}</Text>
                        <Text
                          muted
                          size={1}
                          style={{
                            flex: 1,
                            lineHeight: 1.3,
                            minWidth: 0,
                            overflowWrap: 'anywhere',
                            whiteSpace: 'normal',
                          }}
                        >
                          {displayFileName}
                        </Text>
                        <div
                          onClick={(event) => event.stopPropagation()}
                          onMouseDown={(event) => event.stopPropagation()}
                        >
                          <MenuButton
                            button={<Button mode="bleed" text="..." />}
                            id={`image-actions-${image._key}`}
                            menu={
                              <Menu>
                                <MenuItem
                                  onClick={() => {
                                    handleEditItem(image._key)
                                  }}
                                  text="Edit"
                                />
                                <MenuItem
                                  onClick={() => {
                                    props.onInsert({
                                      items: [duplicateImageItem(image)],
                                      position: 'after',
                                      referenceItem: {_key: image._key},
                                    })
                                  }}
                                  text="Duplicate"
                                />
                                <MenuItem
                                  onClick={() => {
                                    props.onItemRemove(image._key)
                                  }}
                                  text="Remove"
                                  tone="critical"
                                />
                              </Menu>
                            }
                            popover={{placement: 'bottom-end'}}
                          />
                        </div>
                      </Flex>
                    </Card>
                    {renderDropLine(index + 1)}
                  </div>
                )
              })}
            </Stack>
          ) : (
            <Text muted size={1}>
              No images in this section yet.
            </Text>
          )}
        </Stack>
      </Card>

      <Card border padding={3} radius={2} tone="transparent">
        <Stack space={3}>
          <Flex align="center" gap={3} justify="space-between" wrap="wrap">
            <Stack space={2}>
              <Text size={1} weight="semibold">
                Batch Upload
              </Text>
              <Text muted size={1}>
                Add multiple images to this section in one selection.
              </Text>
            </Stack>
            <Button
              disabled={props.readOnly || isUploading}
              onClick={() => inputRef.current?.click()}
              text={isUploading ? 'Uploading...' : 'Select Multiple Images'}
              tone="primary"
            />
          </Flex>

          <Card
            border
            onDragEnter={(event) => {
              event.preventDefault()
              event.stopPropagation()
              if (props.readOnly || isUploading) return
              setIsDropActive(true)
            }}
            onDragLeave={(event) => {
              event.preventDefault()
              event.stopPropagation()
              const related = event.relatedTarget as Node | null
              if (!related || !event.currentTarget.contains(related)) {
                setIsDropActive(false)
              }
            }}
            onDragOver={(event) => {
              event.preventDefault()
              event.stopPropagation()
              if (props.readOnly || isUploading) return
              event.dataTransfer.dropEffect = 'copy'
              setIsDropActive(true)
            }}
            onDrop={handleFilesDropped}
            padding={3}
            radius={2}
            tone={isDropActive ? 'primary' : 'transparent'}
          >
            <Text size={1}>
              {isDropUploading
                ? 'Uploading dropped images...'
                : 'Drag image files here to upload, or use Select Multiple Images.'}
            </Text>
          </Card>

          <input accept="image/*" hidden multiple onChange={handleFilesSelected} ref={inputRef} type="file" />
          <input
            accept="image/*"
            hidden
            onChange={handleReplaceFileSelected}
            ref={replaceInputRef}
            type="file"
          />

          {isUploading ? (
            <Flex align="center" gap={2}>
              <Spinner muted />
              <Text size={1}>Uploading selected images...</Text>
            </Flex>
          ) : null}

          {error ? (
            <Card border padding={3} radius={2} tone="critical">
              <Text size={1}>{error}</Text>
            </Card>
          ) : null}
        </Stack>
      </Card>
    </Stack>
  )
}
