import { defineField, defineType } from 'sanity'

export const aboutSchema = defineType({
  name: 'about',
  title: 'About',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Short sentence shown under your name',
    }),
    defineField({
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
      ],
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Rich text personal bio',
    }),
    defineField({
      name: 'journeyMilestones',
      title: 'Journey Milestones',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'year',        title: 'Year',        type: 'string' }),
            defineField({ name: 'title',       title: 'Title',       type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'year' },
          },
        },
      ],
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'platform', title: 'Platform', type: 'string' }),
            defineField({ name: 'url',      title: 'URL',      type: 'url'    }),
          ],
          preview: { select: { title: 'platform', subtitle: 'url' } },
        },
      ],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    // ─── Page gallery strip ───────────────────────────────────────────
    defineField({
      name: 'galleryTitle',
      title: 'Gallery Section Title',
      type: 'string',
      initialValue: 'Highlights',
    }),
    defineField({
      name: 'galleryItems',
      title: 'Gallery Cards',
      type: 'array',
      description: 'Cards in the horizontal scrolling gallery strip on the about page',
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
        { title: 'African Leadership Academy', description: 'Pan-African leadership and design thinking in Johannesburg, South Africa.', tag: '2021', accent: 'blue'    },
        { title: 'Berea College',              description: 'Computer Science studies combining technical rigor with entrepreneurial vision.',tag: '2023', accent: 'blue'    },
        { title: 'Founder & Designer',         description: 'Building ventures at the intersection of technology, fashion, and community.',  tag: '2024', accent: 'crimson' },
        { title: 'Leadership',                 description: 'Developing leaders who drive change across Africa and beyond.',                 tag: 'Value',accent: 'gray'    },
        { title: 'Innovation',                 description: 'Solving real problems with creative technology solutions.',                     tag: 'Value',accent: 'blue'    },
        { title: 'Design Thinking',            description: 'Human-centered approach to every product and experience.',                     tag: 'Value',accent: 'gray'    },
        { title: 'Community',                  description: 'Building networks that uplift and create lasting impact.',                      tag: 'Value',accent: 'crimson' },
      ],
    }),
    // ─── Photo gallery strip ─────────────────────────────────────────
    defineField({
      name: 'photosTitle',
      title: 'Photo Gallery Section Title',
      type: 'string',
      initialValue: 'Moments',
    }),
    defineField({
      name: 'photos',
      title: 'Photo Gallery (Moments)',
      type: 'array',
      description: 'Photos in the scrolling gallery at the bottom of the about page',
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
        { title: 'At African Leadership Academy' },
        { title: 'Berea College Campus'          },
        { title: 'Leadership Summit'             },
        { title: 'Design Workshop'               },
        { title: 'Community Event'               },
        { title: 'Team Collaboration'            },
      ],
    }),
  ],
  preview: {
    select: { title: 'title', media: 'profileImage' },
  },
})
