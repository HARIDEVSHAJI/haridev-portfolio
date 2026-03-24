import { prisma } from '@/lib/prisma'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import SkillsSection from '@/components/sections/SkillsSection'
import ServicesSection from '@/components/sections/ServicesSection'
import AchievementsSection from '@/components/sections/AchievementsSection'
import ContactSection from '@/components/sections/ContactSection'
import CursorGlow from '@/components/ui/CursorGlow'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [profile, skills, services, achievements, experiences, patents, trainings, articleCount] =
    await Promise.all([
      prisma.profile.findFirst(),
      prisma.skill.findMany({ orderBy: { order: 'asc' } }),
      prisma.service.findMany({ orderBy: { order: 'asc' } }),
      prisma.achievement.findMany({ orderBy: { order: 'asc' } }),
      prisma.experience.findMany({ orderBy: { order: 'asc' } }),
      prisma.patent.findMany({ orderBy: { order: 'asc' } }),
      prisma.training.findMany({ orderBy: { order: 'asc' } }),
      prisma.article.count(),
    ])

  const p = profile ?? {
    tagline: 'AI Engineer & Backend Developer',
    bio: "I'm Haridev Shaji, a CS student at LPU specializing in AI & ML. Passionate about building intelligent systems and scalable backend architectures.",
    github: 'https://github.com/haridevshaji', linkedin: 'https://linkedin.com/in/haridevshaji',
    twitter: '', instagram: '', email: 'haridevshaji@gmail.com', phone: '',
    location: 'Punjab, India', cvUrl: null, avatarUrl: null, isAvailable: true,
    typingTexts: ['AI Engineer', 'Backend Developer', 'ML Enthusiast', 'Problem Solver'],
    currently: '3rd year B.Tech student at LPU specializing in AI & ML. Actively building projects in ML, backend systems, and LLM applications.',
    statYears: '2+', statProjects: '10+', statSpec: 'AI/ML', statUni: 'LPU',
  }

  return (
    <main className="min-h-screen noise-overlay" style={{ background: 'var(--background)' }}>
      <CursorGlow />
      <Navbar cvUrl={p.cvUrl} hasArticles={articleCount > 0} />
      <HeroSection profile={p} />
      <AboutSection profile={p} experiences={experiences} patents={patents} trainings={trainings} />
      <SkillsSection skills={skills} />
      <ServicesSection services={services} />
      <AchievementsSection achievements={achievements} />
      <ContactSection profile={p} />
      <Footer profile={p} />
    </main>
  )
}
