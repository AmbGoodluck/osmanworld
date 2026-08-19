import { defineField, defineType } from 'sanity'

export const contactSchema = defineType({
  name: 'contact',
  title: 'Contact',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      description: 'Primary contact email shown on the contact page',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'e.g. Berea, KY · Remote',
    }),
    defineField({
      name: 'responseTime',
      title: 'Response Time',
      type: 'string',
      description: 'e.g. Within 24 hours',
      initialValue: 'Within 24 hours',
    }),
    defineField({
      name: 'openTo',
      title: 'Open To',
      type: 'string',
      description: 'e.g. Collabs · Internships · Projects',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'LinkedIn',    value: 'LinkedIn'    },
                  { title: 'GitHub',      value: 'GitHub'      },
                  { title: 'Twitter / X', value: 'Twitter / X' },
                  { title: 'Instagram',   value: 'Instagram'   },
                  { title: 'Email',       value: 'Email'       },
                ],
              },
            }),
            defineField({ name: 'handle', title: 'Handle / Display Name', type: 'string' }),
            defineField({ name: 'url',    title: 'URL',                   type: 'url'    }),
          ],
          preview: {
            select: { title: 'platform', subtitle: 'handle' },
          },
        },
      ],
    }),
    defineField({
      name: 'heroTagline',
      title: 'Hero Tagline',
      type: 'text',
      rows: 2,
      description: 'Sentence shown under "Let\'s Connect" on the contact hero',
      initialValue: 'Whether it\'s a project, collaboration, or just a conversation — the door is always open.',
    }),
  ],
  preview: {
    select: { title: 'email' },
    prepare: ({ title }) => ({ title: 'Contact Info', subtitle: title }),
  },
})
