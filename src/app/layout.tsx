import type { Metadata } from "next"
import './globals.css'
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "next-themes"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mon Voyage",
  description: "Mon Voyage",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="icon" href="/favicon/image.png" />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} w-full h-full`} suppressHydrationWarning>
          <ThemeProvider attribute="data-color-mode">
      
              <div className="min-h-screen w-full">
                {children}
              </div>
          </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
} 