import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const envPath = resolve(__dirname, '../.env.local')
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(l => l && !l.startsWith('#') && l.includes('='))
    .map(l => { const i = l.indexOf('='); return [l.slice(0,i).trim(), l.slice(i+1).trim()] })
)

const client = createClient({
  projectId:  env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset:    env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn:     false,
  token:      env.SANITY_API_TOKEN,
})

function block(text) {
  return {
    _type: 'block',
    _key:  `b${Math.random().toString(36).slice(2,8)}`,
    style: 'normal',
    children: [{ _type: 'span', _key: `s${Math.random().toString(36).slice(2,8)}`, text }],
  }
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────
const about = {
  _id:   'about',
  _type: 'about',
  title:   'Osman Amadu Jalloh',
  tagline: 'Computer Science Major | Founder | Designer | Leader',
  location: 'Berea, KY',
  email:    'osmanworld@email.com',
  bio: [
    block("I'm a sophomore Computer Science student at Berea College with a passion for building products that solve real problems. My journey started at African Leadership Academy in South Africa, where I learned that technology and design thinking can drive meaningful change."),
    block("Today, I blend my technical skills with entrepreneurial ambition and creative expression through fashion design. I believe in intentional work — every project, every design, every decision should create impact."),
  ],
  journeyMilestones: [
    { _key: 'm1', year: '2021', title: 'African Leadership Academy',   description: 'Studied at ALA in Johannesburg, South Africa — developed leadership foundations and design thinking in a pan-African environment.' },
    { _key: 'm2', year: '2023', title: 'Enrolled at Berea College',    description: 'Started Computer Science studies at Berea College, Kentucky — combining technical rigor with entrepreneurial vision.' },
    { _key: 'm3', year: '2024', title: 'Founder & Designer',           description: 'Launched ventures at the intersection of technology, fashion, and community impact.' },
    { _key: 'm4', year: '2025', title: 'Building Osman\'s World',       description: 'Created this portfolio — a living showcase of tech, fashion, and entrepreneurial projects.' },
  ],
  socialLinks: [
    { _key: 'sl1', platform: 'LinkedIn',    url: 'https://linkedin.com/in/osman-jalloh'  },
    { _key: 'sl2', platform: 'GitHub',      url: 'https://github.com/osman-jalloh'       },
    { _key: 'sl3', platform: 'Twitter / X', url: 'https://x.com/osmanjalloh_'            },
    { _key: 'sl4', platform: 'Instagram',   url: 'https://instagram.com/osman.world'     },
  ],
  tags: ['Leadership', 'Innovation', 'Design Thinking', 'Community', 'Computer Science', 'Entrepreneurship'],
}

// ─── ACADEMICS ────────────────────────────────────────────────────────────────
const academics = [
  {
    _id:   'academics-berea',
    _type: 'academics',
    title:       'B.S. Computer Science',
    institution: 'Berea College',
    startDate:   '2023-08',
    current:     true,
    description: [
      block('Studying Computer Science at Berea College with a focus on software engineering, algorithms, and human-computer interaction. Berea\'s unique model combines academic excellence with hands-on work experience.'),
    ],
    courses: [
      { _key: 'c1', name: 'Data Structures & Algorithms',  grade: 'A'  },
      { _key: 'c2', name: 'Software Engineering',          grade: 'A-' },
      { _key: 'c3', name: 'Calculus I & II',               grade: 'B+' },
      { _key: 'c4', name: 'Linear Algebra',                grade: 'A'  },
      { _key: 'c5', name: 'Intro to Computer Science',     grade: 'A'  },
      { _key: 'c6', name: 'Web Development',               grade: 'A'  },
      { _key: 'c7', name: 'Entrepreneurship',              grade: 'A'  },
      { _key: 'c8', name: 'Design Thinking',               grade: 'A-' },
    ],
    skills: [
      { _key: 'sk1', category: 'Languages',   items: ['JavaScript', 'TypeScript', 'Python', 'Java', 'SQL'] },
      { _key: 'sk2', category: 'Frontend',    items: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'Three.js'] },
      { _key: 'sk3', category: 'Backend',     items: ['Node.js', 'Express', 'REST APIs', 'GraphQL'] },
      { _key: 'sk4', category: 'Tools',       items: ['Git', 'VS Code', 'Figma', 'Sanity CMS', 'Vercel'] },
      { _key: 'sk5', category: 'Concepts',    items: ['System Design', 'Agile', 'OOP', 'Functional Programming'] },
    ],
    tags: ['Computer Science', 'STEM', 'Undergraduate', 'Kentucky'],
  },
  {
    _id:   'academics-ala',
    _type: 'academics',
    title:       'Pre-University Programme',
    institution: 'African Leadership Academy',
    startDate:   '2021-01',
    endDate:     '2022-12',
    current:     false,
    description: [
      block('African Leadership Academy (ALA) is a pan-African institution in Johannesburg, South Africa that develops the next generation of African leaders through an entrepreneurial leadership curriculum and an emphasis on design thinking and social impact.'),
    ],
    courses: [
      { _key: 'c1', name: 'Entrepreneurial Leadership', grade: 'Distinction' },
      { _key: 'c2', name: 'Design Thinking',            grade: 'Distinction' },
      { _key: 'c3', name: 'African Studies',            grade: 'Merit'       },
      { _key: 'c4', name: 'Mathematics',                grade: 'Merit'       },
      { _key: 'c5', name: 'English & Communication',    grade: 'Distinction' },
    ],
    skills: [
      { _key: 'sk1', category: 'Leadership',  items: ['Team Leadership', 'Public Speaking', 'Strategic Thinking'] },
      { _key: 'sk2', category: 'Design',      items: ['Design Thinking', 'Prototyping', 'User Research'] },
      { _key: 'sk3', category: 'Business',    items: ['Business Modelling', 'Pitching', 'Market Research'] },
    ],
    tags: ['Leadership', 'Pan-African', 'South Africa', 'Design Thinking'],
  },
]

