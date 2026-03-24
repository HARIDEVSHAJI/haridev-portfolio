'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Github, ExternalLink, ArrowRight } from 'lucide-react'

interface Project {
  id: string; title: string; slug: string; description: string
  techStack: string[]; images: string[]; githubUrl?: string | null
  liveUrl?: string | null; featured: boolean
}

function ensureAbsolute(url: string) {
  if (!url) return url
  return url.startsWith('http') ? url : 'https://' + url
}

export default function ProjectsClient({ projects }: { projects: Project[] }) {
  const featured = projects.filter(p => p.featured)
  const rest = projects.filter(p => !p.featured)

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-20">
          <p className="text-accent text-xs font-medium tracking-[0.25em] uppercase mb-4" style={{ fontFamily: 'var(--font-jetbrains)' }}>Portfolio</p>
          <h1 className="section-title" style={{ fontFamily: 'var(--font-syne)' }}>Featured <span className="gradient-text">Projects</span></h1>
          <p className="text-text-secondary mt-4 max-w-xl mx-auto text-sm">Click any project to see full details, images, and source code.</p>
        </motion.div>

        {featured.length > 0 && (
          <div className="mb-14">
            <p className="text-xs text-text-muted uppercase tracking-widest mb-7 flex items-center gap-2" style={{ fontFamily: 'var(--font-jetbrains)' }}>
              <span className="w-2 h-2 rounded-full bg-accent" /> Featured
            </p>
            <div className="grid lg:grid-cols-2 gap-5">
              {featured.map((p, i) => <ProjectCard key={p.id} project={p} index={i} large />)}
            </div>
          </div>
        )}

        {rest.length > 0 && (
          <div>
            {featured.length > 0 && (
              <p className="text-xs text-text-muted uppercase tracking-widest mb-7 flex items-center gap-2" style={{ fontFamily: 'var(--font-jetbrains)' }}>
                <span className="w-2 h-2 rounded-full bg-accent/60" /> All Projects
              </p>
            )}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
            </div>
          </div>
        )}

        {projects.length === 0 && (
          <div className="text-center text-text-muted py-24">
            <p className="text-5xl mb-4">🚧</p>
            <p className="text-xl font-semibold" style={{ fontFamily: 'var(--font-syne)' }}>Projects coming soon...</p>
          </div>
        )}
      </div>
    </div>
  )
}

function ProjectCard({ project, index, large }: { project: Project; index: number; large?: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}>
      <Link href={`/projects/${project.slug}`}>
        <div className="glass rounded-2xl overflow-hidden border border-white/5 hover:border-accent/20 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] group">
          {/* Image */}
          <div className={`relative overflow-hidden bg-surface-2 ${large ? 'h-56' : 'h-48'}`}>
            {project.images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={project.images[0]} alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-5xl text-white/8 group-hover:text-white/14 transition-colors font-mono font-bold">{'{}'}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {/* Open indicator */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="glass rounded-lg px-2.5 py-1 text-xs text-accent border border-accent/25 flex items-center gap-1.5" style={{ fontFamily: 'var(--font-syne)' }}>
                View Details <ArrowRight size={11} />
              </div>
            </div>
          </div>

          {/* Card content — title + tech only */}
          <div className="p-5">
            <h3 className="font-bold text-text-primary text-base mb-3 group-hover:text-accent transition-colors" style={{ fontFamily: 'var(--font-syne)' }}>
              {project.title}
            </h3>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {project.techStack.slice(0, 4).map(t => <span key={t} className="tag text-xs">{t}</span>)}
              {project.techStack.length > 4 && <span className="tag text-xs">+{project.techStack.length - 4}</span>}
            </div>
            {/* Links row */}
            <div className="flex items-center gap-4 pt-3 border-t border-white/4">
              {project.githubUrl && (
                <a href={ensureAbsolute(project.githubUrl)} target="_blank" rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="flex items-center gap-1.5 text-text-muted hover:text-accent text-xs transition-colors">
                  <Github size={12} /> Code
                </a>
              )}
              {project.liveUrl && (
                <a href={ensureAbsolute(project.liveUrl)} target="_blank" rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="flex items-center gap-1.5 text-text-muted hover:text-accent text-xs transition-colors">
                  <ExternalLink size={12} /> Live
                </a>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
