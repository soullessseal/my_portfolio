import {PlayIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

import {migratedImageFolders} from './migratedImageItem'

export const migratedFeaturedMediaItem = defineType({
  name: 'migratedFeaturedMediaItem',
  title: 'Migrated Featured Media Item',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'folder',
      title: 'Folder',
      type: 'string',
      options: {
        list: [...migratedImageFolders],
        layout: 'radio',
      },
      initialValue: 'featured',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      hidden: ({parent}) => Boolean(parent?.video),
    }),
    defineField({
      name: 'video',
      title: 'Video (MP4)',
      type: 'file',
      options: {accept: 'video/mp4'},
      hidden: ({parent}) => Boolean(parent?.image),
    }),
    defineField({
      name: 'alt',
      title: 'Alt / Label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Use keys like hero, strategy-2, step-4.',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
    }),
  ],
  preview: {
    select: {
      image: 'image',
      video: 'video',
      title: 'alt',
      subtitle: 'caption',
      order: 'order',
    },
    prepare({image, video, title, subtitle, order}) {
      return {
        media: image || video,
        title: title || 'Featured media item',
        subtitle: [order !== undefined ? `#${order}` : undefined, subtitle].filter(Boolean).join(' · '),
      }
    },
  },
})
