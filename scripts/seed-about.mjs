import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Read env manually (no dotenv needed — just parse .env.local)
const envPath = resolve(__dirname, '../.env.local')
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(l => l && !l.startsWith('#') && l.includes('='))
    .map(l => l.split('=').map(s => s.trim()))
)

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset:   env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: env.SANITY_API_TOKEN,
})

const aboutDoc = {
  _id:  'about',
  _type: 'about',
  title: 'Osman Amadu Jalloh',
  tagline: 'Computer Science Major | Founder | Designer | Leader',
  location: 'Berea, KY',
  bio: [
    {
      _type: 'block',
      _key: 'bio1',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'span1',
          text: "I'm a sophomore Computer Science student at Berea College with a passion for building products that solve real problems. My journey started at African Leadership Academy in South Africa, where I learned that technology and design thinking can drive meaningful change.",
        },
      ],
    },
    {
      _type: 'block',
      _key: 'bio2',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'span2',
          text: "Today, I blend my technical skills with entrepreneurial ambition and creative expression through fashion design. I believe in intentional work — every project, every design, every decision should create impact.",
        },
      ],
    },
  ],
  journeyMilestones: [
    {
      _key: 'm1',
      year: '2021',
      title: 'African Leadership Academy',
      description: 'Studied at ALA in Johannesburg, South Africa — developed leadership foundations and design thinking in a pan-African environment.',
    },
    {
      _key: 'm2',
      year: '2023',
      title: 'Enrolled at Berea College',
      description: 'Started Computer Science studies at Berea College, Kentucky — combining technical rigor with entrepreneurial vision.',
    },
    {
      _key: 'm3',
      year: '2024',
      title: 'Founder & Designer',
      description: 'Launched ventures at the intersection of technology, fashion, and community impact.',
    },
  ],
  tags: ['Leadership', 'Innovation', 'Design Thinking', 'Community', 'Computer Science', 'Entrepreneurship'],
}

async function run() {
  console.log('Creating About document...')
  const result = await client.createOrReplace(aboutDoc)
  console.log('✓ About document created:', result._id)
}

run().catch((err) => {
  console.error('Error:', err.message)
  if (err.message.includes('Unauthorized') || err.message.includes('token')) {
    console.error('\n→ You need a write token. Go to:')
    console.error('  sanity.io/manage → your project → API → Tokens → Add API token (Editor role)')
    console.error('  Then add SANITY_API_TOKEN=your_token to .env.local and re-run.')
  }
  process.exit(1)
})
