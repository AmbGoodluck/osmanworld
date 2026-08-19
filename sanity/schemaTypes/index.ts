import { aboutSchema }                from './about'
import { academicsSchema }            from './academics'
import { fashionSchema }              from './fashion'
import { techSchema }                 from './tech'
import { entrepreneurshipSchema }     from './entrepreneurship'
import { contactSchema }              from './contact'
import { homePageSchema }             from './homePage'
import { siteSettingsSchema }         from './siteSettings'
import { academicsPageSchema }        from './academicsPage'
import { techPageSchema }             from './techPage'
import { fashionPageSchema }          from './fashionPage'
import { entrepreneurshipPageSchema } from './entrepreneurshipPage'
import { workExperienceSchema }       from './workExperience'
import { skillSchema }                from './skill'
import { certificationSchema }        from './certification'
import { experiencePageSchema }       from './experiencePage'

export const schemaTypes = [
  // ── Content ──────────────────────────────────────────
  aboutSchema,
  academicsSchema,
  fashionSchema,
  techSchema,
  entrepreneurshipSchema,
  contactSchema,
  workExperienceSchema,
  skillSchema,
  certificationSchema,
  // ── Page singletons ──────────────────────────────────
  homePageSchema,
  siteSettingsSchema,
  academicsPageSchema,
  techPageSchema,
  fashionPageSchema,
  entrepreneurshipPageSchema,
  experiencePageSchema,
]