// ─── TECH PROJECTS ────────────────────────────────────────────────────────────
const techProjects = [
  {
    _id:   'tech-osmanworld',
    _type: 'tech',
    title:    "Osman's World Portfolio",
    slug:     { _type: 'slug', current: 'osmanworld-portfolio' },
    featured: true,
    date:     '2025-01-01',
    description: [
      block('A premium Next.js portfolio with full 3D world navigation built with React Three Fiber. Features five distinct sections — About, Academics, Fashion, Tech, and Entrepreneurship — each with its own 3D scene, animated gallery, and Sanity CMS integration.'),
    ],
    techStack: ['Next.js', 'React', 'TypeScript', 'Three.js', 'React Three Fiber', 'Framer Motion', 'Sanity CMS', 'Tailwind CSS', 'Vercel'],
    githubUrl: 'https://github.com/osman-jalloh',
    tags: ['Portfolio', 'Full-Stack', '3D', 'Web'],
  },
  {
    _id:   'tech-dashboard',
    _type: 'tech',
    title:    'Analytics Dashboard App',
    slug:     { _type: 'slug', current: 'analytics-dashboard' },
    featured: false,
    date:     '2024-09-01',
    description: [
      block('A data analytics dashboard built with React and Node.js. Features real-time charts, user authentication, and REST API integration. Designed for small businesses to track key metrics.'),
    ],
    techStack: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Chart.js', 'Tailwind CSS'],
    tags: ['Dashboard', 'Full-Stack', 'Analytics'],
  },
  {
    _id:   'tech-api',
    _type: 'tech',
    title:    'RESTful API Service',
    slug:     { _type: 'slug', current: 'restful-api-service' },
    featured: false,
    date:     '2024-06-01',
    description: [
      block('A scalable RESTful API built with Node.js and Express, featuring JWT authentication, rate limiting, and PostgreSQL database. Documented with Swagger and deployed on Render.'),
    ],
    techStack: ['Node.js', 'Express', 'PostgreSQL', 'JWT', 'Swagger', 'Docker'],
    tags: ['API', 'Backend', 'Systems'],
  },
  {
    _id:   'tech-mobile',
    _type: 'tech',
    title:    'Mobile-First Web App',
    slug:     { _type: 'slug', current: 'mobile-first-web-app' },
    featured: false,
    date:     '2024-03-01',
    description: [
      block('A responsive, mobile-first web application built for a student organization. Features event scheduling, member management, and push notifications via a Progressive Web App (PWA) setup.'),
    ],
    techStack: ['React', 'PWA', 'Firebase', 'Tailwind CSS'],
    tags: ['Mobile', 'PWA', 'Frontend'],
  },
]

