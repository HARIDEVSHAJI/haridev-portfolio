'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Mail, MapPin, Phone, Loader2, CheckCircle } from 'lucide-react'

interface Profile { email: string; location: string; phone?: string; isAvailable: boolean }

export default function ContactSection({ profile }: { profile: Profile }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/messages', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Failed') }
      setSent(true); setForm({ name: '', email: '', message: '' })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <section id="contact" className="section-padding relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-accent/3 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.6 }} className="text-center mb-20">
          <p className="text-accent text-xs font-medium tracking-[0.25em] uppercase mb-4" style={{ fontFamily: 'var(--font-jetbrains)' }}>Let&apos;s connect</p>
          <h2 className="section-title" style={{ fontFamily: 'var(--font-syne)' }}>Get In <span className="gradient-text">Touch</span></h2>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 max-w-5xl mx-auto">
          {/* Left info */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }} className="lg:col-span-2 flex flex-col gap-5">
            <div>
              <h3 className="text-2xl font-bold text-text-primary mb-3" style={{ fontFamily: 'var(--font-syne)' }}>Let&apos;s Talk</h3>
              <p className="text-text-secondary leading-relaxed text-sm">Have a project, question, or just want to say hi? I&apos;m always open to new opportunities and collaborations.</p>
            </div>

            {/* Email — clickable */}
            <a href={`mailto:${profile.email}`}
              className="flex items-center gap-4 glass rounded-xl p-4 border border-white/5 hover:border-accent/25 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                <Mail size={17} />
              </div>
              <div>
                <p className="text-text-muted text-xs mb-0.5">Email</p>
                <p className="text-accent text-sm font-medium hover:underline" style={{ fontFamily: 'var(--font-jetbrains)' }}>{profile.email}</p>
              </div>
            </a>

            {/* Phone — clickable tel: link */}
            {profile.phone && (
              <a href={`tel:${profile.phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-4 glass rounded-xl p-4 border border-white/5 hover:border-accent/25 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                  <Phone size={17} />
                </div>
                <div>
                  <p className="text-text-muted text-xs mb-0.5">Phone</p>
                  <p className="text-accent text-sm font-medium hover:underline" style={{ fontFamily: 'var(--font-jetbrains)' }}>{profile.phone}</p>
                </div>
              </a>
            )}

            {/* Location */}
            <div className="flex items-center gap-4 glass rounded-xl p-4 border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                <MapPin size={17} />
              </div>
              <div>
                <p className="text-text-muted text-xs mb-0.5">Location</p>
                <p className="text-text-primary text-sm font-medium">{profile.location}</p>
              </div>
            </div>

            {/* Availability */}
            {profile.isAvailable ? (
              <div className="glass rounded-xl p-4 border border-emerald-500/15 bg-emerald-500/3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 text-sm font-semibold" style={{ fontFamily: 'var(--font-syne)' }}>Available for Opportunities</span>
                </div>
                <p className="text-text-muted text-xs">Open to internships, freelance projects, and collaborations.</p>
              </div>
            ) : (
              <div className="glass rounded-xl p-4 border border-amber-500/15 bg-amber-500/3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-amber-400 text-sm font-semibold" style={{ fontFamily: 'var(--font-syne)' }}>Busy for Now</span>
                </div>
                <p className="text-text-muted text-xs">Currently occupied, but I&apos;ll look at your message — feel free to reach out!</p>
              </div>
            )}
          </motion.div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }} className="lg:col-span-3">
            <div className="glass rounded-2xl p-7 border border-white/5">
              {sent ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-14">
                  <CheckCircle size={48} className="text-emerald-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-text-primary mb-2" style={{ fontFamily: 'var(--font-syne)' }}>Message Sent!</h3>
                  <p className="text-text-secondary mb-6 text-sm">Thanks for reaching out. I&apos;ll get back to you soon.</p>
                  <button onClick={() => setSent(false)} className="btn-outline text-sm">Send Another</button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-text-muted text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ fontFamily: 'var(--font-jetbrains)' }}>Name</label>
                      <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Doe" required className="form-input" />
                    </div>
                    <div>
                      <label className="block text-text-muted text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ fontFamily: 'var(--font-jetbrains)' }}>Email</label>
                      <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" required className="form-input" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-text-muted text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ fontFamily: 'var(--font-jetbrains)' }}>Message</label>
                    <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Tell me about your project or just say hi..." required rows={6} className="form-input resize-none" />
                  </div>
                  {error && <p className="text-red-400 text-sm bg-red-400/8 rounded-lg px-4 py-3 border border-red-400/20">{error}</p>}
                  <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2 py-4">
                    {loading ? <><Loader2 size={17} className="animate-spin" />Sending...</> : <><Send size={17} />Send Message</>}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
