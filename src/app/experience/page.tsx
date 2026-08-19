export const revalidate = 60

import { safeFetch, getExperiencePage, getWorkExperience, getSkills, getCertifications, getFeaturedTech, urlFor } from '../lib/sanity'
import ExperienceClient from '../components/ExperienceClient'

export default async function ExperiencePage() {
  const [pageData, experiences, skills, certifications, featuredProjects] = await Promise.all([
    safeFetch(getExperiencePage),
    safeFetch(getWorkExperience),
    safeFetch(getSkills),
    safeFetch(getCertifications),
    safeFetch(getFeaturedTech),
  ])

  // Resolve cover image URLs for featured projects
  const projects = featuredProjects
    ? (featuredProjects as any[]).map((p: any) => ({
        ...p,
        coverImageUrl: p.coverImage?.asset
          ? urlFor(p.coverImage).width(700).height(394).fit('crop').url()
          : null,
      }))
    : null

  // Resolve logo URLs for work experiences
  const experiencesWithLogos = experiences
    ? (experiences as any[]).map((e: any) => ({
        ...e,
        logoUrl: e.logo?.asset
          ? urlFor(e.logo).width(80).height(80).fit('crop').url()
          : null,
      }))
    : null

  // Resolve badge image URLs for certifications
  const certsWithImages = certifications
    ? (certifications as any[]).map((c: any) => ({
        ...c,
        badgeUrl: c.badgeImage?.asset
          ? urlFor(c.badgeImage).width(120).height(120).fit('crop').url()
          : null,
      }))
    : null

  return (
    <ExperienceClient
      pageData={pageData}
      experiences={experiencesWithLogos}
      skills={skills as any[] | null}
      certifications={certsWithImages}
      featuredProjects={projects}
    />
  )
}
