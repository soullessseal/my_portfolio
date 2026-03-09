'use client'

import {useCallback, useEffect, useMemo, useState, useTransition} from 'react'
import {
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  Flex,
  Spinner,
  Stack,
  Text,
  TextInput,
} from '@sanity/ui'
import {useClient} from 'sanity'
import {apiVersion} from '@/sanity/env'

type ProjectListItem = {
  _id: string
  _updatedAt: string
  category?: string
  designName?: string
}

const PROJECTS_QUERY = `*[_type == "project"] | order(_updatedAt desc){
  _id,
  _updatedAt,
  category,
  designName
}`

function formatDate(value: string) {
  return new Intl.DateTimeFormat('zh-TW', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function ProjectBulkManager() {
  const client = useClient({apiVersion})
  const [projects, setProjects] = useState<ProjectListItem[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [query, setQuery] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  const visibleProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return projects

    return projects.filter((project) => {
      const designName = project.designName?.toLowerCase() ?? ''
      const category = project.category?.toLowerCase() ?? ''
      return designName.includes(normalizedQuery) || category.includes(normalizedQuery)
    })
  }, [projects, query])

  const visibleIds = visibleProjects.map((project) => project._id)
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id))

  const loadProjects = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await client.fetch<ProjectListItem[]>(PROJECTS_QUERY)
      setProjects(result)
      setSelectedIds((current) => current.filter((id) => result.some((item) => item._id === id)))
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Failed to load projects')
    } finally {
      setIsLoading(false)
    }
  }, [client])

  useEffect(() => {
    void loadProjects()
  }, [loadProjects])

  function toggleSelection(id: string) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    )
  }

  function toggleVisibleSelection() {
    setSelectedIds((current) => {
      if (allVisibleSelected) {
        return current.filter((id) => !visibleIds.includes(id))
      }

      return Array.from(new Set([...current, ...visibleIds]))
    })
  }

  function deleteSelected() {
    if (selectedIds.length === 0 || isPending) return

    const count = selectedIds.length
    const confirmed = window.confirm(`Delete ${count} selected project${count > 1 ? 's' : ''}?`)
    if (!confirmed) return

    startTransition(async () => {
      setError(null)

      try {
        let transaction = client.transaction()

        for (const id of selectedIds) {
          transaction = transaction.delete(id).delete(`drafts.${id}`)
        }

        await transaction.commit()
        await loadProjects()
      } catch (deleteError) {
        setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete projects')
      }
    })
  }

  return (
    <Box padding={4}>
      <Stack space={4}>
        <Card border padding={4} radius={3} tone="transparent">
          <Stack space={4}>
            <Flex align="center" justify="space-between" wrap="wrap" gap={3}>
              <Stack space={2}>
                <Text size={3} weight="semibold">
                  Project Bulk Delete
                </Text>
                <Text muted size={1}>
                  Select multiple project documents and delete them in one action.
                </Text>
              </Stack>
              <Flex gap={2} wrap="wrap">
                <Button
                  mode="ghost"
                  onClick={() => {
                    void loadProjects()
                  }}
                  text="Refresh"
                />
                <Button
                  disabled={selectedIds.length === 0 || isPending}
                  tone="critical"
                  onClick={deleteSelected}
                  text={isPending ? 'Deleting...' : `Delete Selected (${selectedIds.length})`}
                />
              </Flex>
            </Flex>

            <Flex align="center" gap={3} wrap="wrap">
              <Box flex={1} style={{minWidth: '240px'}}>
                <TextInput
                  onChange={(event) => setQuery(event.currentTarget.value)}
                  placeholder="Search by design name or category"
                  value={query}
                />
              </Box>
              <Flex align="center" gap={2}>
                <Checkbox checked={allVisibleSelected} onChange={toggleVisibleSelection} />
                <Text size={1}>Select all visible</Text>
              </Flex>
              <Badge tone="primary">{visibleProjects.length} shown</Badge>
              <Badge>{selectedIds.length} selected</Badge>
            </Flex>

            {error ? (
              <Card border padding={3} radius={2} tone="critical">
                <Text size={1}>{error}</Text>
              </Card>
            ) : null}
          </Stack>
        </Card>

        <Card border radius={3} tone="transparent">
          {isLoading ? (
            <Flex align="center" gap={3} justify="center" padding={5}>
              <Spinner muted />
              <Text size={1}>Loading projects...</Text>
            </Flex>
          ) : visibleProjects.length === 0 ? (
            <Box padding={5}>
              <Text muted size={1}>
                No project documents matched the current filter.
              </Text>
            </Box>
          ) : (
            <Stack space={1} padding={2}>
              {visibleProjects.map((project) => {
                const checked = selectedIds.includes(project._id)

                return (
                  <Card
                    border
                    key={project._id}
                    padding={3}
                    radius={2}
                    tone={checked ? 'primary' : 'transparent'}
                  >
                    <Flex align="center" gap={3}>
                      <Checkbox checked={checked} onChange={() => toggleSelection(project._id)} />
                      <Box flex={1}>
                        <Stack space={2}>
                          <Text size={1} weight="semibold">
                            {project.designName || 'Untitled project'}
                          </Text>
                          <Flex gap={2} wrap="wrap">
                            <Badge>{project.category || 'uncategorized'}</Badge>
                            <Badge>{formatDate(project._updatedAt)}</Badge>
                          </Flex>
                          <Text muted size={1}>
                            {project._id}
                          </Text>
                        </Stack>
                      </Box>
                    </Flex>
                  </Card>
                )
              })}
            </Stack>
          )}
        </Card>
      </Stack>
    </Box>
  )
}
