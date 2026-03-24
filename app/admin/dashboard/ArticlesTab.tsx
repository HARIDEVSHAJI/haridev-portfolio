'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Loader2, Upload } from 'lucide-react'

interface Article { id: string; title: string; description: string; url: string; platform: string; publishedAt: string; imageUrl?: string | null; order: number }

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{label}</label>
    {children}
  </div>
)
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} className={`form-input ${props.className ?? ''}`} />
const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...props} className={`form-input resize-none ${props.className ?? ''}`} />

async function uploadFile(file: File, type: string) {
  const fd = new FormData(); fd.append('file', file); fd.append('type', type)
  const res = await fetch('/api/upload', { method: 'POST', body: fd })
  if (!res.ok) throw new Error('Upload failed')
  return (await res.json()).url
}

export default function ArticlesTab({ data, refresh, show }: { data: Article[]; refresh: () => void; show: (m: string, t?: 'success' | 'error') => void }) {
  const blank = { title: '', description: '', url: '', platform: '', publishedAt: '', imageUrl: null as string | null, order: data.length }
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState(blank)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    try { const url = await uploadFile(file, 'image'); setForm(f => ({ ...f, imageUrl: url })); show('Image uploaded!') }
    catch { show('Upload failed', 'error') }
    setUploading(false)
  }

  const add = async () => {
    if (!form.title || !form.url) { show('Title and URL required', 'error'); return }
    setLoading(true)
    const res = await fetch('/api/articles', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) { show('Article added!'); setAdding(false); setForm(blank); refresh() } else show('Failed', 'error')
    setLoading(false)
  }
  const del = async (id: string) => {
    if (!confirm('Delete?')) return
    await fetch('/api/articles', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    show('Deleted'); refresh()
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{data.length} article{data.length !== 1 ? 's' : ''} · Nav link appears when ≥1 exists</p>
        <button onClick={() => setAdding(!adding)} className="btn-primary flex items-center gap-2 py-2 px-4 text-sm"><Plus size={14} />Add Article</button>
      </div>

      <AnimatePresence>
        {adding && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="glass rounded-2xl p-6 border border-accent/20 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Title"><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="How I built..." /></Field>
                <Field label="URL"><Input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://medium.com/..." /></Field>
                <Field label="Platform"><Input value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })} placeholder="Medium, Dev.to, etc." /></Field>
                <Field label="Published Date"><Input value={form.publishedAt} onChange={e => setForm({ ...form, publishedAt: e.target.value })} placeholder="Mar 2024" /></Field>
              </div>
              <Field label="Description"><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Short summary..." /></Field>
              <Field label="Cover Image (optional)">
                <label className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 hover:border-accent/30 cursor-pointer text-sm w-fit" style={{ color: 'var(--text-secondary)' }}>
                  <Upload size={14} />{uploading ? 'Uploading...' : 'Upload Cover Image'}
                  <input type="file" accept="image/*" onChange={handleImg} className="hidden" />
                </label>
                {form.imageUrl && <p className="text-xs mt-1" style={{ color: 'var(--accent)' }}>✓ Image uploaded</p>}
              </Field>
              <div className="flex gap-3">
                <button onClick={add} disabled={loading} className="btn-primary flex items-center gap-2 py-2 px-4 text-sm">
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}Add Article
                </button>
                <button onClick={() => setAdding(false)} className="btn-outline py-2 px-4 text-sm">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {data.map(article => (
          <div key={article.id} className="glass rounded-2xl border border-white/5 p-5 flex items-start gap-4">
            {article.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={article.imageUrl} alt="" className="w-16 h-12 rounded-lg object-cover flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm mb-0.5" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{article.title}</p>
              <div className="flex gap-3 text-xs">
                {article.platform && <span className="tag">{article.platform}</span>}
                {article.publishedAt && <span style={{ color: 'var(--text-muted)' }}>{article.publishedAt}</span>}
              </div>
              <a href={article.url.startsWith('http') ? article.url : 'https://' + article.url} target="_blank" rel="noopener noreferrer" className="text-xs mt-1 block truncate" style={{ color: 'var(--accent)' }}>{article.url}</a>
            </div>
            <button onClick={() => del(article.id)} className="flex-shrink-0 p-2 rounded-lg border border-red-500/25 text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={13} /></button>
          </div>
        ))}
        {data.length === 0 && <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}><p className="mb-2 text-2xl">✍️</p><p>No articles yet. The Articles nav link will be hidden until you add one.</p></div>}
      </div>
    </div>
  )
}
