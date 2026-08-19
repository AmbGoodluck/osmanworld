import { defineField, defineType } from 'sanity'

export const skillSchema = defineType({
  name: 'skill',
  title: 'Skill',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Skill Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Programming Languages',     value: 'Programming Languages'     },
          { title: 'Frameworks & Libraries',     value: 'Frameworks & Libraries'    },
          { title: 'Tools & Platforms',          value: 'Tools & Platforms'         },
          { title: 'Soft Skills',                value: 'Soft Skills'               },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'proficiency',
      title: 'Proficiency Level',
      type: 'string',
      options: {
        list: [
          { title: 'Beginner',     value: 'Beginner'     },
          { title: 'Intermediate', value: 'Intermediate' },
          { title: 'Advanced',     value: 'Advanced'     },
          { title: 'Expert',       value: 'Expert'       },
        ],
        layout: 'radio',
      },
      initialValue: 'Intermediate',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 99,
    }),
  ],
  orderings: [
    { title: 'Category then Order', name: 'categoryOrder', by: [{ field: 'category', direction: 'asc' }, { field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'name', subtitle: 'category' },
  },
})
