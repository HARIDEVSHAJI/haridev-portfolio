'use client'
// PART 2 — Append these tab components to AdminDashboardClient.tsx
// These are exported so they can be imported in the main file

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Save, Upload, Loader2, Mail, Eye, CheckCircle } from 'lucide-react'

interface Service { id: string; title: string; description: string; iconName: string; order: number }
interface Project {
  id: string; title: string; slug: string; description: string; longDesc: string
  techStack: string[]; images: string[]; githubUrl?: string | null
  liveUrl?: string | null; featured: boolean; order: number
}
interface Certificate {
  id: string; title: string; issuer: string; issueDate: string
  description: string; imageUrl?: string | null; credentialUrl?: string | null; order: number
}
interface Achievement { id: string; title: string; description: string; iconName: string; date: string; order: number }
interface Message { id: string; name: string; email: string; message: string; isRead: boolean; createdAt: string }

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-text-muted text-xs font-medium uppercase tracking-wider mb-2" style={{ fontFamily: 'var(--font-jetbrains)' }}>{label}</label>
      {children}
    </div>
  )
}
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`form-input ${props.className ?? ''}`} />
}
function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`form-input resize-none ${props.className ?? ''}`} />
}
function DeleteBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs transition-all">
      <Trash2 size={13} /> Delete
    </button>
  )
}

async function uploadFile(file: File, type: string): Promise<string> {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('type', type)
  const res = await fetch('/api/upload', { method: 'POST', body: fd })
  if (!res.ok) throw new Error('Upload failed')
  const { url } = await res.json()
  return url
}

