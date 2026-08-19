import { defineField, defineType } from 'sanity'

export const entrepreneurshipSchema = defineType({
  name: 'entrepreneurship',
  title: 'Entrepreneurship',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Venture Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
      ],
    }),
    defineField({
      name: 'images',
      title: 'Gallery Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt',     title: 'Alt Text', type: 'string' }),
            defineField({ name: 'caption', title: 'Caption',  type: 'string' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Active',    value: 'active'    },
          { title: 'Completed', value: 'completed' },
          { title: 'Paused',    value: 'paused'    },
          { title: 'Stealth',   value: 'stealth'   },
        ],
        layout: 'radio',
      },
      initialValue: 'active',
    }),
    defineField({
      name: 'metrics',
      title: 'Impact Metrics',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', description: 'e.g. Revenue, Users, Countries' }),
            defineField({ name: 'value', title: 'Value', type: 'string', description: 'e.g. $50K, 10,000, 12' }),
            defineField({ name: 'unit',  title: 'Unit',  type: 'string', description: 'e.g. ARR, MAU, markets' }),
          ],
          preview: { select: { title: 'label', subtitle: 'value' } },
        },
      ],
    }),
    defineField({
      name: 'date',
      title: 'Founded / Start Date',
      type: 'date',
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  orderings: [
    { title: 'Date, Newest', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'status', media: 'coverImage' },
  },
})
