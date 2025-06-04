"use client"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ImagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header avec bouton de retour */}
      <header>
        <div className="container flex h-14 items-center px-4">
          <Link 
            href="/" 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-2"
          >

            <ArrowLeft className="h-4 w-4" />
            Retour
          </Link>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
