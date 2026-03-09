import type {StructureResolver} from 'sanity/structure'
import {ProjectBulkManager} from './components/ProjectBulkManager'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Project')
        .child(
          S.list()
            .title('Project')
            .items([
              S.documentTypeListItem('project').title('All Projects'),
              S.listItem()
                .title('Bulk Delete')
                .child(S.component().title('Bulk Delete').component(ProjectBulkManager)),
            ])
        ),
      ...S.documentTypeListItems().filter((listItem) => {
        const id = listItem.getId() || ''
        const isProject = id === 'project'
        const isMediaTag =
          id === 'sanity.media.tag' ||
          id === 'sanity.mediaTag' ||
          id === 'media.tag' ||
          id === 'mediaTag' ||
          id.includes('media.tag') ||
          id.includes('mediaTag')

        return !isProject && !isMediaTag
      }),
    ])
