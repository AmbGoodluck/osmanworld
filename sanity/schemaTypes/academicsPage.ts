import { defineField, defineType } from 'sanity'

/**
 * Singleton — create exactly ONE document of this type in Sanity Studio.
 * Controls the academics page header, gallery strip, and photo gallery.
 */
export const academicsPageSchema = defineType({
  name: 'academicsPage',
  title: 'Academics Page',
  type: 'document',
  fields: [
    defineField({
      name: 'pageTitle',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Academics',
    }),
    defineField({
      name: 'pageDescription',
      title: 'Page Description (fallback)',
      type: 'text',
      rows: 2,
      description: 'Shown when no Sanity education records exist',
      initialValue: 'Explore the intellectual foundations — courses, skills, and knowledge structures built over years of study.',
    }),
    // ─── Horizontal gallery ──────────────────────────────────────────
    defineField({
      name: 'galleryTitle',
      title: 'Gallery Section Title',
      type: 'string',
      initialValue: 'Coursework & Skills',
    }),
    defineField({
      name: 'galleryItems',
      title: 'Gallery Cards',
      type: 'array',
      description: 'Cards in the scrolling horizontal gallery strip',
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
              initialValue: 'blue',
            }),
          ],
          preview: { select: { title: 'title', subtitle: 'tag' } },
        },
      ],
      initialValue: [
        { title: 'Computer Science',         description: 'Core CS fundamentals, algorithms, and systems programming.',            tag: 'Major',    accent: 'blue'    },
        { title: 'Data Structures',          description: 'Deep dive into efficient data organisation and algorithm complexity.',   tag: 'Course',   accent: 'blue'    },
        { title: 'Calculus & Linear Algebra',description: 'Mathematical foundations powering machine learning and graphics.',      tag: 'Course',   accent: 'gray'    },
        { title: 'Software Engineering',     description: 'Agile, system design, and collaborative development practices.',        tag: 'Course',   accent: 'blue'    },
        { title: 'Entrepreneurship',         description: 'Business model design, lean startup, and venture creation.',            tag: 'Elective', accent: 'crimson' },
        { title: 'Design Thinking',          description: 'Human-centered problem solving from research to prototype.',            tag: 'Elective', accent: 'gray'    },
      ],
    }),
    // ─── Photo gallery ───────────────────────────────────────────────
    defineField({
      name: 'photosTitle',
      title: 'Photo Gallery Section Title',
      type: 'string',
      initialValue: 'Campus Life',
    }),
    defineField({
      name: 'photos',
      title: 'Photo Gallery',
      type: 'array',
      description: 'Images in the scrolling photo gallery',
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
        { title: 'Berea College Library'  },
        { title: 'CS Lab Sessions'        },
        { title: 'Research Project'       },
        { title: 'Hackathon 2024'         },
        { title: 'Study Group'            },
        { title: 'Graduation Ceremony'    },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Academics Page' }),
  },
})
