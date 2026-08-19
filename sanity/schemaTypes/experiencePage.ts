import { defineField, defineType } from 'sanity'

/**
 * Singleton — create exactly ONE document of this type in Sanity Studio.
 * Controls the hero heading, section titles, and other page-level copy.
 */
export const experiencePageSchema = defineType({
  name: 'experiencePage',
  title: 'Experience Page',
  type: 'document',
  fields: [
    defineField({
      name: 'heroHeading',
      title: 'Hero Heading',
      type: 'string',
      initialValue: 'Work & Experience',
    }),
    defineField({
      name: 'heroSubheading',
      title: 'Hero Subheading',
      type: 'string',
      initialValue: 'A journey of impact, innovation and growth.',
    }),
    defineField({
      name: 'timelineTitle',
      title: 'Timeline Section Title',
      type: 'string',
      initialValue: 'Experience',
    }),
    defineField({
      name: 'skillsTitle',
      title: 'Skills Section Title',
      type: 'string',
      initialValue: 'Skills & Technologies',
    }),
    defineField({
      name: 'projectsTitle',
      title: 'Featured Projects Section Title',
      type: 'string',
      initialValue: 'Featured Projects',
    }),
    defineField({
      name: 'certificationsTitle',
      title: 'Certifications Section Title',
      type: 'string',
      initialValue: 'Certifications & Awards',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Experience Page' }),
  },
})
