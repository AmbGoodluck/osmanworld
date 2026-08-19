// Central re-export — import from here throughout the app
export { client }  from '../../../sanity/lib/client'
export { urlFor }  from '../../../sanity/lib/image'
export {
  getHomePage,
  getSiteSettings,
  getAbout,
  getAcademics,
  getAcademicsPage,
  getFashionProjects,
  getFashionPage,
  getTechProjects,
  getTechPage,
  getVentures,
  getEntrepreneurshipPage,
  getContact,
  getExperiencePage,
  getWorkExperience,
  getSkills,
  getCertifications,
  getFeaturedTech,
} from '../../../sanity/lib/queries'

// Guard: returns true only when Sanity is actually configured
export function isSanityConfigured(): boolean {
  const id = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  return !!id && id !== 'your_project_id_here'
}

// Safe fetch wrapper — returns null instead of throwing when Sanity is not configured
export async function safeFetch<T>(fn: () => Promise<T>): Promise<T | null> {
  if (!isSanityConfigured()) return null
  try {
    return await fn()
  } catch {
    return null
  }
}
