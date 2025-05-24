"use client"

import { Navigation } from "@/components/sections/Navigation"
import { PhotoHero } from "@/components/sections/PhotoHero"
import BackToTop from "@/components/magicui/back-to-top"

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <PhotoHero />
        <BackToTop />
      </main>
    </>
  )
} 