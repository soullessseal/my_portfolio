import {CogIcon, ControlsIcon, DocumentsIcon, HomeIcon, ImageIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const siteAssets = defineType({
  name: 'siteAssets',
  title: 'Migrated Images',
  type: 'document',
  icon: ImageIcon,
  groups: [
    {name: 'featured', title: 'Featured', icon: DocumentsIcon, default: true},
    {name: 'hero', title: 'Hero', icon: HomeIcon},
    {name: 'contact', title: 'Contact', icon: ImageIcon},
    {name: 'nav', title: 'Navigation', icon: ControlsIcon},
    {name: 'buttons', title: 'Buttons', icon: ControlsIcon},
    {name: 'icons', title: 'Icons', icon: CogIcon},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Migrated Frontend Images',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      group: 'hero',
      fields: [
        defineField({
          name: 'desktopImage',
          title: 'Desktop Hero Image',
          type: 'migratedImageItem',
          initialValue: {folder: 'hero'},
        }),
        defineField({
          name: 'mobileImage',
          title: 'Mobile Hero Image',
          type: 'migratedImageItem',
          initialValue: {folder: 'hero'},
        }),
      ],
    }),
    defineField({
      name: 'contact',
      title: 'Contact',
      type: 'object',
      group: 'contact',
      fields: [
        defineField({
          name: 'photo',
          title: 'Contact Photo',
          type: 'migratedImageItem',
          initialValue: {folder: 'contact'},
        }),
      ],
    }),
    defineField({
      name: 'brand',
      title: 'Brand / Icons',
      type: 'object',
      group: 'icons',
      fields: [
        defineField({
          name: 'logo',
          title: 'Logo',
          type: 'migratedImageItem',
          initialValue: {folder: 'icons'},
        }),
        defineField({
          name: 'favicon',
          title: 'Favicon',
          type: 'migratedImageItem',
          initialValue: {folder: 'icons'},
        }),
        defineField({
          name: 'appIcon',
          title: 'App Icon',
          type: 'migratedImageItem',
          initialValue: {folder: 'icons'},
        }),
      ],
    }),
    defineField({
      name: 'selectIcons',
      title: 'Select Icons',
      type: 'array',
      group: 'icons',
      of: [
        defineArrayMember({
          type: 'object',
          preview: {
            select: {
              title: 'label',
              key: 'key',
              media: 'imageItem.image',
            },
            prepare({title, key, media}) {
              return {
                title: title || key || 'Select icon',
                subtitle: 'Featured carousel select icon',
                media,
              }
            },
          },
          fields: [
            defineField({
              name: 'key',
              title: 'Key',
              type: 'string',
              options: {
                list: [
                  {title: 'Project 1', value: 'project-1'},
                  {title: 'Project 2', value: 'project-2'},
                  {title: 'Project 3', value: 'project-3'},
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'order',
              title: 'Order',
              type: 'number',
            }),
            defineField({
              name: 'imageItem',
              title: 'Image',
              type: 'migratedImageItem',
              initialValue: {folder: 'icons'},
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'toolIcons',
      title: 'Tool Icons',
      type: 'array',
      group: 'icons',
      of: [
        defineArrayMember({
          type: 'object',
          preview: {
            select: {
              title: 'label',
              key: 'key',
              media: 'imageItem.image',
            },
            prepare({title, key, media}) {
              return {
                title: title || key || 'Tool icon',
                subtitle: 'Tools section icon',
                media,
              }
            },
          },
          fields: [
            defineField({
              name: 'key',
              title: 'Key',
              type: 'string',
              options: {
                list: [
                  {title: 'Figma', value: 'Figma'},
                  {title: 'Canva', value: 'Canva'},
                  {title: 'Illustrator', value: 'Illustrator'},
                  {title: 'Photoshop', value: 'Photoshop'},
                  {title: 'Indesign', value: 'Indesign'},
                  {title: 'Premiere', value: 'Premiere'},
                  {title: 'Aftereffect', value: 'Aftereffect'},
                  {title: 'GitMind', value: 'GitMind'},
                  {title: 'Capcut', value: 'Capcut'},
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'order',
              title: 'Order',
              type: 'number',
            }),
            defineField({
              name: 'imageItem',
              title: 'Image',
              type: 'migratedImageItem',
              initialValue: {folder: 'icons'},
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'navigationButtons',
      title: 'Navigation Buttons',
      type: 'array',
      group: 'nav',
      of: [
        defineArrayMember({
          type: 'object',
          preview: {
            select: {
              title: 'title',
              key: 'key',
              media: 'imageItem.image',
            },
            prepare({title, key, media}) {
              return {
                title: title || key || 'Navigation button',
                subtitle: 'Home navigation image',
                media,
              }
            },
          },
          fields: [
            defineField({
              name: 'key',
              title: 'Key',
              type: 'string',
              options: {
                list: [
                  {title: 'UI/UX', value: 'uiux'},
                  {title: 'Graphic', value: 'graphic'},
                  {title: 'Other', value: 'other'},
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'href',
              title: 'Href',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'order',
              title: 'Order',
              type: 'number',
            }),
            defineField({
              name: 'imageItem',
              title: 'Image',
              type: 'migratedImageItem',
              initialValue: {folder: 'nav'},
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'bottomButtons',
      title: 'Bottom Buttons',
      type: 'array',
      group: 'buttons',
      of: [
        defineArrayMember({
          type: 'object',
          preview: {
            select: {
              title: 'label',
              key: 'key',
              media: 'inactiveIcon.image',
            },
            prepare({title, key, media}) {
              return {
                title: title || key || 'Bottom button',
                subtitle: 'Bottom navigation icon pair',
                media,
              }
            },
          },
          fields: [
            defineField({
              name: 'key',
              title: 'Key',
              type: 'string',
              options: {
                list: [
                  {title: 'Home', value: 'home'},
                  {title: 'Gallery', value: 'gallery'},
                  {title: 'About', value: 'about'},
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'href',
              title: 'Href',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'order',
              title: 'Order',
              type: 'number',
            }),
            defineField({
              name: 'inactiveIcon',
              title: 'Inactive Icon',
              type: 'migratedImageItem',
              initialValue: {folder: 'buttons'},
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'activeIcon',
              title: 'Active Icon',
              type: 'migratedImageItem',
              initialValue: {folder: 'buttons'},
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'featuredDetails',
      title: 'Featured Detail Images',
      type: 'array',
      group: 'featured',
      description:
        'One item per featured project. Upload the ordered image list used by the detail modal. Use caption keys like hero, strategy-1, step-1.',
      of: [
        defineArrayMember({
          type: 'object',
          preview: {
            select: {
              title: 'title',
              projectKey: 'projectKey',
              media: 'images.0.image',
            },
            prepare({title, projectKey, media}) {
              return {
                title: title || projectKey || 'Featured detail images',
                subtitle: 'Detail modal images',
                media,
              }
            },
          },
          fields: [
            defineField({
              name: 'projectKey',
              title: 'Project Key',
              type: 'string',
              options: {
                list: [
                  {title: 'Project 1', value: 'project-1'},
                  {title: 'Project 2', value: 'project-2'},
                  {title: 'Project 3', value: 'project-3'},
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'order',
              title: 'Order',
              type: 'number',
            }),
            defineField({
              name: 'images',
              title: 'Images / Videos',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'featuredImageAsset',
                }),
                defineArrayMember({
                  type: 'featuredVideoAsset',
                }),
              ],
              validation: (rule) => rule.required().min(1),
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Migrated Frontend Images',
        subtitle: 'Singleton document for CMS-managed frontend assets',
      }
    },
  },
})
