import { defineField, defineType } from 'sanity'

/**
 * Singleton — create exactly ONE document of this type in Sanity Studio.
 * Controls the fashion page header, gallery strip, editorial grid, and timeline.
 */
export const fashionPageSchema = defineType({
  name: 'fashionPage',
  title: 'Fashion Page',
  type: 'document',
  fields: [
    defineField({
      name: 'pageLabel',
      title: 'Page Eyebrow Label',
      type: 'string',
      description: 'Small mono text above the title',
      initialValue: 'Creative Direction',
    }),
    defineField({
      name: 'pageTitle',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Fashion',
    }),
    defineField({
      name: 'pageDescription',
      title: 'Page Description (fallback)',
      type: 'text',
      rows: 2,
      description: 'Shown when no Sanity fashion project records exist',
      initialValue: 'Editorial. Brand. Visual storytelling. Fashion as a language.',
    }),
    // ─── Horizontal gallery ──────────────────────────────────────────
    defineField({
      name: 'galleryTitle',
      title: 'Gallery Section Title',
      type: 'string',
      initialValue: 'Creative Work',
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
              initialValue: 'gray',
            }),
          ],
          preview: { select: { title: 'title', subtitle: 'tag' } },
        },
      ],
      initialValue: [
        { title: 'Editorial Direction',  description: 'Curating visual narratives that tell compelling stories through fashion.',               tag: 'Editorial', accent: 'gray'    },
        { title: 'Brand Identity',       description: 'Building cohesive brand languages across print, digital, and wearable.',                tag: 'Brand',     accent: 'crimson' },
        { title: 'Photography',          description: 'Capturing mood, texture, and identity through the lens.',                              tag: 'Photo',     accent: 'gray'    },
        { title: 'Styling',              description: 'Composing looks that communicate culture, confidence, and story.',                     tag: 'Styling',   accent: 'blue'    },
        { title: 'Collaboration',        description: 'Working with creatives to produce work greater than the sum of its parts.',            tag: 'Collab',    accent: 'crimson' },
        { title: 'Visual Storytelling',  description: 'Every garment, frame, and composition intentionally crafted.',                        tag: 'Design',    accent: 'gray'    },
      ],
    }),
    // ─── Editorial image grid (FashionGrid) ──────────────────────────
    defineField({
      name: 'editorialGrid',
      title: 'Editorial Grid (8 images)',
      type: 'array',
      description: 'Images for the editorial masonry grid. Add up to 8 — each slot has a fixed layout position.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true },
              fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })] }),
            defineField({ name: 'label', title: 'Hover Label', type: 'string' }),
          ],
          preview: { select: { title: 'label', media: 'image' } },
        },
      ],
      initialValue: [
        { label: 'Cover Story'   },
        { label: 'Editorial I'   },
        { label: 'Editorial II'  },
        { label: 'Street'        },
        { label: 'Lookbook'      },
        { label: 'Portrait'      },
        { label: 'Detail'        },
        { label: 'Campaign'      },
      ],
    }),
    // ─── Fashion timeline ─────────────────────────────────────────────
    defineField({
      name: 'timelineLabel',
      title: 'Timeline Eyebrow Label',
      type: 'string',
      initialValue: 'The Story',
    }),
    defineField({
      name: 'timelineTitle',
      title: 'Timeline Section Title',
      type: 'string',
      initialValue: 'Fashion Journey',
    }),
    defineField({
      name: 'fashionTimeline',
      title: 'Fashion Timeline',
      type: 'array',
      description: 'Milestones in the alternating left-right timeline section',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'year',        title: 'Year',        type: 'string' }),
            defineField({ name: 'title',       title: 'Title',       type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
          ],
          preview: { select: { title: 'title', subtitle: 'year' } },
        },
      ],
      initialValue: [
        {
          year: '2019',
          title: 'The Seed',
          description: "First exposure to fashion as a language — at 15, learning that what you wear tells the world who you are before you say a word. Style became a form of self-authorship.",
        },
        {
          year: '2021',
          title: 'African Leadership Academy',
          description: "At ALA in Johannesburg, surrounded by 100 young Africans from 40+ countries, I discovered that fashion could carry culture. Every outfit became a conversation about identity, heritage, and belonging.",
        },
        {
          year: '2022',
          title: 'The Visual Turn',
          description: "Started fashion photography — learning to see light, composition, and story in a single frame. The intersection of technology and aesthetics became my creative obsession.",
        },
        {
          year: '2023',
          title: 'Berea & Beyond',
          description: "Arrived at Berea College with a designer's eye and an engineer's mind. Fashion became the bridge between technical precision and human expression.",
        },
        {
          year: '2024',
          title: 'Identity Drop',
          description: "First collaborative fashion project — merging cultural identity, pan-African aesthetics, and digital design into a cohesive visual story. Fashion, finally, as a full creative discipline.",
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Fashion Page' }),
  },
})
