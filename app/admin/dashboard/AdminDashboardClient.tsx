'use client'

import React, { useState, useCallback } from 'react'
import { signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Code, Briefcase, FolderOpen, Award, Trophy, MessageSquare, LogOut, Save, Plus, Trash2, Upload, Loader2, CheckCircle, Home, ShieldCheck, Info, Newspaper } from 'lucide-react'
import Link from 'next/link'
import { ServicesTab, ProjectsTab, CertificatesTab, AchievementsTab, MessagesTab } from './AdminTabComponents'
import AboutMeTab from './AboutMeTab'
import ArticlesTab from './ArticlesTab'

interface Profile { id?: string; tagline: string; bio: string; github: string; linkedin: string; twitter: string; instagram: string; email: string; phone: string; location: string; cvUrl?: string | null; avatarUrl?: string | null; isAvailable: boolean; typingTexts: string[]; currently: string; statYears: string; statProjects: string; statSpec: string; statUni: string }
interface Skill { id: string; name: string; category: string; iconName: string; level: number; order: number }
interface Service { id: string; title: string; description: string; iconName: string; order: number }
interface Project { id: string; title: string; slug: string; description: string; longDesc: string; techStack: string[]; images: string[]; githubUrl?: string | null; liveUrl?: string | null; featured: boolean; order: number }
interface Certificate { id: string; title: string; issuer: string; issueDate: string; description: string; imageUrl?: string | null; credentialUrl?: string | null; order: number }
interface Achievement { id: string; title: string; description: string; iconName: string; date: string; order: number }
interface Message { id: string; name: string; email: string; message: string; isRead: boolean; createdAt: string }
interface Experience { id: string; role: string; company: string; duration: string; description: string; order: number }
interface Patent { id: string; title: string; number: string; description: string; filedDate: string; status: string; pdfUrl?: string | null; order: number }
interface Training { id: string; title: string; provider: string; duration: string; description: string; order: number }
interface Article { id: string; title: string; description: string; url: string; platform: string; publishedAt: string; imageUrl?: string | null; order: number }

interface InitialData { profile: Profile | null; skills: Skill[]; services: Service[]; projects: Project[]; certificates: Certificate[]; achievements: Achievement[]; messages: Message[]; experiences: Experience[]; patents: Patent[]; trainings: Training[]; articles: Article[] }

const NAV = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'aboutme', label: 'About Me', icon: Info },
  { key: 'skills', label: 'Skills', icon: Code },
  { key: 'services', label: 'Services', icon: Briefcase },
  { key: 'projects', label: 'Projects', icon: FolderOpen },
  { key: 'certificates', label: 'Certificates', icon: Award },
  { key: 'achievements', label: 'Achievements', icon: Trophy },
  { key: 'articles', label: 'Articles', icon: Newspaper },
  { key: 'messages', label: 'Messages', icon: MessageSquare },
]

function useToast() {
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const show = (msg: string, type: 'success' | 'error' = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3200) }
  return { toast, show }
}

async function uploadFile(file: File, type: string): Promise<string> {
  const fd = new FormData(); fd.append('file', file); fd.append('type', type)
  const res = await fetch('/api/upload', { method: 'POST', body: fd })
  if (!res.ok) throw new Error('Upload failed')
  return (await res.json()).url
}

function DbStatusBadge() {
  const [status, setStatus] = React.useState<{ database: boolean; storage: boolean; dbLatency: number; storageConfigured: boolean; errors: string[] } | null>(null)
  const [loading, setLoading] = React.useState(true)
  React.useEffect(() => { fetch('/api/db-status').then(r => r.json()).then(d => { setStatus(d); setLoading(false) }).catch(() => setLoading(false)) }, [])
  if (loading) return <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass border text-xs" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}><div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />Checking...</div>
  if (!status) return null
  const ok = status.database && status.storage
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs ${ok ? 'text-emerald-400' : 'text-red-400'}`} style={{ background: ok ? 'rgba(52,211,153,0.06)' : 'rgba(248,113,113,0.06)', borderColor: ok ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)' }}>
      <div className={`w-1.5 h-1.5 rounded-full ${ok ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
      <span>DB: {status.database ? `✓ ${status.dbLatency}ms` : '✗'}</span>
      <span style={{ opacity: 0.4 }}>|</span>
      <span>Storage: {status.storageConfigured ? (status.storage ? '✓ Supabase' : '✗') : '✓ Local'}</span>
    </div>
  )
}

