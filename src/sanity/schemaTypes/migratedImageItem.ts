import {ImageIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const migratedImageFolders = [
  {title: 'Featured', value: 'featured'},
  {title: 'Hero', value: 'hero'},
  {title: 'Contact', value: 'contact'},
  {title: 'Navigation', value: 'nav'},
  {title: 'Buttons', value: 'buttons'},
  {title: 'Icons', value: 'icons'},
] as const

export const migratedImageItem = defineType({
  name: 'migratedImageItem',
  title: 'Migrated Image Item',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'folder',
      title: 'Folder',
      type: 'string',
      options: {
        list: [...migratedImageFolders],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Alt Text',
      type: 'string',
      validation: (rule) => rule.required().warning('Alt text is important for SEO and accessibility.'),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional note. For featured detail images you can use labels like hero, strategy-1, step-1.',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Optional numeric sort order.',
    }),
  ],
  preview: {
    select: {
      media: 'image',
      title: 'alt',
      subtitle: 'caption',
      folder: 'folder',
      order: 'order',
    },
    prepare({media, title, subtitle, folder, order}) {
      const meta = [folder, order !== undefined ? `#${order}` : undefined].filter(Boolean).join(' · ')

      return {
        media,
        title: title || 'Migrated image',
        subtitle: [meta, subtitle].filter(Boolean).join(' — '),
      }
    },
  },
})
