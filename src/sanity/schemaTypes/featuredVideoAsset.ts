import {PlayIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const featuredVideoAsset = defineType({
  name: 'featuredVideoAsset',
  title: 'Featured Video Asset',
  type: 'file',
  icon: PlayIcon,
  options: {
    accept: 'video/mp4',
    storeOriginalFilename: true,
  },
  fields: [
    defineField({
      name: 'folder',
      title: 'Folder',
      type: 'string',
      initialValue: 'featured',
      hidden: true,
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
      description: 'Use keys like strategy-2 or strategy-4.',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
    }),
  ],
})