export default function AdminDashboardClient({ initialData }: { initialData: InitialData }) {
  const [tab, setTab] = useState('profile')
  const [data, setData] = useState(initialData)
  const { toast, show } = useToast()

  const refresh = useCallback(async (section: string) => {
    try { const res = await fetch(`/api/${section}`); const json = await res.json(); setData(prev => ({ ...prev, [section]: json })) } catch { /* ignore */ }
  }, [])

  const refreshAbout = useCallback(() => {
    refresh('experience')
    refresh('patents')
    refresh('training')
  }, [refresh])

  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ background: 'var(--background)', color: 'var(--text-primary)' }}>
      {/* Sidebar */}
      <aside className="admin-sidebar flex-shrink-0 flex flex-col">
        <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center border" style={{ background: 'rgba(249,115,22,0.1)', borderColor: 'rgba(249,115,22,0.2)', color: 'var(--accent)' }}>
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="font-bold text-sm" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Admin Panel</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Portfolio CMS</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto">
          {NAV.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${tab === key ? 'font-semibold' : ''}`}
              style={{ fontFamily: 'var(--font-display)', background: tab === key ? 'rgba(249,115,22,0.1)' : 'transparent', color: tab === key ? 'var(--accent)' : 'var(--text-secondary)', border: tab === key ? '1px solid rgba(249,115,22,0.2)' : '1px solid transparent' }}>
              <Icon size={17} />
              {label}
              {key === 'messages' && data.messages.filter(m => !m.isRead).length > 0 && (
                <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'var(--accent)', color: '#fff' }}>{data.messages.filter(m => !m.isRead).length}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t space-y-1" style={{ borderColor: 'var(--border)' }}>
          <Link href="/" target="_blank" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-display)' }}>
            <Home size={17} />View Portfolio
          </Link>
          <button onClick={() => signOut({ callbackUrl: '/admin' })} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all text-red-400 hover:bg-red-400/8" style={{ fontFamily: 'var(--font-display)' }}>
            <LogOut size={17} />Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-30 glass-strong border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <h2 className="font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{NAV.find(n => n.key === tab)?.label}</h2>
          <div className="flex items-center gap-3">
            <DbStatusBadge />
            <div className="hidden lg:flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />Logged in as Admin
            </div>
          </div>
        </div>

        <div className="p-6 max-w-5xl">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.22 }}>
              {tab === 'profile' && (
                <ProfileTab profile={data.profile} onSave={async (p) => {
                  const res = await fetch('/api/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) })
                  if (res.ok) { show('Profile saved!'); refresh('profile') } else show('Save failed', 'error')
                }} show={show} />
              )}
              {tab === 'aboutme' && (
                <AboutMeTab
                  profile={data.profile}
                  experiences={data.experiences || []}
                  patents={data.patents || []}
                  trainings={data.trainings || []}
                  onSaveProfile={async (p) => {
                    const res = await fetch('/api/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data.profile, ...p }) })
                    if (res.ok) { show('Saved!'); refresh('profile') } else show('Failed', 'error')
                  }}
                  onRefreshExp={() => refresh('experience')}
                  onRefreshPatent={() => refresh('patents')}
                  onRefreshTraining={() => refresh('training')}
                  show={show}
                />
              )}
              {tab === 'skills' && <SkillsTab data={data.skills} refresh={() => refresh('skills')} show={show} />}
              {tab === 'services' && <ServicesTab data={data.services} refresh={() => refresh('services')} show={show} />}
              {tab === 'projects' && <ProjectsTab data={data.projects} refresh={() => refresh('projects')} show={show} />}
              {tab === 'certificates' && <CertificatesTab data={data.certificates} refresh={() => refresh('certificates')} show={show} />}
              {tab === 'achievements' && <AchievementsTab data={data.achievements} refresh={() => refresh('achievements')} show={show} />}
              {tab === 'articles' && <ArticlesTab data={data.articles || []} refresh={() => refresh('articles')} show={show} />}
              {tab === 'messages' && <MessagesTab data={data.messages} refresh={() => refresh('messages')} show={show} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl border text-sm font-medium"
            style={{ background: toast.type === 'success' ? 'rgba(5,46,22,0.9)' : 'rgba(69,10,10,0.9)', borderColor: toast.type === 'success' ? 'rgba(52,211,153,0.4)' : 'rgba(248,113,113,0.4)', color: toast.type === 'success' ? '#34d399' : '#f87171' }}>
            <CheckCircle size={16} />{toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Profile Tab ───────────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{label}</label>
      {children}
    </div>
  )
}
const Input = (p: React.InputHTMLAttributes<HTMLInputElement>) => <input {...p} className={`form-input ${p.className ?? ''}`} />
const Textarea = (p: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...p} className={`form-input resize-none ${p.className ?? ''}`} />
function SaveBtn({ loading, onClick }: { loading: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} disabled={loading} className="btn-primary flex items-center gap-2">
      {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}Save Changes
    </button>
  )
}

function ProfileTab({ profile, onSave, show }: { profile: Profile | null; onSave: (p: Profile) => Promise<void>; show: (m: string, t?: 'success' | 'error') => void }) {
  const def: Profile = { tagline: '', bio: '', github: '', linkedin: '', twitter: '', instagram: '', email: '', phone: '', location: '', isAvailable: true, cvUrl: null, avatarUrl: null, typingTexts: ['AI Engineer', 'Backend Developer'], currently: '', statYears: '2+', statProjects: '10+', statSpec: 'AI/ML', statUni: 'LPU' }
  const [form, setForm] = useState<Profile>(profile ?? def)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const set = (k: keyof Profile, v: string | boolean | string[]) => setForm(p => ({ ...p, [k]: v }))

  const handleCV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    try { const url = await uploadFile(file, 'cv'); set('cvUrl', url); show('CV uploaded!') } catch { show('Upload failed', 'error') }
    setUploading(false)
  }
  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    try { const url = await uploadFile(file, 'avatar'); set('avatarUrl', url); show('Avatar uploaded!') } catch { show('Upload failed', 'error') }
    setUploading(false)
  }
  const save = async () => { setLoading(true); await onSave(form); setLoading(false) }

  return (
    <div className="space-y-6">
      {/* Media */}
      <div className="glass rounded-2xl p-6 border border-white/5 space-y-5">
        <h3 className="font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Media Files</h3>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <p className="text-xs mb-2" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Profile Avatar</p>
            {form.avatarUrl && <img src={form.avatarUrl} alt="avatar" className="w-20 h-20 rounded-2xl object-cover border mb-3" style={{ borderColor: 'var(--border)' }} />}
            <label className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm w-fit cursor-pointer" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
              <Upload size={14} />{uploading ? 'Uploading...' : 'Upload Avatar'}
              <input type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
            </label>
            <p className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>PNG with transparent/dark bg recommended</p>
          </div>
          <div>
            <p className="text-xs mb-2" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Resume / CV (PDF)</p>
            {form.cvUrl && <a href={form.cvUrl} target="_blank" rel="noopener noreferrer" className="block text-xs mb-3" style={{ color: 'var(--accent)' }}>Current: {form.cvUrl.split('/').pop()}</a>}
            <label className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm w-fit cursor-pointer btn-outline">
              <Upload size={14} />{uploading ? 'Uploading...' : 'Upload CV (PDF)'}
              <input type="file" accept="application/pdf" onChange={handleCV} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="glass rounded-2xl p-6 border border-white/5 space-y-4">
        <h3 className="font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Basic Info</h3>
        <Field label="Tagline (shown on home page)"><Input value={form.tagline} onChange={e => set('tagline', e.target.value)} /></Field>
        <Field label="Typing Texts (one per line — cycles on homepage)">
          <Textarea value={(form.typingTexts || []).join('\n')} onChange={e => set('typingTexts', e.target.value.split('\n').filter(Boolean))} rows={4} placeholder={"AI Engineer\nBackend Developer\nML Enthusiast"} />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Email"><Input type="email" value={form.email} onChange={e => set('email', e.target.value)} /></Field>
          <Field label="Phone (optional, e.g. +91 98765 43210)"><Input value={form.phone} onChange={e => set('phone', e.target.value)} /></Field>
          <Field label="Location"><Input value={form.location} onChange={e => set('location', e.target.value)} /></Field>
        </div>
        <Field label="Availability">
          <div className="flex items-center gap-3 mt-1">
            <button onClick={() => set('isAvailable', !form.isAvailable)} className="relative w-12 h-6 rounded-full transition-colors" style={{ background: form.isAvailable ? 'var(--accent)' : 'rgba(255,255,255,0.15)' }}>
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${form.isAvailable ? 'left-7' : 'left-1'}`} />
            </button>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{form.isAvailable ? 'Available for Opportunities' : 'Currently Busy'}</span>
          </div>
        </Field>
      </div>

      {/* Socials */}
      <div className="glass rounded-2xl p-6 border border-white/5 space-y-4">
        <h3 className="font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Social Links</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="GitHub URL"><Input value={form.github} onChange={e => set('github', e.target.value)} placeholder="https://github.com/..." /></Field>
          <Field label="LinkedIn URL"><Input value={form.linkedin} onChange={e => set('linkedin', e.target.value)} placeholder="https://linkedin.com/in/..." /></Field>
          <Field label="Twitter URL (optional)"><Input value={form.twitter} onChange={e => set('twitter', e.target.value)} /></Field>
          <Field label="Instagram URL (optional)"><Input value={form.instagram} onChange={e => set('instagram', e.target.value)} /></Field>
        </div>
      </div>

      <div className="flex justify-end"><SaveBtn loading={loading} onClick={save} /></div>
    </div>
  )
}

