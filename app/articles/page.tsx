import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ArticlesClient from './ArticlesClient'

export const dynamic = 'force-dynamic'

export default async function ArticlesPage() {
  const [profile, articles] = await Promise.all([
    prisma.profile.findFirst(),
    prisma.article.findMany({ orderBy: { order: 'asc' } }),
  ])
  if (articles.length === 0) notFound()
  const p = profile ?? { cvUrl: null, github: '', linkedin: '', email: '' }
  return (
    <main className="min-h-screen noise-overlay" style={{ background: 'var(--background)' }}>
      <Navbar cvUrl={p.cvUrl} hasArticles />
      <ArticlesClient articles={articles} />
      <Footer profile={p as any} />
    </main>
  )
}
