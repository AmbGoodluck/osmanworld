import { defineField, defineType } from 'sanity'

/**
 * Singleton — create exactly ONE document of this type in Sanity Studio.
 * Controls the entrepreneurship page header, gallery strip, and photo gallery.
 */
export const entrepreneurshipPageSchema = defineType({
  name: 'entrepreneurshipPage',
  title: 'Entrepreneurship Page',
  type: 'document',
  fields: [
    defineField({
      name: 'pageTitle',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Entrepreneurship',
    }),
    defineField({
      name: 'pageDescription',
      title: 'Page Description (fallback)',
      type: 'text',
      rows: 2,
      description: 'Shown when no Sanity venture records exist',
      initialValue: 'See the entrepreneurial journey, ventures, and growth mindset brought to life.',
    }),
    // ─── Horizontal gallery ──────────────────────────────────────────
    defineField({
      name: 'galleryTitle',
      title: 'Gallery Section Title',
      type: 'string',
      initialValue: 'Venture Focus Areas',
    }),
    defineField({
      name: 'galleryItems',
      title: 'Gallery Cards',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title',       title: 'Title',       type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'string' }),
            defineField({ name: 'tag',         title: 'Tag',         type: 'string' }),
            defineField({ name: 'image',       title: 'Card Image',  type: 'image', options: { hotspot: true },
              fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })] }),
            defineField({
              name: 'accent',
              title: 'Accent Colour',
              type: 'string',
              options: { list: [
                { title: 'Blue',    value: 'blue'    },
                { title: 'Crimson', value: 'crimson' },
                { title: 'Grey',    value: 'gray'    },
              ]},
              initialValue: 'crimson',
            }),
          ],
          preview: { select: { title: 'title', subtitle: 'tag' } },
        },
      ],
      initialValue: [
        { title: 'Product Vision',  description: 'Defining the problem, market, and the product that solves it.',                  tag: 'Strategy',   accent: 'crimson' },
        { title: 'Go-to-Market',    description: 'Positioning, pricing, and launch execution that captures attention.',             tag: 'Growth',     accent: 'blue'    },
        { title: 'Team Building',   description: 'Recruiting and leading diverse teams with complementary strengths.',              tag: 'Leadership', accent: 'gray'    },
        { title: 'Fundraising',     description: 'Crafting the narrative and financials that move investors to yes.',               tag: 'Finance',    accent: 'crimson' },
        { title: 'Impact Metrics',  description: 'Measuring success beyond revenue — community, access, and change.',               tag: 'Impact',     accent: 'blue'    },
        { title: 'Scale & Systems', description: 'Building repeatable processes that grow without breaking.',                      tag: 'Ops',        accent: 'gray'    },
      ],
    }),
    // ─── Photo gallery ───────────────────────────────────────────────
    defineField({
      name: 'photosTitle',
      title: 'Photo Gallery Section Title',
      type: 'string',
      initialValue: 'Venture Moments',
    }),
    defineField({
      name: 'photos',
      title: 'Photo Gallery',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'image', title: 'Photo', type: 'image', options: { hotspot: true },
              fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })] }),
            defineField({ name: 'title', title: 'Caption', type: 'string' }),
          ],
          preview: { select: { title: 'title', media: 'image' } },
        },
      ],
      initialValue: [
        { title: 'Pitch Day'       },
        { title: 'Product Launch'  },
        { title: 'Team Offsite'    },
        { title: 'Investor Meeting'},
        { title: 'Prototype Demo'  },
        { title: 'Community Event' },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Entrepreneurship Page' }),
  },
})