// ─── Services Tab ─────────────────────────────────────────────────────────────
export function ServicesTab({ data, refresh, show }: { data: Service[]; refresh: () => void; show: (m: string, t?: 'success' | 'error') => void }) {
  const iconOptions = ['server', 'brain', 'layers', 'code', 'globe', 'shield', 'cpu', 'database']
  const blank = (): Omit<Service, 'id'> => ({ title: '', description: '', iconName: 'code', order: data.length })
  const [form, setForm] = useState(blank())
  const [adding, setAdding] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Service | null>(null)
  const [loading, setLoading] = useState(false)

  const add = async () => {
    setLoading(true)
    const res = await fetch('/api/services', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) { show('Service added!'); setAdding(false); setForm(blank()); refresh() }
    else show('Failed', 'error')
    setLoading(false)
  }

  const update = async () => {
    if (!editForm) return
    setLoading(true)
    const res = await fetch('/api/services', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editForm) })
    if (res.ok) { show('Updated!'); setEditId(null); refresh() }
    else show('Failed', 'error')
    setLoading(false)
  }

  const del = async (id: string) => {
    if (!confirm('Delete this service?')) return
    await fetch('/api/services', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    show('Deleted'); refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-text-secondary text-sm">{data.length} services</p>
        <button onClick={() => setAdding(!adding)} className="btn-primary flex items-center gap-2 py-2 px-4 text-sm">
          <Plus size={15} /> Add Service
        </button>
      </div>

      <AnimatePresence>
        {adding && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="glass rounded-2xl p-6 border border-accent/20 space-y-4">
            <Field label="Title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Full Stack Development" /></Field>
            <Field label="Description"><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></Field>
            <Field label="Icon">
              <select value={form.iconName} onChange={(e) => setForm({ ...form, iconName: e.target.value })} className="form-input">
                {iconOptions.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </Field>
            <div className="flex gap-3">
              <button onClick={add} disabled={loading} className="btn-primary flex items-center gap-2 py-2 px-4 text-sm">
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Add
              </button>
              <button onClick={() => setAdding(false)} className="btn-outline py-2 px-4 text-sm">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {data.map((svc) => (
          <div key={svc.id} className="glass rounded-2xl p-5 border border-white/5">
            {editId === svc.id && editForm ? (
              <div className="space-y-4">
                <Field label="Title"><Input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} /></Field>
                <Field label="Description"><Textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={3} /></Field>
                <Field label="Icon">
                  <select value={editForm.iconName} onChange={(e) => setEditForm({ ...editForm, iconName: e.target.value })} className="form-input">
                    {iconOptions.map((i) => <option key={i} value={i}>{i}</option>)}
                  </select>
                </Field>
                <div className="flex gap-3">
                  <button onClick={update} disabled={loading} className="btn-primary flex items-center gap-2 py-2 px-4 text-sm">
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
                  </button>
                  <button onClick={() => setEditId(null)} className="btn-outline py-2 px-4 text-sm">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-text-primary mb-1" style={{ fontFamily: 'var(--font-syne)' }}>{svc.title}</h3>
                  <p className="text-text-secondary text-sm">{svc.description}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => { setEditId(svc.id); setEditForm(svc) }} className="px-3 py-1.5 rounded-lg border border-white/10 text-text-secondary hover:text-text-primary text-xs">Edit</button>
                  <DeleteBtn onClick={() => del(svc.id)} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Projects Tab ─────────────────────────────────────────────────────────────
export function ProjectsTab({ data, refresh, show }: { data: Project[]; refresh: () => void; show: (m: string, t?: 'success' | 'error') => void }) {
  const blank = (): Omit<Project, 'id' | 'slug'> => ({
    title: '', description: '', longDesc: '', techStack: [], images: [],
    githubUrl: '', liveUrl: '', featured: false, order: data.length
  })
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState<Omit<Project, 'id' | 'slug'>>(blank())
  const [techInput, setTechInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [expandId, setExpandId] = useState<string | null>(null)

  const addTech = () => {
    if (!techInput.trim()) return
    setForm((f) => ({ ...f, techStack: [...f.techStack, techInput.trim()] }))
    setTechInput('')
  }

  const addProject = async () => {
    if (!form.title) return
    setLoading(true)
    const res = await fetch('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) { show('Project added!'); setAdding(false); setForm(blank()); refresh() }
    else show('Failed', 'error')
    setLoading(false)
  }

  const del = async (id: string) => {
    if (!confirm('Delete this project?')) return
    await fetch('/api/projects', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    show('Deleted'); refresh()
  }

  const toggleFeatured = async (project: Project) => {
    await fetch('/api/projects', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...project, featured: !project.featured })
    })
    show(`${project.featured ? 'Removed from' : 'Added to'} featured`); refresh()
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadFile(file, 'image')
      setForm((f) => ({ ...f, images: [...f.images, url] }))
      show('Image uploaded!')
    } catch { show('Upload failed', 'error') }
    setUploading(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-text-secondary text-sm">{data.length} projects</p>
        <button onClick={() => setAdding(!adding)} className="btn-primary flex items-center gap-2 py-2 px-4 text-sm">
          <Plus size={15} /> Add Project
        </button>
      </div>

      <AnimatePresence>
        {adding && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="glass rounded-2xl p-6 border border-accent/20 space-y-4 overflow-hidden">
            <h3 className="font-bold text-text-primary" style={{ fontFamily: 'var(--font-syne)' }}>New Project</h3>
            <Field label="Title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="My Awesome Project" /></Field>
            <Field label="Short Description"><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief one-liner..." /></Field>
            <Field label="Full Description"><Textarea value={form.longDesc} onChange={(e) => setForm({ ...form, longDesc: e.target.value })} rows={5} placeholder="Detailed project description..." /></Field>

            <Field label="Tech Stack">
              <div className="flex gap-2 mb-2">
                <Input value={techInput} onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                  placeholder="React, Python, etc." className="flex-1" />
                <button onClick={addTech} className="btn-outline px-4 py-2 text-sm">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.techStack.map((t) => (
                  <span key={t} className="tag cursor-pointer" onClick={() => setForm((f) => ({ ...f, techStack: f.techStack.filter((x) => x !== t) }))}>
                    {t} ×
                  </span>
                ))}
              </div>
            </Field>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="GitHub URL (optional)"><Input value={form.githubUrl ?? ''} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} placeholder="https://github.com/..." /></Field>
              <Field label="Live URL (optional)"><Input value={form.liveUrl ?? ''} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} placeholder="https://myproject.com" /></Field>
            </div>

            <Field label="Project Images">
              <label className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 hover:border-accent/30 text-text-secondary hover:text-accent cursor-pointer transition-all text-sm w-fit">
                <Upload size={15} />
                {uploading ? 'Uploading...' : 'Upload Image'}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              <div className="flex gap-2 mt-2 flex-wrap">
                {form.images.map((img, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <div key={i} className="relative">
                    <img src={img} alt="" className="w-16 h-12 rounded-lg object-cover border border-white/10" />
                    <button onClick={() => setForm((f) => ({ ...f, images: f.images.filter((_, j) => j !== i) }))}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">×</button>
                  </div>
                ))}
              </div>
            </Field>

            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-accent w-4 h-4" />
              <span className="text-text-secondary text-sm">Mark as Featured</span>
            </label>

            <div className="flex gap-3">
              <button onClick={addProject} disabled={loading} className="btn-primary flex items-center gap-2 py-2 px-4 text-sm">
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Create Project
              </button>
              <button onClick={() => setAdding(false)} className="btn-outline py-2 px-4 text-sm">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {data.map((project) => (
          <div key={project.id} className="glass rounded-2xl border border-white/5 overflow-hidden">
            <div className="flex items-center gap-4 p-5">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-text-primary text-sm" style={{ fontFamily: 'var(--font-syne)' }}>{project.title}</h3>
                  {project.featured && <span className="tag text-xs bg-accent/10 border-accent/30 text-accent">Featured</span>}
                </div>
                <p className="text-text-muted text-xs truncate">{project.description}</p>
                <div className="flex gap-2 mt-2">
                  {project.techStack.slice(0, 3).map((t) => <span key={t} className="tag text-xs">{t}</span>)}
                  {project.techStack.length > 3 && <span className="tag text-xs">+{project.techStack.length - 3}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => toggleFeatured(project)} className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${project.featured ? 'border-accent/30 text-accent' : 'border-white/10 text-text-muted hover:text-text-primary'}`}>
                  {project.featured ? '★ Featured' : '☆ Feature'}
                </button>
                <button onClick={() => setExpandId(expandId === project.id ? null : project.id)} className="px-3 py-1.5 rounded-lg border border-white/10 text-text-secondary hover:text-text-primary text-xs">
                  {expandId === project.id ? 'Close' : 'Edit'}
                </button>
                <DeleteBtn onClick={() => del(project.id)} />
              </div>
            </div>

            <AnimatePresence>
              {expandId === project.id && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t border-white/5">
                  <ProjectEditForm project={project} onSave={async (updated) => {
                    const res = await fetch('/api/projects', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) })
                    if (res.ok) { show('Project updated!'); setExpandId(null); refresh() }
                    else show('Failed', 'error')
                  }} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProjectEditForm({ project, onSave }: { project: Project; onSave: (p: Project) => Promise<void> }) {
  const [form, setForm] = useState(project)
  const [techInput, setTechInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleSave = async () => { setLoading(true); await onSave(form); setLoading(false) }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadFile(file, 'image')
      setForm((f) => ({ ...f, images: [...f.images, url] }))
    } finally { setUploading(false) }
  }

  return (
    <div className="p-5 space-y-4 bg-surface/50">
      <Field label="Short Description"><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
      <Field label="Full Description"><Textarea value={form.longDesc} onChange={(e) => setForm({ ...form, longDesc: e.target.value })} rows={4} /></Field>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="GitHub URL"><Input value={form.githubUrl ?? ''} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} /></Field>
        <Field label="Live URL"><Input value={form.liveUrl ?? ''} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} /></Field>
      </div>
      <Field label="Add Tech">
        <div className="flex gap-2 mb-2">
          <Input value={techInput} onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); setForm((f) => ({ ...f, techStack: [...f.techStack, techInput.trim()] })); setTechInput('') } }}
            placeholder="Add technology..." />
        </div>
        <div className="flex flex-wrap gap-2">
          {form.techStack.map((t) => (
            <span key={t} className="tag cursor-pointer" onClick={() => setForm((f) => ({ ...f, techStack: f.techStack.filter((x) => x !== t) }))}>{t} ×</span>
          ))}
        </div>
      </Field>
      <Field label="Images">
        <label className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 hover:border-accent/30 text-text-secondary hover:text-accent cursor-pointer text-sm w-fit">
          <Upload size={14} /> {uploading ? 'Uploading...' : 'Add Image'}
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </label>
        <div className="flex gap-2 mt-2 flex-wrap">
          {form.images.map((img, i) => (
            <div key={i} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="" className="w-16 h-12 rounded-lg object-cover border border-white/10" />
              <button onClick={() => setForm((f) => ({ ...f, images: f.images.filter((_, j) => j !== i) }))}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">×</button>
            </div>
          ))}
        </div>
      </Field>
      <button onClick={handleSave} disabled={loading} className="btn-primary flex items-center gap-2 py-2 px-4 text-sm">
        {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
      </button>
    </div>
  )
}

// ─── Certificates Tab ─────────────────────────────────────────────────────────
export function CertificatesTab({ data, refresh, show }: { data: Certificate[]; refresh: () => void; show: (m: string, t?: 'success' | 'error') => void }) {
  const blank = (): Omit<Certificate, 'id'> => ({ title: '', issuer: '', issueDate: '', description: '', imageUrl: null, credentialUrl: null, order: data.length })
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState(blank())
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleImgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    try { const url = await uploadFile(file, 'certificate'); setForm((f) => ({ ...f, imageUrl: url })); show('Image uploaded!') }
    catch { show('Upload failed', 'error') }
    setUploading(false)
  }

  const add = async () => {
    setLoading(true)
    const res = await fetch('/api/certificates', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) { show('Certificate added!'); setAdding(false); setForm(blank()); refresh() }
    else show('Failed', 'error')
    setLoading(false)
  }

  const del = async (id: string) => {
    if (!confirm('Delete?')) return
    await fetch('/api/certificates', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    show('Deleted'); refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-text-secondary text-sm">{data.length} certificates</p>
        <button onClick={() => setAdding(!adding)} className="btn-primary flex items-center gap-2 py-2 px-4 text-sm"><Plus size={15} /> Add Certificate</button>
      </div>

      <AnimatePresence>
        {adding && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="glass rounded-2xl p-6 border border-accent/20 space-y-4 overflow-hidden">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Certificate Title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
              <Field label="Issuer"><Input value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} placeholder="Coursera, AWS, etc." /></Field>
              <Field label="Issue Date"><Input value={form.issueDate} onChange={(e) => setForm({ ...form, issueDate: e.target.value })} placeholder="Jan 2024" /></Field>
              <Field label="Credential URL (optional)"><Input value={form.credentialUrl ?? ''} onChange={(e) => setForm({ ...form, credentialUrl: e.target.value })} /></Field>
            </div>
            <Field label="Description"><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></Field>
            <Field label="Certificate Image">
              <label className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 hover:border-accent/30 text-text-secondary hover:text-accent cursor-pointer text-sm w-fit">
                <Upload size={15} /> {uploading ? 'Uploading...' : 'Upload Image'}
                <input type="file" accept="image/*" onChange={handleImgUpload} className="hidden" />
              </label>
              {form.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.imageUrl} alt="" className="w-32 h-24 object-cover rounded-xl mt-2 border border-white/10" />
              )}
            </Field>
            <div className="flex gap-3">
              <button onClick={add} disabled={loading} className="btn-primary flex items-center gap-2 py-2 px-4 text-sm">
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Add
              </button>
              <button onClick={() => setAdding(false)} className="btn-outline py-2 px-4 text-sm">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((cert) => (
          <div key={cert.id} className="glass rounded-2xl border border-white/5 overflow-hidden group">
            <div className="h-36 bg-surface-2 flex items-center justify-center overflow-hidden">
              {cert.imageUrl
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={cert.imageUrl} alt={cert.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                : <div className="text-4xl opacity-20">🏆</div>}
            </div>
            <div className="p-4">
              <p className="font-semibold text-text-primary text-sm mb-1" style={{ fontFamily: 'var(--font-syne)' }}>{cert.title}</p>
              <p className="text-text-muted text-xs mb-3">{cert.issuer} · {cert.issueDate}</p>
              <DeleteBtn onClick={() => del(cert.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Achievements Tab ─────────────────────────────────────────────────────────
export function AchievementsTab({ data, refresh, show }: { data: Achievement[]; refresh: () => void; show: (m: string, t?: 'success' | 'error') => void }) {
  const icons = ['trophy', 'star', 'award', 'cloud', 'zap', 'target', 'medal', 'flame']
  const blank = (): Omit<Achievement, 'id'> => ({ title: '', description: '', iconName: 'trophy', date: '', order: data.length })
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState(blank())
  const [loading, setLoading] = useState(false)

  const add = async () => {
    setLoading(true)
    const res = await fetch('/api/achievements', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) { show('Achievement added!'); setAdding(false); setForm(blank()); refresh() }
    else show('Failed', 'error')
    setLoading(false)
  }

  const del = async (id: string) => {
    if (!confirm('Delete?')) return
    await fetch('/api/achievements', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    show('Deleted'); refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-text-secondary text-sm">{data.length} achievements</p>
        <button onClick={() => setAdding(!adding)} className="btn-primary flex items-center gap-2 py-2 px-4 text-sm"><Plus size={15} /> Add Achievement</button>
      </div>

      <AnimatePresence>
        {adding && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="glass rounded-2xl p-6 border border-accent/20 space-y-4 overflow-hidden">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Hackathon Winner" /></Field>
              <Field label="Date"><Input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="2024" /></Field>
              <Field label="Icon">
                <select value={form.iconName} onChange={(e) => setForm({ ...form, iconName: e.target.value })} className="form-input">
                  {icons.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Description"><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></Field>
            <div className="flex gap-3">
              <button onClick={add} disabled={loading} className="btn-primary flex items-center gap-2 py-2 px-4 text-sm">
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Add
              </button>
              <button onClick={() => setAdding(false)} className="btn-outline py-2 px-4 text-sm">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {data.map((ach) => (
          <div key={ach.id} className="glass rounded-2xl p-5 border border-white/5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 text-accent text-xl">🏆</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-text-primary text-sm" style={{ fontFamily: 'var(--font-syne)' }}>{ach.title}</h3>
                {ach.date && <span className="text-text-muted text-xs">· {ach.date}</span>}
              </div>
              <p className="text-text-secondary text-sm">{ach.description}</p>
            </div>
            <DeleteBtn onClick={() => del(ach.id)} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Messages Tab ─────────────────────────────────────────────────────────────
export function MessagesTab({ data, refresh, show }: { data: Message[]; refresh: () => void; show: (m: string, t?: 'success' | 'error') => void }) {
  const [expanded, setExpanded] = useState<string | null>(null)

  const markRead = async (msg: Message) => {
    await fetch('/api/messages', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: msg.id, isRead: true }) })
    refresh()
  }

  const del = async (id: string) => {
    if (!confirm('Delete this message?')) return
    await fetch('/api/messages', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    show('Deleted'); refresh()
  }

  const unread = data.filter((m) => !m.isRead).length

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <p className="text-text-secondary text-sm">{data.length} total</p>
        {unread > 0 && <span className="tag text-accent">{unread} unread</span>}
      </div>

      {data.length === 0 && (
        <div className="text-center py-20 text-text-muted">
          <Mail size={40} className="mx-auto mb-3 opacity-30" />
          <p>No messages yet</p>
        </div>
      )}

      <div className="space-y-3">
        {data.map((msg) => (
          <motion.div key={msg.id} layout className={`glass rounded-2xl border transition-all duration-200 overflow-hidden ${!msg.isRead ? 'border-accent/20' : 'border-white/5'}`}>
            <div className="flex items-center gap-4 p-5 cursor-pointer" onClick={() => { setExpanded(expanded === msg.id ? null : msg.id); if (!msg.isRead) markRead(msg) }}>
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${!msg.isRead ? 'bg-accent animate-pulse' : 'bg-white/20'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-semibold text-text-primary text-sm" style={{ fontFamily: 'var(--font-syne)' }}>{msg.name}</p>
                  {!msg.isRead && <span className="tag text-xs text-accent">New</span>}
                </div>
                <p className="text-text-muted text-xs truncate">{msg.message}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-text-muted text-xs">{new Date(msg.createdAt).toLocaleDateString()}</p>
                <a href={`mailto:${msg.email}`} onClick={(e) => e.stopPropagation()} className="text-accent text-xs hover:underline">{msg.email}</a>
              </div>
            </div>

            <AnimatePresence>
              {expanded === msg.id && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t border-white/5">
                  <div className="p-5 bg-surface/50">
                    <p className="text-text-secondary leading-relaxed mb-4 whitespace-pre-wrap">{msg.message}</p>
                    <div className="flex gap-3">
                      <a href={`mailto:${msg.email}?subject=Re%3A%20Your%20message%20on%20portfolio`} target="_blank" rel="noopener noreferrer" className="btn-primary flex items-center gap-2 py-2 px-4 text-sm">
                        <Mail size={14} /> Reply via Email
                      </a>
                      <DeleteBtn onClick={() => del(msg.id)} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