// ─── FASHION PROJECTS ─────────────────────────────────────────────────────────
const fashionProjects = [
  {
    _id:   'fashion-editorial-001',
    _type: 'fashion',
    title:       'Identity Editorial',
    slug:        { _type: 'slug', current: 'identity-editorial' },
    projectType: 'editorial',
    featured:    true,
    date:        '2024-10-01',
    description: [
      block('A conceptual editorial exploring the intersection of African identity and contemporary streetwear. Inspired by ALA and the diaspora experience — bold patterns, clean cuts, and intentional layering.'),
    ],
    tags: ['Editorial', 'African Identity', 'Streetwear', 'Concept'],
  },
  {
    _id:   'fashion-brand-001',
    _type: 'fashion',
    title:       'OW Brand Capsule',
    slug:        { _type: 'slug', current: 'ow-brand-capsule' },
    projectType: 'brand',
    featured:    true,
    date:        '2024-07-01',
    description: [
      block("The first capsule collection for Osman's World — a six-piece drop built around the concept of 'Intentional Living'. Minimalist silhouettes, premium fabrics, and the OW monogram as a recurring motif."),
    ],
    tags: ['Brand', 'Capsule Collection', 'Minimalist', 'OW'],
  },
  {
    _id:   'fashion-photography-001',
    _type: 'fashion',
    title:       'Berea College Campus Shoot',
    slug:        { _type: 'slug', current: 'berea-campus-shoot' },
    projectType: 'photography',
    featured:    false,
    date:        '2024-04-01',
    description: [
      block('A fashion photography series shot on Berea College campus during spring. Natural light, architectural backgrounds, and a focus on movement and texture.'),
    ],
    tags: ['Photography', 'Campus', 'Editorial', 'Spring'],
  },
  {
    _id:   'fashion-styling-001',
    _type: 'fashion',
    title:       'Leadership Summit Look',
    slug:        { _type: 'slug', current: 'leadership-summit-look' },
    projectType: 'styling',
    featured:    false,
    date:        '2023-11-01',
    description: [
      block('Personal styling concept for high-profile leadership events — combining sharp tailoring with cultural accents. The look was worn at a regional entrepreneurship summit.'),
    ],
    tags: ['Styling', 'Formal', 'Leadership', 'Event'],
  },
  {
    _id:   'fashion-collab-001',
    _type: 'fashion',
    title:       'Community Design Workshop',
    slug:        { _type: 'slug', current: 'community-design-workshop' },
    projectType: 'collaboration',
    featured:    false,
    date:        '2023-08-01',
    description: [
      block('Co-led a 2-day fashion design workshop for young creatives in the local community. Participants designed their own pieces from concept to prototype.'),
    ],
    tags: ['Workshop', 'Community', 'Collaboration', 'Education'],
  },
]

