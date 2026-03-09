import {ImagesIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {MultiImageArrayInput} from '../components/MultiImageArrayInput'
import {ProjectCoverImageInput} from '../components/ProjectCoverImageInput'
import {ProjectGifReconvertControlInput} from '../components/ProjectGifReconvertControlInput'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'designName',
      title: 'Design Name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'UI/UX', value: 'uiux'},
          {title: '\u5e73\u9762\u8a2d\u8a08', value: 'graphic'},
          {title: '\u5176\u4ed6', value: 'other'},
        ],
      },
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'customCategoryLabel',
      title: 'Custom Category Label',
      type: 'string',
      description:
        'Optional override for the main category tag label. If left empty, the default label for the selected Category will be used.',
    }),

    defineField({
      name: 'extraTag',
      title: 'Extra Tag',
      type: 'string',
      description: 'Optional second tag shown on the artwork card.',
    }),
    defineField({
      name: 'gifReconvertControl',
      title: 'GIF to MP4 Tools',
      type: 'string',
      initialValue: '',
      components: {
        input: ProjectGifReconvertControlInput,
      },
    }),

    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {hotspot: true},
      description:
        'Upload a custom cover image, or pick from this project gallery below. If empty, the first gallery image will be used.',
      components: {
        input: ProjectCoverImageInput,
      },
    }),

    defineField({
      name: 'gallerySections',
      title: 'Gallery Sections',
      type: 'array',
      description:
        'Add multiple subtitle sections. Each section can have its own image carousel in the modal.',
      of: [
        defineArrayMember({
          name: 'gallerySection',
          title: 'Gallery Section',
          type: 'object',
          icon: ImagesIcon,
          validation: (Rule) =>
            Rule.custom((section) => {
              if (!section || typeof section !== 'object') return true
              const value = section as {
                images?: unknown[]
                convertedMedia?: unknown[]
              }
              const hasImages = (value.images?.length ?? 0) > 0
              const hasConverted = (value.convertedMedia?.length ?? 0) > 0
              if (hasImages || hasConverted) return true
              return 'Each section needs at least one image or one converted MP4 item.'
            }),
          preview: {
            select: {
              title: 'subtitle',
              media: 'images.0',
            },
            prepare({title, media}) {
              return {
                title: title || 'Untitled section',
                subtitle: 'Subtitle + related images',
                media,
              }
            },
          },
          fields: [
            defineField({
              name: 'subtitle',
              title: 'Subtitle',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'images',
              title: 'Section Images',
              type: 'array',
              components: {
                input: MultiImageArrayInput,
              },
              of: [
                defineArrayMember({
                  type: 'image',
                  options: {hotspot: true},
                }),
              ],
            }),
            defineField({
              name: 'processedGifRefs',
              title: 'Processed GIF Refs (Auto)',
              type: 'array',
              hidden: true,
              readOnly: true,
              of: [defineArrayMember({type: 'string'})],
            }),
            defineField({
              name: 'convertedMedia',
              title: 'Converted GIF Videos (Auto)',
              type: 'array',
              description:
                'Auto-generated MP4 files converted from GIF images. You can manually remove items when needed.',
              of: [
                defineArrayMember({
                  name: 'convertedMediaItem',
                  title: 'Converted Media Item',
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'sourceImageRef',
                      title: 'Source Image Ref',
                      type: 'string',
                      readOnly: true,
                    }),
                    defineField({
                      name: 'video',
                      title: 'Video (MP4)',
                      type: 'file',
                      options: {accept: 'video/mp4'},
                      readOnly: true,
                    }),
                  ],
                  preview: {
                    select: {
                      sourceImageRef: 'sourceImageRef',
                      video: 'video',
                    },
                    prepare({sourceImageRef, video}: {sourceImageRef?: string; video?: {asset?: {_ref?: string}}}) {
                      const hasVideo = Boolean(video?.asset?._ref)
                      return {
                        title: sourceImageRef || 'Converted GIF',
                        subtitle: hasVideo ? 'MP4 ready' : 'Missing converted file',
                      }
                    },
                  },
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
