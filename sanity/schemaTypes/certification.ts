import { defineField, defineType } from 'sanity'

export const certificationSchema = defineType({
  name: 'certification',
  title: 'Certification',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Certification / Award Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'issuer',
      title: 'Issuing Organisation',
      type: 'string',
    }),
    defineField({
      name: 'date',
      title: 'Date Earned',
      type: 'date',
      options: { dateFormat: 'YYYY-MM' },
    }),
    defineField({
      name: 'badgeImage',
      title: 'Badge / Certificate Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
      ],
    }),
    defineField({
      name: 'credentialUrl',
      title: 'Credential URL',
      type: 'url',
      description: 'Link to verify the certificate',
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'string',
      description: 'One sentence describing what this cert covers',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 99,
    }),
  ],
  orderings: [
    { title: 'Order (asc)', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
    { title: 'Date, Newest', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'name', subtitle: 'issuer', media: 'badgeImage' },
  },
})
