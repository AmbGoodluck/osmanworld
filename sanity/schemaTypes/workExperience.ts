import { defineField, defineType } from 'sanity'

export const workExperienceSchema = defineType({
  name: 'workExperience',
  title: 'Work Experience',
  type: 'document',
  fields: [
    defineField({
      name: 'company',
      title: 'Company / Organisation',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role / Job Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'employmentType',
      title: 'Employment Type',
      type: 'string',
      options: {
        list: [
          { title: 'Full-time',   value: 'Full-time'   },
          { title: 'Part-time',   value: 'Part-time'   },
          { title: 'Internship',  value: 'Internship'  },
          { title: 'Contract',    value: 'Contract'    },
          { title: 'Freelance',   value: 'Freelance'   },
          { title: 'Volunteer',   value: 'Volunteer'   },
        ],
      },
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'e.g. Remote · Berea, KY or Johannesburg, SA',
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      options: { dateFormat: 'YYYY-MM' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'date',
      options: { dateFormat: 'YYYY-MM' },
      description: 'Leave blank if currently working here',
    }),
    defineField({
      name: 'current',
      title: 'Currently Working Here',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'logo',
      title: 'Company Logo',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
      ],
    }),
    defineField({
      name: 'achievements',
      title: 'Achievements & Responsibilities',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Each item becomes a bullet point',
    }),
    defineField({
      name: 'techStack',
      title: 'Technologies Used',
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
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower number = shown first (most recent first)',
      initialValue: 99,
    }),
  ],
  orderings: [
    { title: 'Order (asc)', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
    { title: 'Start Date, Newest', name: 'startDateDesc', by: [{ field: 'startDate', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'role', subtitle: 'company', media: 'logo' },
  },
})
