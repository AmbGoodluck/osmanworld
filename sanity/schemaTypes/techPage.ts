import { defineField, defineType } from 'sanity'

/**
 * Singleton — create exactly ONE document of this type in Sanity Studio.
 * Controls the tech page header, gallery strip, and photo gallery.
 */
export const techPageSchema = defineType({
  name: 'techPage',
  title: 'Tech Page',
  type: 'document',
  fields: [
    defineField({
      name: 'pageTitle',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Tech',
    }),
    defineField({
      name: 'pageDescription',
      title: 'Page Description (fallback)',
      type: 'text',
      rows: 2,
      description: 'Shown when no Sanity project records exist',
      initialValue: 'Dive into the technology stack, projects, and interactive experiences.',
    }),
    // ─── Horizontal gallery ──────────────────────────────────────────
    defineField({
      name: 'galleryTitle',
      title: 'Gallery Section Title',
      type: 'string',
      initialValue: 'Stack & Skills',
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
              initialValue: 'blue',
            }),
          ],
          preview: { select: { title: 'title', subtitle: 'tag' } },
        },
      ],
      initialValue: [
        { title: 'Full-Stack Development', description: 'End-to-end product engineering from database to UI.',                     tag: 'Web',      accent: 'blue'    },
        { title: 'React & Next.js',        description: 'Modern component-driven frontends with server-side rendering.',            tag: 'Frontend', accent: 'blue'    },
        { title: 'Node & APIs',            description: 'RESTful and GraphQL APIs powering scalable backends.',                    tag: 'Backend',  accent: 'gray'    },
        { title: '3D & WebGL',             description: 'Immersive experiences with Three.js and React Three Fiber.',             tag: 'Creative', accent: 'crimson' },
        { title: 'AI & ML',                description: 'Building intelligent systems with Python, TensorFlow, and LLM APIs.',    tag: 'AI',       accent: 'blue'    },
        { title: 'Open Source',            description: 'Contributing to and building tools the community depends on.',           tag: 'OSS',      accent: 'gray'    },
      ],
    }),
    // ─── Photo gallery ───────────────────────────────────────────────
    defineField({
      name: 'photosTitle',
      title: 'Photo Gallery Section Title',
      type: 'string',
      initialValue: 'Projects',
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
        { title: "Osman's World Portfolio"  },
        { title: 'Dashboard App'            },
        { title: 'Mobile Build'             },
        { title: 'API Architecture'         },
        { title: '3D Web Experience'        },
        { title: 'Open Source Contribution' },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Tech Page' }),
  },
})
