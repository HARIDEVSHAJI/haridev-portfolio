'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Save, Upload, Loader2, ExternalLink } from 'lucide-react'

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{label}</label>
      {hint && <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{hint}</p>}
      {children}
    </div>
  )
}
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} className={`form-input ${props.className ?? ''}`} />
const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...props} className={`form-input resize-none ${props.className ?? ''}`} />

async function uploadFile(file: File, type: string): Promise<string> {
  const fd = new FormData(); fd.append('file', file); fd.append('type', type)
  const res = await fetch('/api/upload', { method: 'POST', body: fd })
  if (!res.ok) throw new Error('Upload failed')
  return (await res.json()).url
}

interface Profile {
  bio: string; currently: string
  statYears: string; statProjects: string; statSpec: string; statUni: string
}
interface Experience { id: string; role: string; company: string; duration: string; description: string; order: number }
interface Patent { id: string; title: string; number: string; description: string; filedDate: string; status: string; pdfUrl?: string | null; order: number }
interface Training { id: string; title: string; provider: string; duration: string; description: string; order: number }

interface Props {
  profile: Profile | null
  experiences: Experience[]
  patents: Patent[]
  trainings: Training[]
  onSaveProfile: (p: Partial<Profile>) => Promise<void>
  onRefreshExp: () => void
  onRefreshPatent: () => void
  onRefreshTraining: () => void
  show: (msg: string, type?: 'success' | 'error') => void
}

export default function AboutMeTab({ profile, experiences, patents, trainings, onSaveProfile, onRefreshExp, onRefreshPatent, onRefreshTraining, show }: Props) {
  const [bioForm, setBioForm] = useState({
    bio: profile?.bio || '',
    currently: profile?.currently || '',
    statYears: profile?.statYears || '2+',
    statProjects: profile?.statProjects || '10+',
    statSpec: profile?.statSpec || 'AI/ML',
    statUni: profile?.statUni || 'LPU',
  })
  const [saving, setSaving] = useState(false)

  const saveProfile = async () => {
    setSaving(true)
    await onSaveProfile(bioForm)
    setSaving(false)
  }

  return (
    <div className="space-y-8">
      {/* Bio & Stats */}
      <div className="glass rounded-2xl p-6 border border-white/5 space-y-5">
        <h3 className="font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Bio & Stats</h3>
        <Field label="Bio (About Me section)">
          <Textarea value={bioForm.bio} onChange={e => setBioForm({ ...bioForm, bio: e.target.value })} rows={4} placeholder="Tell your story..." />
        </Field>
        <Field label="Currently (green box text)">
          <Textarea value={bioForm.currently} onChange={e => setBioForm({ ...bioForm, currently: e.target.value })} rows={3} placeholder="What are you doing right now..." />
        </Field>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Field label="Years Coding stat"><Input value={bioForm.statYears} onChange={e => setBioForm({ ...bioForm, statYears: e.target.value })} placeholder="2+" /></Field>
          <Field label="Projects stat"><Input value={bioForm.statProjects} onChange={e => setBioForm({ ...bioForm, statProjects: e.target.value })} placeholder="10+" /></Field>
          <Field label="Specialization stat"><Input value={bioForm.statSpec} onChange={e => setBioForm({ ...bioForm, statSpec: e.target.value })} placeholder="AI/ML" /></Field>
          <Field label="University stat"><Input value={bioForm.statUni} onChange={e => setBioForm({ ...bioForm, statUni: e.target.value })} placeholder="LPU" /></Field>
        </div>
        <div className="flex justify-end">
          <button onClick={saveProfile} disabled={saving} className="btn-primary flex items-center gap-2 py-2 px-5 text-sm">
            {saving ? <><Loader2 size={14} className="animate-spin" />Saving...</> : <><Save size={14} />Save Bio & Stats</>}
          </button>
        </div>
      </div>

      {/* Experience */}
      <ExperienceSection data={experiences} refresh={onRefreshExp} show={show} />

      {/* Patents */}
      <PatentsSection data={patents} refresh={onRefreshPatent} show={show} />

      {/* Training */}
      <TrainingSection data={trainings} refresh={onRefreshTraining} show={show} />
    </div>
  )
}

