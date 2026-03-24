import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProjectDetailClient from './ProjectDetailClient'

export const dynamic = 'force-dynamic'

export default async function ProjectDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const [profile, project] = await Promise.all([
    prisma.profile.findFirst(),
    prisma.project.findUnique({ where: { slug: params.slug } }),
  ])

  if (!project) notFound()

  const p = profile ?? { cvUrl: null, github: '', linkedin: '', email: '', location: '' }

  return (
    <main className="min-h-screen bg-background noise-overlay">
      <Navbar cvUrl={p.cvUrl} />
      <ProjectDetailClient project={project} />
      <Footer profile={p as { github: string; linkedin: string; email: string }} />
    </main>
  )
}
