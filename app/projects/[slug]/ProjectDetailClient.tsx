'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Github, ExternalLink, ArrowLeft, ChevronLeft, ChevronRight, Circle } from 'lucide-react'

interface Project {
  id: string; title: string; slug: string; description: string; longDesc: string
  techStack: string[]; images: string[]; githubUrl?: string | null; liveUrl?: string | null; featured: boolean
}

function ensureAbsolute(url: string) {
  if (!url) return url
  return url.startsWith('http') ? url : 'https://' + url
}

export default function ProjectDetailClient({ project }: { project: Project }) {
  const [cur, setCur] = useState(0)
  const [auto, setAuto] = useState(true)
  const imgs = project.images

  const next = useCallback(() => { if (imgs.length > 1) setCur(p => (p + 1) % imgs.length) }, [imgs.length])
  const prev = () => { if (imgs.length > 1) setCur(p => (p - 1 + imgs.length) % imgs.length) }

  useEffect(() => {
    if (!auto || imgs.length <= 1) return
    const t = setInterval(next, 3500)
    return () => clearInterval(t)
  }, [auto, next, imgs.length])

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-10">
          <Link href="/projects" className="inline-flex items-center gap-2 text-text-muted hover:text-accent transition-colors text-sm" style={{ fontFamily: 'var(--font-syne)' }}>
            <ArrowLeft size={15} /> Back to Projects
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-10">
          <h1 className="section-title mb-4" style={{ fontFamily: 'var(--font-syne)' }}>{project.title}</h1>
          <p className="text-text-secondary text-lg max-w-2xl break-anywhere">{project.description}</p>
        </motion.div>

        {/* Image Slider */}
        {imgs.length > 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="relative rounded-2xl overflow-hidden mb-12 glass border border-white/5"
            onMouseEnter={() => setAuto(false)} onMouseLeave={() => setAuto(true)}>
            <div className="relative h-[360px] md:h-[480px] bg-surface-2">
              <AnimatePresence mode="wait">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <motion.img key={cur} src={imgs[cur]} alt={`${project.title} ${cur + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }} />
              </AnimatePresence>
              {imgs.length > 1 && (
                <>
                  <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-white hover:border-accent/40 hover:text-accent z-10"><ChevronLeft size={18} /></button>
                  <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-white hover:border-accent/40 hover:text-accent z-10"><ChevronRight size={18} /></button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                    {imgs.map((_, i) => (
                      <button key={i} onClick={() => setCur(i)}>
                        <Circle size={7} className={`transition-all ${i === cur ? 'text-accent fill-accent scale-125' : 'text-white/30 fill-white/15'}`} />
                      </button>
                    ))}
                  </div>
                  <div className="absolute top-4 right-4 glass rounded-full px-3 py-1 text-xs text-text-secondary z-10">{cur + 1}/{imgs.length}</div>
                </>
              )}
            </div>
            {imgs.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto bg-surface">
                {imgs.map((img, i) => (
                  <button key={i} onClick={() => setCur(i)}
                    className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${i === cur ? 'border-accent opacity-100' : 'border-transparent opacity-40 hover:opacity-65'}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <div className="rounded-2xl border border-white/5 bg-surface h-52 flex items-center justify-center mb-12">
            <p className="text-text-muted">No images uploaded for this project</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-text-primary mb-5" style={{ fontFamily: 'var(--font-syne)' }}>About this Project</h2>
            {/* Fixed: wrap text in a proper prose box */}
            <div className="glass rounded-2xl p-6 border border-white/5">
              {project.longDesc ? (
                <div className="text-text-secondary leading-relaxed space-y-4">
                  {project.longDesc.split('\n').map((p, i) => p.trim() ? (
                    <p key={i} className="break-anywhere">{p}</p>
                  ) : null)}
                </div>
              ) : (
                <p className="text-text-secondary leading-relaxed break-anywhere">{project.description}</p>
              )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="space-y-5">
            <div className="glass rounded-2xl p-6 border border-white/5">
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-4" style={{ fontFamily: 'var(--font-jetbrains)' }}>Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>

            {(project.githubUrl || project.liveUrl) && (
              <div className="glass rounded-2xl p-6 border border-white/5 space-y-3">
                <h3 className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-4" style={{ fontFamily: 'var(--font-jetbrains)' }}>Links</h3>
                {project.githubUrl && (
                  <a href={ensureAbsolute(project.githubUrl)} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full py-3 px-4 rounded-xl border border-white/8 hover:border-accent/30 hover:text-accent text-text-secondary transition-all text-sm font-medium"
                    style={{ fontFamily: 'var(--font-syne)' }}>
                    <Github size={15} /> View Source Code
                  </a>
                )}
                {project.liveUrl && (
                  <a href={ensureAbsolute(project.liveUrl)} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full py-3 px-4 rounded-xl btn-primary text-sm font-medium"
                    style={{ fontFamily: 'var(--font-syne)' }}>
                    <ExternalLink size={15} /> Live Demo
                  </a>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
