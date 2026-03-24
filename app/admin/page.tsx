'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const result = await signIn('credentials', { email: form.email, password: form.password, redirect: false })
    if (result?.error) { setError('Invalid email or password'); setLoading(false); return }
    const session = await getSession()
    if (session) router.push('/admin/dashboard')
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* bg effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent/4 rounded-full blur-3xl pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 mb-4">
            <ShieldCheck size={32} className="text-accent" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2" style={{ fontFamily: 'var(--font-syne)' }}>Admin Panel</h1>
          <p className="text-text-muted text-sm">Haridev&apos;s Portfolio CMS — Restricted Access</p>
        </div>

        <div className="glass-strong rounded-2xl p-8 border border-white/7">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email — no icon inside input to avoid overlap */}
            <div>
              <label className="block text-text-muted text-xs font-medium uppercase tracking-wider mb-2" style={{ fontFamily: 'var(--font-jetbrains)' }}>
                Email
              </label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="admin@haridev.dev" required className="form-input" />
            </div>

            <div>
              <label className="block text-text-muted text-xs font-medium uppercase tracking-wider mb-2" style={{ fontFamily: 'var(--font-jetbrains)' }}>
                Password
              </label>
              {/* Password with only eye toggle - no lock icon */}
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••" required className="form-input pr-11" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm bg-red-400/8 rounded-lg px-4 py-3 border border-red-400/18">
                {error}
              </motion.p>
            )}

            <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2 py-4 mt-2">
              {loading ? <><Loader2 size={18} className="animate-spin" />Verifying...</> : <><ShieldCheck size={18} />Sign In to Admin</>}
            </button>
          </form>

          <p className="text-center text-text-muted text-xs mt-6">
            Authorized access only. Navigate to{' '}
            <a href="/" className="text-accent hover:underline">homepage</a>{' '}
            if you landed here by mistake.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
