"use client"

import { useRef } from "react"
import { Footer } from "@/components/sections/Footer"
import BackToTop from "@/components/magicui/back-to-top"
import { Feature } from "@/components/sections/Features";

export default function Home() {
  const featureRef = useRef<HTMLDivElement>(null)



  return (
    <main>
      <Feature ref={featureRef} />
      <Footer />
      <BackToTop />
    </main>
  )
} 