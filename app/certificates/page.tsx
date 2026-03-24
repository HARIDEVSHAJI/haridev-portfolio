import { prisma } from '@/lib/prisma'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CertificatesClient from './CertificatesClient'

export const dynamic = 'force-dynamic'

export default async function CertificatesPage() {
  const [profile, certificates] = await Promise.all([
    prisma.profile.findFirst(),
    prisma.certificate.findMany({ orderBy: { order: 'asc' } }),
  ])

  const p = profile ?? { cvUrl: null, github: '', linkedin: '', email: '', location: '' }

  return (
    <main className="min-h-screen bg-background noise-overlay">
      <Navbar cvUrl={p.cvUrl} />
      <CertificatesClient certificates={certificates} />
      <Footer profile={p as { github: string; linkedin: string; email: string }} />
    </main>
  )
}
