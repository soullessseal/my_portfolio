import {CogIcon, DocumentsIcon, ImageIcon} from '@sanity/icons'
import type {StructureResolver} from 'sanity/structure'
import {ProjectBulkManager} from './components/ProjectBulkManager'

const SINGLETONS = ['siteAssets']

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Migrated Images')
        .icon(ImageIcon)
        .child(
          S.document()
            .schemaType('siteAssets')
            .documentId('siteAssets')
            .title('Migrated Frontend Images')
        ),
      S.divider(),
      S.listItem()
        .title('Projects')
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title('Projects')
            .items([
              S.documentTypeListItem('project').title('All Projects'),
              S.listItem()
                .title('Bulk Delete')
                .icon(CogIcon)
                .child(S.component().title('Bulk Delete').component(ProjectBulkManager)),
            ])
        ),
      ...S.documentTypeListItems().filter((listItem) => {
        const id = listItem.getId() || ''
        const isProject = id === 'project'
        const isSingleton = SINGLETONS.includes(id)
        const isMediaTag =
          id === 'sanity.media.tag' ||
          id === 'sanity.mediaTag' ||
          id === 'media.tag' ||
          id === 'mediaTag' ||
          id.includes('media.tag') ||
          id.includes('mediaTag')

        return !isProject && !isSingleton && !isMediaTag
      }),
    ])