function ExperienceSection({ data, refresh, show }: { data: Experience[]; refresh: () => void; show: (m: string, t?: 'success' | 'error') => void }) {
  const blank = { role: '', company: '', duration: '', description: '', order: data.length }
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState(blank)
  const [loading, setLoading] = useState(false)

  const add = async () => {
    setLoading(true)
    const res = await fetch('/api/experience', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) { show('Experience added!'); setAdding(false); setForm(blank); refresh() } else show('Failed', 'error')
    setLoading(false)
  }
  const del = async (id: string) => {
    if (!confirm('Delete?')) return
    await fetch('/api/experience', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    show('Deleted'); refresh()
  }

  return (
    <div className="glass rounded-2xl p-6 border border-white/5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Experience</h3>
        <button onClick={() => setAdding(!adding)} className="btn-primary flex items-center gap-2 py-2 px-4 text-sm"><Plus size={14} />Add</button>
      </div>
      <AnimatePresence>
        {adding && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="border border-accent/20 rounded-xl p-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Role / Title"><Input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="ML Engineer Intern" /></Field>
                <Field label="Company / Organisation"><Input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="XYZ Corp" /></Field>
                <Field label="Duration"><Input value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="Jun 2024 – Aug 2024" /></Field>
              </div>
              <Field label="Description"><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} /></Field>
              <div className="flex gap-3">
                <button onClick={add} disabled={loading} className="btn-primary flex items-center gap-2 py-2 px-4 text-sm">{loading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}Add</button>
                <button onClick={() => setAdding(false)} className="btn-outline py-2 px-4 text-sm">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="space-y-3">
        {data.map(exp => (
          <div key={exp.id} className="glass rounded-xl p-4 border border-white/5 flex items-start gap-4">
            <div className="flex-1">
              <p className="font-semibold text-sm" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{exp.role}</p>
              <p className="text-xs" style={{ color: 'var(--accent)' }}>{exp.company} · {exp.duration}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{exp.description}</p>
            </div>
            <button onClick={() => del(exp.id)} className="flex-shrink-0 p-2 rounded-lg border border-red-500/25 text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={13} /></button>
          </div>
        ))}
        {data.length === 0 && <p className="text-sm text-center py-4" style={{ color: 'var(--text-muted)' }}>No experience entries yet.</p>}
      </div>
    </div>
  )
}

function PatentsSection({ data, refresh, show }: { data: Patent[]; refresh: () => void; show: (m: string, t?: 'success' | 'error') => void }) {
  const blank = { title: '', number: '', description: '', filedDate: '', status: 'Published', pdfUrl: null as null | string, order: data.length }
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState(blank)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handlePDF = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    try { const url = await uploadFile(file, 'cv'); setForm(f => ({ ...f, pdfUrl: url })); show('PDF uploaded!') }
    catch { show('Upload failed', 'error') }
    setUploading(false)
  }

  const add = async () => {
    if (!form.title) return
    setLoading(true)
    const res = await fetch('/api/patents', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) { show('Patent added!'); setAdding(false); setForm(blank); refresh() } else show('Failed', 'error')
    setLoading(false)
  }
  const del = async (id: string) => {
    if (!confirm('Delete?')) return
    await fetch('/api/patents', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    show('Deleted'); refresh()
  }

  return (
    <div className="glass rounded-2xl p-6 border border-white/5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Patents & Publications <span className="text-xs font-normal ml-2" style={{ color: 'var(--text-muted)' }}>(optional)</span></h3>
        <button onClick={() => setAdding(!adding)} className="btn-primary flex items-center gap-2 py-2 px-4 text-sm"><Plus size={14} />Add Patent</button>
      </div>
      <AnimatePresence>
        {adding && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="border border-accent/20 rounded-xl p-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Patent Title"><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="ML-based Fraud Detection" /></Field>
                <Field label="Patent Number (optional)"><Input value={form.number} onChange={e => setForm({ ...form, number: e.target.value })} placeholder="IN202311012345" /></Field>
                <Field label="Filed Date"><Input value={form.filedDate} onChange={e => setForm({ ...form, filedDate: e.target.value })} placeholder="Jan 2024" /></Field>
                <Field label="Status">
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="form-input">
                    {['Published', 'Filed', 'Granted', 'Pending'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="Description"><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} /></Field>
              <Field label="Patent PDF (optional)">
                <label className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 hover:border-accent/30 cursor-pointer text-sm w-fit" style={{ color: 'var(--text-secondary)' }}>
                  <Upload size={14} />{uploading ? 'Uploading...' : form.pdfUrl ? 'Re-upload PDF' : 'Upload PDF'}
                  <input type="file" accept="application/pdf" onChange={handlePDF} className="hidden" />
                </label>
                {form.pdfUrl && <a href={form.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-xs mt-1 flex items-center gap-1" style={{ color: 'var(--accent)' }}><ExternalLink size={10} />View PDF</a>}
              </Field>
              <div className="flex gap-3">
                <button onClick={add} disabled={loading} className="btn-primary flex items-center gap-2 py-2 px-4 text-sm">{loading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}Add</button>
                <button onClick={() => setAdding(false)} className="btn-outline py-2 px-4 text-sm">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="space-y-3">
        {data.map(p => (
          <div key={p.id} className="glass rounded-xl p-4 border border-white/5 flex items-start gap-4">
            <div className="flex-1">
              <p className="font-semibold text-sm" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{p.title}</p>
              <div className="flex gap-3 text-xs mt-0.5">
                {p.number && <span style={{ color: 'var(--gold)', fontFamily: 'var(--font-mono)' }}>#{p.number}</span>}
                <span style={{ color: 'var(--text-muted)' }}>{p.status}</span>
                {p.filedDate && <span style={{ color: 'var(--text-muted)' }}>{p.filedDate}</span>}
              </div>
            </div>
            <button onClick={() => del(p.id)} className="flex-shrink-0 p-2 rounded-lg border border-red-500/25 text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={13} /></button>
          </div>
        ))}
        {data.length === 0 && <p className="text-sm text-center py-4" style={{ color: 'var(--text-muted)' }}>No patents yet. Optional section — only shows if you add one.</p>}
      </div>
    </div>
  )
}

function TrainingSection({ data, refresh, show }: { data: Training[]; refresh: () => void; show: (m: string, t?: 'success' | 'error') => void }) {
  const blank = { title: '', provider: '', duration: '', description: '', order: data.length }
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState(blank)
  const [loading, setLoading] = useState(false)

  const add = async () => {
    setLoading(true)
    const res = await fetch('/api/training', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) { show('Training added!'); setAdding(false); setForm(blank); refresh() } else show('Failed', 'error')
    setLoading(false)
  }
  const del = async (id: string) => {
    if (!confirm('Delete?')) return
    await fetch('/api/training', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    show('Deleted'); refresh()
  }

  return (
    <div className="glass rounded-2xl p-6 border border-white/5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Training & Courses <span className="text-xs font-normal ml-2" style={{ color: 'var(--text-muted)' }}>(optional)</span></h3>
        <button onClick={() => setAdding(!adding)} className="btn-primary flex items-center gap-2 py-2 px-4 text-sm"><Plus size={14} />Add</button>
      </div>
      <AnimatePresence>
        {adding && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="border border-accent/20 rounded-xl p-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Course Title"><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Deep Learning Specialization" /></Field>
                <Field label="Provider / Platform"><Input value={form.provider} onChange={e => setForm({ ...form, provider: e.target.value })} placeholder="Coursera, Udemy, etc." /></Field>
                <Field label="Duration"><Input value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="3 months" /></Field>
              </div>
              <Field label="Description (optional)"><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} /></Field>
              <div className="flex gap-3">
                <button onClick={add} disabled={loading} className="btn-primary flex items-center gap-2 py-2 px-4 text-sm">{loading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}Add</button>
                <button onClick={() => setAdding(false)} className="btn-outline py-2 px-4 text-sm">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {data.map(tr => (
          <div key={tr.id} className="glass rounded-xl p-4 border border-white/5 flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{tr.title}</p>
              <p className="text-xs" style={{ color: '#34d399' }}>{tr.provider}</p>
              {tr.duration && <p className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{tr.duration}</p>}
            </div>
            <button onClick={() => del(tr.id)} className="flex-shrink-0 p-1.5 rounded-lg border border-red-500/25 text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={12} /></button>
          </div>
        ))}
        {data.length === 0 && <div className="col-span-3 text-sm text-center py-4" style={{ color: 'var(--text-muted)' }}>No training yet. Optional — only shows if added.</div>}
      </div>
    </div>
  )
}
