export const revalidate = 60

import { safeFetch, getAbout, getHomePage, urlFor } from './lib/sanity'
import HomeClient from './components/HomeClient'

export default async function Home() {
  const [about, homePage] = await Promise.all([
    safeFetch(getAbout),
    safeFetch(getHomePage),
  ])

  const profileImageUrl =
    about?.profileImage?.asset
      ? urlFor(about.profileImage).width(440).height(440).fit('crop').url()
      : null

  return <HomeClient profileImageUrl={profileImageUrl} homePage={homePage} />
}
