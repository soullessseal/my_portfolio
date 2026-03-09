'use client'

import type {FC} from 'react'
import {useMemo, useState, useTransition} from 'react'
import {Box, Button, Card, Stack, Text} from '@sanity/ui'
import type {StringInputProps} from 'sanity'
import {useClient, useFormValue} from 'sanity'
import {apiVersion} from '@/sanity/env'

export const ProjectGifReconvertControlInput: FC<StringInputProps> = () => {
  const client = useClient({apiVersion})
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<string | null>(null)
  const rawId = useFormValue(['_id'])
  const documentId = useMemo(
    () => (typeof rawId === 'string' ? rawId : null),
    [rawId]
  )

  function handleReset() {
    if (!documentId || isPending) return

    startTransition(async () => {
      setStatus(null)
      try {
        await client.patch(documentId).unset(['gallerySections[].processedGifRefs']).commit()
        setStatus('Processed GIF history cleared. Publish this project to reconvert MP4.')
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to reset reconvert state.'
        setStatus(message)
      }
    })
  }

  return (
    <Card border padding={3} radius={2} tone="transparent">
      <Stack space={3}>
        <Text size={1}>
          Need to regenerate MP4 files from current GIF images? Reset the processed state, then
          publish this project.
        </Text>
        <Box>
          <Button
            disabled={!documentId || isPending}
            mode="ghost"
            onClick={handleReset}
            text={isPending ? 'Resetting...' : 'Reset GIF Processed State'}
            tone="primary"
          />
        </Box>
        {status ? (
          <Text muted size={1}>
            {status}
          </Text>
        ) : null}
      </Stack>
    </Card>
  )
}
