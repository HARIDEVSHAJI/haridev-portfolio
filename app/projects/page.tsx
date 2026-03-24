import { prisma } from '@/lib/prisma'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProjectsClient from './ProjectsClient'

export const dynamic = 'force-dynamic'

export default async function ProjectsPage() {
  const [profile, projects] = await Promise.all([
    prisma.profile.findFirst(),
    prisma.project.findMany({ orderBy: { order: 'asc' } }),
  ])

  const p = profile ?? { cvUrl: null, github: '', linkedin: '', email: '', location: '' }

  return (
    <main className="min-h-screen bg-background noise-overlay">
      <Navbar cvUrl={p.cvUrl} />
      <ProjectsClient projects={projects} />
      <Footer profile={p as { github: string; linkedin: string; email: string }} />
    </main>
  )
}
