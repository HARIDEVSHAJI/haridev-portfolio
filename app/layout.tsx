import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Haridev Shaji — AI Engineer & Backend Developer',
  description: 'Portfolio of Haridev Shaji — CS student at LPU specializing in AI/ML and Backend Development.',
  keywords: ['AI Engineer', 'Backend Developer', 'Python', 'Machine Learning', 'LPU', 'Haridev Shaji'],
  authors: [{ name: 'Haridev Shaji' }],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
