import { defineField, defineType } from 'sanity'

export const homePageSchema = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    // ─── Hero ─────────────────────────────────────────────────────────
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow Text',
      type: 'string',
      description: 'Small mono label above the name',
      initialValue: 'Portfolio · Osman Amadu Jalloh',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      description: 'Full heading e.g. "OSMAN\'S WORLD"',
      initialValue: "OSMAN'S WORLD",
    }),
    defineField({
      name: 'heroAccentWord',
      title: 'Accent Word (shown in maroon)',
      type: 'string',
      description: 'The word inside the title rendered in maroon — e.g. "WORLD"',
      initialValue: 'WORLD',
    }),
    defineField({
      name: 'rotatingTitles',
      title: 'Rotating Titles',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'Sub-titles that cycle under the hero heading',
      initialValue: [
        'Computer Science Major',
        'Fashion Designer',
        'Entrepreneur',
        'Creative Technologist',
        'Leader',
      ],
    }),
    defineField({
      name: 'bio',
      title: 'Hero Bio',
      type: 'text',
      rows: 3,
      description: 'Short paragraph shown under the rotating title',
      initialValue:
        'Sophomore CS student at Berea College. Founder, designer, and builder at the intersection of technology, fashion, and entrepreneurship.',
    }),
    // ─── CTAs ─────────────────────────────────────────────────────────
    defineField({ name: 'primaryCtaLabel',   title: 'Primary Button Label', type: 'string', initialValue: 'Explore the World' }),
    defineField({ name: 'primaryCtaHref',    title: 'Primary Button Link',  type: 'string', initialValue: '/about' }),
    defineField({ name: 'secondaryCtaLabel', title: 'Secondary Button Label', type: 'string', initialValue: 'View Projects' }),
    defineField({ name: 'secondaryCtaHref',  title: 'Secondary Button Link',  type: 'string', initialValue: '/tech' }),
    // ─── Navigate section ─────────────────────────────────────────────
    defineField({
      name: 'sectionLabel',
      title: 'Section Eyebrow',
      type: 'string',
      description: 'Mono text above the section title',
      initialValue: 'Navigate',
    }),
    defineField({
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
      initialValue: 'Choose Your World',
    }),
    defineField({
      name: 'domainCards',
      title: 'Domain Cards',
      type: 'array',
      description: '5 clickable domain cards in the "Choose Your World" section',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'num',     title: 'Number (e.g. "01")',   type: 'string' }),
            defineField({ name: 'name',    title: 'Name (e.g. "About")',  type: 'string' }),
            defineField({ name: 'href',    title: 'Link (e.g. "/about")', type: 'string' }),
            defineField({ name: 'tagline', title: 'Tagline',              type: 'string' }),
            defineField({ name: 'desc',    title: 'Description',          type: 'string' }),
            defineField({ name: 'symbol',  title: 'Symbol (Unicode char)',type: 'string' }),
            defineField({
              name: 'accentColor',
              title: 'Accent Colour',
              type: 'string',
              description: 'Hex — controls card glow, bar, and number colour',
              options: {
                list: [
                  { title: 'Sky Blue (#87CEEB)',  value: '#87CEEB' },
                  { title: 'Maroon (#8B0000)',    value: '#8B0000' },
                  { title: 'Grey (#9CA3AF)',      value: '#9CA3AF' },
                ],
              },
            }),
          ],
          preview: { select: { title: 'name', subtitle: 'tagline' } },
        },
      ],
      initialValue: [
        { num: '01', name: 'About',            href: '/about',            tagline: 'The person behind the world',       desc: 'Journey, values, and story.',             symbol: '◎', accentColor: '#87CEEB' },
        { num: '02', name: 'Academics',        href: '/academics',        tagline: 'Intellectual foundations',          desc: 'Degrees, courses, certifications.',       symbol: '◈', accentColor: '#87CEEB' },
        { num: '03', name: 'Fashion',          href: '/fashion',          tagline: 'Visual storytelling',               desc: 'Editorial, brand, photography.',          symbol: '◇', accentColor: '#9CA3AF' },
        { num: '04', name: 'Tech',             href: '/tech',             tagline: 'Systems & experiences',             desc: 'Full-stack, interactive builds.',         symbol: '◉', accentColor: '#87CEEB' },
        { num: '05', name: 'Entrepreneurship', href: '/entrepreneurship', tagline: 'Growth in motion',                  desc: 'Ventures, metrics, momentum.',            symbol: '▲', accentColor: '#8B0000' },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Home Page' }),
  },
})
