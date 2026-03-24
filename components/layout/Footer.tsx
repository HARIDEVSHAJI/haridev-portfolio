'use client'
import Link from 'next/link'
import { Github, Linkedin, Mail } from 'lucide-react'
interface Profile { github: string; linkedin: string; email: string }
export default function Footer({ profile }: { profile: Profile }) {
  return (
    <footer className="border-t border-white/4 py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="gradient-text font-bold text-xl" style={{ fontFamily: 'var(--font-syne)' }}>&lt;/dev&gt;</span>
          <p className="text-text-muted text-xs mt-1">© {new Date().getFullYear()} Haridev Shaji. All rights reserved.</p>
        </div>
        <div className="flex items-center gap-4">
          {profile.github && <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-accent transition-colors"><Github size={17} /></a>}
          {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-accent transition-colors"><Linkedin size={17} /></a>}
          {profile.email && <a href={`mailto:${profile.email}`} className="text-text-muted hover:text-accent transition-colors"><Mail size={17} /></a>}
        </div>
        <p className="text-text-muted text-xs">Next.js · PostgreSQL · Three.js</p>
      </div>
    </footer>
  )
}
