import { defineField, defineType } from 'sanity'

export const academicsSchema = defineType({
  name: 'academics',
  title: 'Academics',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Degree / Programme Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'institution',
      title: 'Institution',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      options: { dateFormat: 'YYYY-MM' },
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'date',
      options: { dateFormat: 'YYYY-MM' },
      description: 'Leave blank if currently enrolled',
    }),
    defineField({
      name: 'current',
      title: 'Currently Enrolled',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'courses',
      title: 'Courses',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name',        title: 'Course Name',  type: 'string' }),
            defineField({ name: 'grade',       title: 'Grade',        type: 'string' }),
            defineField({ name: 'description', title: 'Description',  type: 'text', rows: 2 }),
          ],
          preview: { select: { title: 'name', subtitle: 'grade' } },
        },
      ],
    }),
    defineField({
      name: 'certifications',
      title: 'Certifications',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name',   title: 'Certification Name', type: 'string' }),
            defineField({ name: 'issuer', title: 'Issuer',             type: 'string' }),
            defineField({ name: 'date',   title: 'Date Earned',        type: 'date'   }),
            defineField({ name: 'url',    title: 'Credential URL',     type: 'url'    }),
          ],
          preview: { select: { title: 'name', subtitle: 'issuer' } },
        },
      ],
    }),
    defineField({
      name: 'skills',
      title: 'Skills',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'category', title: 'Category', type: 'string' }),
            defineField({
              name: 'items',
              title: 'Skills',
              type: 'array',
              of: [{ type: 'string' }],
              options: { layout: 'tags' },
            }),
          ],
          preview: { select: { title: 'category' } },
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
  ],
  orderings: [
    { title: 'Start Date, Newest', name: 'startDateDesc', by: [{ field: 'startDate', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'institution' },
  },
})