// ── Skills Tab (inline) ───────────────────────────────────────────────────────
function SkillsTab({ data, refresh, show }: { data: Skill[]; refresh: () => void; show: (m: string, t?: 'success' | 'error') => void }) {
  const cats = ['AI / ML', 'Backend', 'Frontend', 'DevOps', 'Tools']
  const blank = { name: '', category: 'AI / ML', iconName: 'code', level: 80, order: data.length }
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState(blank)
  const [loading, setLoading] = useState(false)

  const add = async () => {
    setLoading(true)
    const res = await fetch('/api/skills', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) { show('Skill added!'); setAdding(false); setForm(blank); refresh() } else show('Failed', 'error')
    setLoading(false)
  }
  const del = async (id: string) => {
    if (!confirm('Delete?')) return
    await fetch('/api/skills', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    show('Deleted'); refresh()
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{data.length} skills</p>
        <button onClick={() => setAdding(!adding)} className="btn-primary flex items-center gap-2 py-2 px-4 text-sm"><Plus size={14} />Add Skill</button>
      </div>
      <AnimatePresence>
        {adding && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="glass rounded-2xl p-5 border border-accent/20 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Name"><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Python" /></Field>
                <Field label="Category">
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="form-input">
                    {cats.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Icon (e.g. python, docker)"><Input value={form.iconName} onChange={e => setForm({ ...form, iconName: e.target.value })} /></Field>
                <Field label={`Level: ${form.level}%`}><input type="range" min={10} max={100} value={form.level} onChange={e => setForm({ ...form, level: Number(e.target.value) })} className="w-full accent-orange-500 mt-2" /></Field>
              </div>
              <div className="flex gap-3">
                <button onClick={add} disabled={loading} className="btn-primary flex items-center gap-2 py-2 px-4 text-sm">{loading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}Add</button>
                <button onClick={() => setAdding(false)} className="btn-outline py-2 px-4 text-sm">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {cats.map(cat => {
        const catSkills = data.filter(s => s.category === cat)
        if (!catSkills.length) return null
        return (
          <div key={cat} className="glass rounded-2xl p-5 border border-white/5">
            <p className="font-semibold text-sm mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)' }}>{cat}</p>
            <div className="space-y-3">
              {catSkills.map(skill => (
                <div key={skill.id} className="flex items-center gap-4 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{skill.name}</p>
                    <div className="progress-bar mt-1.5 w-40"><div className="progress-fill" style={{ width: `${skill.level}%` }} /></div>
                  </div>
                  <button onClick={() => del(skill.id)} className="p-1.5 rounded-lg border border-red-500/25 text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={13} /></button>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
