export const revalidate = 60

import { safeFetch, getContact } from '../lib/sanity'
import ContactClient from './ContactClient'

export default async function ContactPage() {
  const data = await safeFetch(getContact)
  return <ContactClient data={data} />
}
