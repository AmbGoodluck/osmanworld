import { defineField, defineType } from 'sanity'

export const siteSettingsSchema = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    // ─── Branding ──────────────────────────────────────────────────────
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      initialValue: "OSMAN'S WORLD",
    }),
    defineField({
      name: 'siteNameAccent',
      title: 'Accent Word in Site Name',
      type: 'string',
      description: 'Part of the site name shown in maroon',
      initialValue: 'WORLD',
    }),
    defineField({
      name: 'brandDescription',
      title: 'Brand Description',
      type: 'text',
      rows: 2,
      description: 'Short tagline shown in the footer brand column',
      initialValue: 'Building at the intersection of tech, fashion and entrepreneurship.',
    }),
    defineField({
      name: 'copyrightName',
      title: 'Copyright Name',
      type: 'string',
      initialValue: 'Osman Amadu Jalloh',
    }),
    defineField({
      name: 'openToWorkText',
      title: 'Open To Work Button Text',
      type: 'string',
      description: 'Text inside the footer CTA button',
      initialValue: 'Open to work',
    }),
    // ─── Navigation tabs ───────────────────────────────────────────────
    defineField({
      name: 'navTabs',
      title: 'Navigation Tabs',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name',  title: 'Label', type: 'string' }),
            defineField({ name: 'href',  title: 'Link',  type: 'string' }),
            defineField({
              name: 'sound',
              title: 'Sound Effect',
              type: 'string',
              options: { list: ['about','academics','fashion','tech','entrepreneurship','click'] },
            }),
          ],
          preview: { select: { title: 'name', subtitle: 'href' } },
        },
      ],
      initialValue: [
        { name: 'About',            href: '/about',            sound: 'about' },
        { name: 'Academics',        href: '/academics',        sound: 'academics' },
        { name: 'Fashion',          href: '/fashion',          sound: 'fashion' },
        { name: 'Tech',             href: '/tech',             sound: 'tech' },
        { name: 'Entrepreneurship', href: '/entrepreneurship', sound: 'entrepreneurship' },
        { name: 'Contact',          href: '/contact',          sound: 'click' },
      ],
    }),
    // ─── Footer columns ────────────────────────────────────────────────
    defineField({
      name: 'footerWorlds',
      title: 'Footer — Worlds Column',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({ name: 'href',  title: 'Link',  type: 'string' }),
          ],
          preview: { select: { title: 'label', subtitle: 'href' } },
        },
      ],
      initialValue: [
        { label: 'About',            href: '/about' },
        { label: 'Academics',        href: '/academics' },
        { label: 'Fashion',          href: '/fashion' },
        { label: 'Tech',             href: '/tech' },
        { label: 'Ventures',         href: '/entrepreneurship' },
      ],
    }),
    defineField({
      name: 'footerConnect',
      title: 'Footer — Connect Column',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({ name: 'href',  title: 'URL or mailto:', type: 'string' }),
          ],
          preview: { select: { title: 'label', subtitle: 'href' } },
        },
      ],
      initialValue: [
        { label: 'LinkedIn',  href: 'https://linkedin.com/in/osman-jalloh' },
        { label: 'GitHub',    href: 'https://github.com/osman-jalloh' },
        { label: 'Twitter',   href: 'https://x.com/osmanjalloh_' },
        { label: 'Instagram', href: 'https://instagram.com/osman.world' },
        { label: 'Email',     href: 'mailto:osmanworld@email.com' },
      ],
    }),
    defineField({
      name: 'footerLegal',
      title: 'Footer — Legal Column',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({ name: 'href',  title: 'Link',  type: 'string' }),
          ],
          preview: { select: { title: 'label', subtitle: 'href' } },
        },
      ],
      initialValue: [
        { label: 'Privacy Policy', href: '#privacy' },
        { label: 'Terms of Use',   href: '#terms' },
      ],
    }),
    // ─── Social links (footer icon row) ────────────────────────────────
    defineField({
      name: 'socialLinks',
      title: 'Social Links (footer icons)',
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
                  { title: 'Twitter',     value: 'Twitter'     },
                  { title: 'Instagram',   value: 'Instagram'   },
                  { title: 'Email',       value: 'Email'       },
                ],
              },
            }),
            defineField({ name: 'label', title: 'Aria Label',      type: 'string' }),
            defineField({ name: 'href',  title: 'URL or mailto:', type: 'string' }),
          ],
          preview: { select: { title: 'platform', subtitle: 'href' } },
        },
      ],
      initialValue: [
        { platform: 'LinkedIn',  label: 'LinkedIn',  href: 'https://linkedin.com/in/osman-jalloh' },
        { platform: 'GitHub',    label: 'GitHub',    href: 'https://github.com/osman-jalloh' },
        { platform: 'Twitter',   label: 'Twitter',   href: 'https://x.com/osmanjalloh_' },
        { platform: 'Instagram', label: 'Instagram', href: 'https://instagram.com/osman.world' },
        { platform: 'Email',     label: 'Email',     href: 'mailto:osmanworld@email.com' },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Site Settings' }),
  },
})
