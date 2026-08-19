import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemaTypes'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  title: "Osman's World Studio",
  schema: { types: schemaTypes },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([

            // ── Page Settings (singletons) ─────────────────────────────
            S.listItem().title('⚙  Site Settings').id('siteSettings').child(
              S.document().schemaType('siteSettings').documentId('siteSettings')
            ),
            S.listItem().title('🏠  Home Page').id('homePage').child(
              S.document().schemaType('homePage').documentId('homePage')
            ),

            S.divider(),

            S.listItem().title('👤  About Page').id('about').child(
              S.document().schemaType('about').documentId('about')
            ),
            S.listItem().title('🎓  Academics Page').id('academicsPage').child(
              S.document().schemaType('academicsPage').documentId('academicsPage')
            ),
            S.listItem().title('👗  Fashion Page').id('fashionPage').child(
              S.document().schemaType('fashionPage').documentId('fashionPage')
            ),
            S.listItem().title('💻  Tech Page').id('techPage').child(
              S.document().schemaType('techPage').documentId('techPage')
            ),
            S.listItem().title('🚀  Entrepreneurship Page').id('entrepreneurshipPage').child(
              S.document().schemaType('entrepreneurshipPage').documentId('entrepreneurshipPage')
            ),
            S.listItem().title('💼  Experience Page').id('experiencePage').child(
              S.document().schemaType('experiencePage').documentId('experiencePage')
            ),
            S.listItem().title('📬  Contact').id('contact').child(
              S.document().schemaType('contact').documentId('contact')
            ),

            S.divider(),

            // ── Collections ────────────────────────────────────────────
            S.listItem().title('📚  Academics').id('academics').child(
              S.documentTypeList('academics').title('Academics')
            ),
            S.listItem().title('👗  Fashion Projects').id('fashion').child(
              S.documentTypeList('fashion').title('Fashion Projects')
            ),
            S.listItem().title('💻  Tech Projects').id('tech').child(
              S.documentTypeList('tech').title('Tech Projects')
            ),
            S.listItem().title('🚀  Ventures').id('entrepreneurship').child(
              S.documentTypeList('entrepreneurship').title('Ventures')
            ),
            S.listItem().title('🏢  Work Experience').id('workExperience').child(
              S.documentTypeList('workExperience').title('Work Experience')
            ),
            S.listItem().title('🛠  Skills').id('skill').child(
              S.documentTypeList('skill').title('Skills')
            ),
            S.listItem().title('🏆  Certifications').id('certification').child(
              S.documentTypeList('certification').title('Certifications')
            ),

          ]),
    }),
    visionTool(),
  ],
})
