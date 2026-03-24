'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Menu, X, FileText } from 'lucide-react'

export default function Navbar({ cvUrl, hasArticles }: { cvUrl?: string | null; hasArticles?: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('home')
  const [mobileOpen, setMobileOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const isHome = pathname === '/'

  const NAV = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Services', href: '#services' },
    { label: 'Achievements', href: '#achievements' },
    { label: 'Projects', href: '/projects' },
    { label: 'Certificates', href: '/certificates' },
    ...(hasArticles ? [{ label: 'Articles', href: '/articles' }] : []),
  ]

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50)
      if (!isHome) return
      const ids = ['contact', 'achievements', 'services', 'skills', 'about', 'home']
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 130) { setActive(id); break }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  const nav = (href: string) => {
    setMobileOpen(false)
    if (href.startsWith('#')) {
      if (isHome) document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' })
      else router.push('/' + href)
    }
  }

  const isActive = (href: string) => href.startsWith('#') ? isHome && active === href.slice(1) : pathname === href

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass-strong border-b py-3' : 'bg-transparent py-4'}`}
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-6">
          <Link href="/" className="flex-shrink-0">
            <span className="font-extrabold text-2xl gradient-text" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.04em' }}>
              &lt;/dev&gt;
            </span>
          </Link>

          <div className="hidden lg:flex flex-1 justify-center">
            <div className="flex items-center gap-0.5 p-1 rounded-xl glass" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
              {NAV.map((link) => {
                const act = isActive(link.href)
                const isPage = !link.href.startsWith('#')
                return (
                  <button key={link.label} onClick={() => nav(link.href)}
                    className={`relative px-3.5 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${act ? 'text-white' : 'hover:text-text-primary'}`}
                    style={{ fontFamily: 'var(--font-display)', color: act ? '#fff' : 'var(--text-secondary)' }}>
                    {act && (
                      <motion.span layoutId="pill" className="absolute inset-0 rounded-lg"
                        style={{ background: 'linear-gradient(135deg,rgba(249,115,22,0.22),rgba(212,168,83,0.12))', border: '1px solid rgba(249,115,22,0.28)' }}
                        transition={{ type: 'spring', stiffness: 400, damping: 35 }} />
                    )}
                    <span className="relative z-10">{isPage ? <Link href={link.href}>{link.label}</Link> : link.label}</span>
                  </button>
                )
              })}
              <button onClick={() => nav('#contact')}
                className="relative ml-1 px-3.5 py-2 text-sm font-semibold rounded-lg border transition-all"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)', borderColor: 'rgba(249,115,22,0.3)' }}>
                {isActive('#contact') && (
                  <motion.span layoutId="pill" className="absolute inset-0 rounded-lg"
                    style={{ background: 'linear-gradient(135deg,rgba(249,115,22,0.22),rgba(212,168,83,0.12))', border: '1px solid rgba(249,115,22,0.28)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }} />
                )}
                <span className="relative z-10">Contact</span>
              </button>
            </div>
          </div>

          <div className="hidden lg:block flex-shrink-0">
            {cvUrl ? (
              <a href={cvUrl} download className="btn-primary flex items-center gap-2 py-2.5 px-5 text-sm"><Download size={14} />Resume</a>
            ) : (
              <button disabled className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg border" style={{ fontFamily: 'var(--font-display)', background: 'rgba(255,255,255,0.03)', color: 'var(--text-muted)', borderColor: 'var(--border)' }}>
                <FileText size={14} />Resume
              </button>
            )}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden ml-auto p-2 rounded-lg glass" style={{ color: 'var(--text-secondary)' }}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 nav-overlay flex flex-col pt-20 px-6 overflow-y-auto">
            <nav className="flex flex-col gap-1">
              {[...NAV, { label: 'Contact', href: '#contact' }].map((link, i) => (
                <motion.button key={link.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                  onClick={() => nav(link.href)}
                  className={`text-left px-4 py-4 text-xl font-semibold border-b transition-colors ${isActive(link.href) ? 'text-accent' : ''}`}
                  style={{ fontFamily: 'var(--font-display)', color: isActive(link.href) ? 'var(--accent)' : 'var(--text-secondary)', borderColor: 'rgba(255,255,255,0.05)' }}>
                  {link.href.startsWith('#') ? link.label : <Link href={link.href}>{link.label}</Link>}
                </motion.button>
              ))}
              {cvUrl && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="pt-5">
                  <a href={cvUrl} download className="flex items-center justify-center gap-2 py-4 rounded-xl btn-primary text-lg font-semibold"><Download size={18} />Download Resume</a>
                </motion.div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
