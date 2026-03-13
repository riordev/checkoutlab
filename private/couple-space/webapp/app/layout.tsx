import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'UsTime - For Us',
  description: 'A shared space for couples to plan, remember, and grow together',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-rose-50 min-h-screen`}>
        <Navbar />
        <main className="container mx-auto px-4 py-6 max-w-5xl">
          {children}
        </main>
      </body>
    </html>
  )
}
