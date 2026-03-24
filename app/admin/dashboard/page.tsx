import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AdminDashboardClient from './AdminDashboardClient'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin')

  const [profile, skills, services, projects, certificates, achievements, messages, experiences, patents, trainings, articles] =
    await Promise.all([
      prisma.profile.findFirst(),
      prisma.skill.findMany({ orderBy: { order: 'asc' } }),
      prisma.service.findMany({ orderBy: { order: 'asc' } }),
      prisma.project.findMany({ orderBy: { order: 'asc' } }),
      prisma.certificate.findMany({ orderBy: { order: 'asc' } }),
      prisma.achievement.findMany({ orderBy: { order: 'asc' } }),
      prisma.message.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.experience.findMany({ orderBy: { order: 'asc' } }),
      prisma.patent.findMany({ orderBy: { order: 'asc' } }),
      prisma.training.findMany({ orderBy: { order: 'asc' } }),
      prisma.article.findMany({ orderBy: { order: 'asc' } }),
    ])

  const serializedMessages = messages.map(m => ({
    ...m,
    createdAt: m.createdAt.toISOString()
  }))

  return (
    <AdminDashboardClient initialData={{ profile, skills, services, projects, certificates, achievements, messages: serializedMessages, experiences, patents, trainings, articles }} />
  )
}
