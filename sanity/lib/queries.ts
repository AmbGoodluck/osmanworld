import { client } from './client'

// Helper: returns null immediately when Sanity client is not configured.
// Every exported function uses this so the build never crashes without env vars.
function safeClient() {
  return client ?? null
}

// ─── Shared gallery/photo projection fragments ──────────────────────────────
const GALLERY_ITEM_PROJECTION = `{
  title,
  description,
  tag,
  accent,
  image{ asset->, alt }
}`

const PHOTO_PROJECTION = `{
  image{ asset->, alt },
  title
}`

// ─── Home Page ─────────────────────────────────────────────────────────────
export async function getHomePage() {
  const c = safeClient(); if (!c) return null
  return c.fetch(
    `*[_type == "homePage"][0]{
      eyebrow,
      heroTitle,
      heroAccentWord,
      rotatingTitles,
      bio,
      primaryCtaLabel,
      primaryCtaHref,
      secondaryCtaLabel,
      secondaryCtaHref,
      sectionLabel,
      sectionTitle,
      domainCards[]{ num, name, href, tagline, desc, symbol, accentColor }
    }`
  )
}

// ─── Site Settings ─────────────────────────────────────────────────────────
export async function getSiteSettings() {
  const c = safeClient(); if (!c) return null
  return c.fetch(
    `*[_type == "siteSettings"][0]{
      siteName,
      siteNameAccent,
      brandDescription,
      copyrightName,
      openToWorkText,
      navTabs[]{ name, href, sound },
      footerWorlds[]{ label, href },
      footerConnect[]{ label, href },
      footerLegal[]{ label, href },
      socialLinks[]{ platform, label, href }
    }`
  )
}

// ─── About ─────────────────────────────────────────────────────────────────
export async function getAbout() {
  const c = safeClient(); if (!c) return null
  return c.fetch(
    `*[_type == "about"][0]{
      title,
      tagline,
      bio,
      profileImage{ asset->, alt },
      journeyMilestones[]{ year, title, description },
      location,
      email,
      socialLinks[]{ platform, url },
      tags,
      galleryTitle,
      galleryItems[]${GALLERY_ITEM_PROJECTION},
      photosTitle,
      photos[]${PHOTO_PROJECTION}
    }`
  )
}

// ─── Academics Page (singleton) ────────────────────────────────────────────
export async function getAcademicsPage() {
  const c = safeClient(); if (!c) return null
  return c.fetch(
    `*[_type == "academicsPage"][0]{
      pageTitle,
      pageDescription,
      galleryTitle,
      galleryItems[]${GALLERY_ITEM_PROJECTION},
      photosTitle,
      photos[]${PHOTO_PROJECTION}
    }`
  )
}

// ─── Academics (collection) ────────────────────────────────────────────────
export async function getAcademics() {
  const c = safeClient(); if (!c) return null
  return c.fetch(
    `*[_type == "academics"] | order(startDate desc){
      _id,
      title,
      institution,
      description,
      startDate,
      endDate,
      current,
      courses[]{ name, grade, description },
      certifications[]{ name, issuer, date, url },
      skills[]{ category, items },
      tags
    }`
  )
}

// ─── Tech Page (singleton) ─────────────────────────────────────────────────
export async function getTechPage() {
  const c = safeClient(); if (!c) return null
  return c.fetch(
    `*[_type == "techPage"][0]{
      pageTitle,
      pageDescription,
      galleryTitle,
      galleryItems[]${GALLERY_ITEM_PROJECTION},
      photosTitle,
      photos[]${PHOTO_PROJECTION}
    }`
  )
}

// ─── Tech (collection) ─────────────────────────────────────────────────────
export async function getTechProjects() {
  const c = safeClient(); if (!c) return null
  return c.fetch(
    `*[_type == "tech"] | order(date desc){
      _id,
      title,
      slug,
      description,
      coverImage{ asset->, alt },
      images[]{ asset->, alt, caption },
      codeSnippets[]{ caption, language, code },
      techStack,
      githubUrl,
      liveUrl,
      date,
      tags,
      featured
    }`
  )
}

export async function getFeaturedTech() {
  const c = safeClient(); if (!c) return null
  return c.fetch(
    `*[_type == "tech" && featured == true] | order(date desc)[0...3]{
      _id,
      title,
      slug,
      coverImage{ asset->, alt },
      techStack,
      githubUrl,
      liveUrl,
      date,
      tags
    }`
  )
}

