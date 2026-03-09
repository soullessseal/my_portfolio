import {ImageIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const featuredImageAsset = defineType({
  name: 'featuredImageAsset',
  title: 'Featured Image Asset',
  type: 'image',
  icon: ImageIcon,
  options: {hotspot: true},
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
      title: 'Alt Text',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Use keys like hero, strategy-1, step-2.',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
    }),
  ],
})