// ─── VENTURES ─────────────────────────────────────────────────────────────────
const ventures = [
  {
    _id:   'venture-osmanworld',
    _type: 'entrepreneurship',
    title:    "Osman's World",
    slug:     { _type: 'slug', current: 'osmans-world' },
    status:   'active',
    featured: true,
    date:     '2024-01-01',
    description: [
      block("A personal brand and creative studio at the intersection of technology, fashion, and entrepreneurship. Osman's World produces digital experiences, fashion capsules, and community-driven projects."),
    ],
    metrics: [
      { _key: 'mt1', label: 'Projects',  value: '10+',    unit: 'completed'  },
      { _key: 'mt2', label: 'Domains',   value: '5',      unit: 'pillars'    },
      { _key: 'mt3', label: 'Community', value: '500+',   unit: 'followers'  },
    ],
    tags: ['Personal Brand', 'Creative Studio', 'Tech', 'Fashion'],
  },
  {
    _id:   'venture-techstudio',
    _type: 'entrepreneurship',
    title:    'Tech Studio — Freelance',
    slug:     { _type: 'slug', current: 'tech-studio-freelance' },
    status:   'active',
    featured: true,
    date:     '2023-09-01',
    description: [
      block('Freelance software development practice building web applications, APIs, and interactive experiences for clients. Specialising in React, Next.js, and 3D web.'),
    ],
    metrics: [
      { _key: 'mt1', label: 'Clients',   value: '5+',  unit: 'served'       },
      { _key: 'mt2', label: 'Projects',  value: '8+',  unit: 'delivered'    },
      { _key: 'mt3', label: 'Stack',     value: '10+', unit: 'technologies' },
    ],
    tags: ['Freelance', 'Web Dev', 'Software', 'Consulting'],
  },
  {
    _id:   'venture-fashionbrand',
    _type: 'entrepreneurship',
    title:    'OW Fashion Label',
    slug:     { _type: 'slug', current: 'ow-fashion-label' },
    status:   'stealth',
    featured: false,
    date:     '2024-06-01',
    description: [
      block('An emerging fashion label building capsule collections that blend African aesthetic with contemporary minimalism. Currently in design and production phase for the inaugural drop.'),
    ],
    metrics: [
      { _key: 'mt1', label: 'Pieces',     value: '6',    unit: 'in capsule'  },
      { _key: 'mt2', label: 'Materials',  value: '3',    unit: 'premium'     },
      { _key: 'mt3', label: 'Stage',      value: 'Pre',  unit: 'launch'      },
    ],
    tags: ['Fashion', 'Brand', 'Capsule', 'African Aesthetic'],
  },
  {
    _id:   'venture-leadership',
    _type: 'entrepreneurship',
    title:    'Leadership & Mentorship',
    slug:     { _type: 'slug', current: 'leadership-mentorship' },
    status:   'active',
    featured: false,
    date:     '2022-01-01',
    description: [
      block('Community leadership and peer mentorship initiatives developed through ALA and Berea College. Includes workshop facilitation, peer coaching, and student organization leadership.'),
    ],
    metrics: [
      { _key: 'mt1', label: 'Mentees',    value: '20+', unit: 'supported'   },
      { _key: 'mt2', label: 'Workshops',  value: '5+',  unit: 'facilitated' },
      { _key: 'mt3', label: 'Programs',   value: '3',   unit: 'active'      },
    ],
    tags: ['Leadership', 'Mentorship', 'Community', 'Education'],
  },
]

// ─── CONTACT ──────────────────────────────────────────────────────────────────
const contact = {
  _id:   'contact',
  _type: 'contact',
  email:        'osmanworld@email.com',
  location:     'Berea, KY · Remote',
  responseTime: 'Within 24 hours',
  openTo:       'Collabs · Internships · Projects',
  heroTagline:  "Whether it's a project, collaboration, or just a conversation — the door is always open.",
  socialLinks: [
    { _key: 'sl1', platform: 'LinkedIn',    handle: 'Osman Amadu Jalloh', url: 'https://linkedin.com/in/osman-jalloh'  },
    { _key: 'sl2', platform: 'GitHub',      handle: '@osman-jalloh',      url: 'https://github.com/osman-jalloh'       },
    { _key: 'sl3', platform: 'Twitter / X', handle: '@osmanjalloh_',      url: 'https://x.com/osmanjalloh_'            },
    { _key: 'sl4', platform: 'Instagram',   handle: '@osman.world',       url: 'https://instagram.com/osman.world'     },
    { _key: 'sl5', platform: 'Email',       handle: 'osmanworld@email.com', url: 'osmanworld@email.com'                },
  ],
}

// ─── RUN ──────────────────────────────────────────────────────────────────────
async function run() {
  const all = [
    { label: 'About',             doc: about },
    ...academics.map(d      => ({ label: `Academics: ${d.title}`,     doc: d })),
    ...techProjects.map(d   => ({ label: `Tech: ${d.title}`,          doc: d })),
    ...fashionProjects.map(d => ({ label: `Fashion: ${d.title}`,      doc: d })),
    ...ventures.map(d        => ({ label: `Venture: ${d.title}`,      doc: d })),
    { label: 'Contact',           doc: contact },
  ]

  for (const { label, doc } of all) {
    process.stdout.write(`  Seeding ${label}... `)
    await client.createOrReplace(doc)
    console.log('✓')
  }

  console.log(`\n✅ Done — ${all.length} documents seeded.`)
  console.log('   Open http://localhost:3000/studio to review and edit.')
}

run().catch(err => {
  console.error('\n❌ Error:', err.message)
  if (err.message.includes('Unauthorized') || err.message.includes('token')) {
    console.error('\n   Your API token may be missing or invalid.')
    console.error('   → sanity.io/manage → API → Tokens → Add token (Editor role)')
    console.error('   → Paste it as SANITY_API_TOKEN in .env.local')
  }
  process.exit(1)
})