// ─── Fashion Page (singleton) ──────────────────────────────────────────────
export async function getFashionPage() {
  const c = safeClient(); if (!c) return null
  return c.fetch(
    `*[_type == "fashionPage"][0]{
      pageLabel,
      pageTitle,
      pageDescription,
      galleryTitle,
      galleryItems[]${GALLERY_ITEM_PROJECTION},
      editorialGrid[]{ image{ asset->, alt }, label },
      timelineLabel,
      timelineTitle,
      fashionTimeline[]{ year, title, description }
    }`
  )
}

// ─── Fashion (collection) ──────────────────────────────────────────────────
export async function getFashionProjects() {
  const c = safeClient(); if (!c) return null
  return c.fetch(
    `*[_type == "fashion"] | order(date desc){
      _id,
      title,
      slug,
      description,
      coverImage{ asset->, alt },
      images[]{ asset->, alt, caption },
      projectType,
      date,
      tags,
      link,
      featured
    }`
  )
}

export async function getFeaturedFashion() {
  const c = safeClient(); if (!c) return null
  return c.fetch(
    `*[_type == "fashion" && featured == true] | order(date desc)[0...3]{
      _id,
      title,
      slug,
      coverImage{ asset->, alt },
      projectType,
      date,
      tags
    }`
  )
}

// ─── Entrepreneurship Page (singleton) ────────────────────────────────────
export async function getEntrepreneurshipPage() {
  const c = safeClient(); if (!c) return null
  return c.fetch(
    `*[_type == "entrepreneurshipPage"][0]{
      pageTitle,
      pageDescription,
      galleryTitle,
      galleryItems[]${GALLERY_ITEM_PROJECTION},
      photosTitle,
      photos[]${PHOTO_PROJECTION}
    }`
  )
}

// ─── Entrepreneurship (collection) ─────────────────────────────────────────
export async function getVentures() {
  const c = safeClient(); if (!c) return null
  return c.fetch(
    `*[_type == "entrepreneurship"] | order(date desc){
      _id,
      title,
      slug,
      description,
      coverImage{ asset->, alt },
      images[]{ asset->, alt, caption },
      status,
      metrics[]{ label, value, unit },
      date,
      website,
      tags,
      featured
    }`
  )
}

export async function getFeaturedVentures() {
  const c = safeClient(); if (!c) return null
  return c.fetch(
    `*[_type == "entrepreneurship" && featured == true] | order(date desc)[0...3]{
      _id,
      title,
      slug,
      coverImage{ asset->, alt },
      status,
      metrics[]{ label, value, unit },
      date,
      tags
    }`
  )
}

// ─── Contact ───────────────────────────────────────────────────────────────
export async function getContact() {
  const c = safeClient(); if (!c) return null
  return c.fetch(
    `*[_type == "contact"][0]{
      email,
      location,
      responseTime,
      openTo,
      heroTagline,
      socialLinks[]{ platform, handle, url }
    }`
  )
}

// ─── Experience Page (singleton) ───────────────────────────────────────────
export async function getExperiencePage() {
  const c = safeClient(); if (!c) return null
  return c.fetch(
    `*[_type == "experiencePage"][0]{
      heroHeading,
      heroSubheading,
      timelineTitle,
      skillsTitle,
      projectsTitle,
      certificationsTitle
    }`
  )
}

// ─── Work Experience (collection) ──────────────────────────────────────────
export async function getWorkExperience() {
  const c = safeClient(); if (!c) return null
  return c.fetch(
    `*[_type == "workExperience"] | order(order asc, startDate desc){
      _id,
      company,
      role,
      employmentType,
      location,
      startDate,
      endDate,
      current,
      logo{ asset->, alt },
      achievements,
      techStack,
      featured,
      order
    }`
  )
}

// ─── Skills (collection) ───────────────────────────────────────────────────
export async function getSkills() {
  const c = safeClient(); if (!c) return null
  return c.fetch(
    `*[_type == "skill"] | order(category asc, order asc){
      _id,
      name,
      category,
      proficiency,
      order
    }`
  )
}

// ─── Certifications (collection) ───────────────────────────────────────────
export async function getCertifications() {
  const c = safeClient(); if (!c) return null
  return c.fetch(
    `*[_type == "certification"] | order(order asc, date desc){
      _id,
      name,
      issuer,
      date,
      badgeImage{ asset->, alt },
      credentialUrl,
      description,
      order
    }`
  )
}
