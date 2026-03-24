'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Award, Calendar, Building2 } from 'lucide-react'

interface Certificate {
  id: string; title: string; issuer: string; issueDate: string
  description: string; imageUrl?: string | null; credentialUrl?: string | null
}

export default function CertificatesClient({ certificates }: { certificates: Certificate[] }) {
  const [selected, setSelected] = useState<Certificate | null>(null)

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-20">
          <p className="text-accent text-xs font-medium tracking-[0.25em] uppercase mb-4" style={{ fontFamily: 'var(--font-jetbrains)' }}>Credentials</p>
          <h1 className="section-title" style={{ fontFamily: 'var(--font-syne)' }}>My <span className="gradient-text">Certificates</span></h1>
          <p className="text-text-secondary mt-4 max-w-lg mx-auto text-sm">Click any certificate to view full details.</p>
        </motion.div>

        {certificates.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {certificates.map((cert, i) => (
              <motion.div key={cert.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.5 }} whileHover={{ y: -4 }}
                onClick={() => setSelected(cert)}
                className="glass rounded-2xl border border-white/5 hover:border-accent/20 transition-all duration-300 cursor-pointer group overflow-hidden">
                <div className="h-44 bg-surface-2 overflow-hidden relative">
                  {cert.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cert.imageUrl} alt={cert.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><Award size={40} className="text-accent/25" /></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-surface/50 to-transparent" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-text-primary text-sm leading-snug mb-2 group-hover:text-accent transition-colors line-clamp-2" style={{ fontFamily: 'var(--font-syne)' }}>
                    {cert.title}
                  </h3>
                  <p className="text-text-muted text-xs flex items-center gap-1.5 mb-1"><Building2 size={10} />{cert.issuer}</p>
                  <p className="text-text-muted text-xs flex items-center gap-1.5"><Calendar size={10} />{cert.issueDate}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center text-text-muted py-20">
            <Award size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-xl font-semibold" style={{ fontFamily: 'var(--font-syne)' }}>No certificates yet</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: 'rgba(8,8,8,0.94)', backdropFilter: 'blur(12px)' }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="glass rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
              {/* Close */}
              <button onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full glass flex items-center justify-center text-text-muted hover:text-white z-10 border border-white/10">
                <X size={15} />
              </button>

              {selected.imageUrl && (
                <div className="h-64 md:h-80 bg-surface-2 overflow-hidden rounded-t-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selected.imageUrl} alt={selected.title} className="w-full h-full object-contain" />
                </div>
              )}

              <div className="p-7">
                <h2 className="text-xl font-bold text-text-primary mb-3 break-anywhere" style={{ fontFamily: 'var(--font-syne)' }}>{selected.title}</h2>
                <div className="flex flex-wrap gap-4 mb-4 text-sm text-text-secondary">
                  <span className="flex items-center gap-2"><Building2 size={13} className="text-accent" />{selected.issuer}</span>
                  <span className="flex items-center gap-2"><Calendar size={13} className="text-accent" />{selected.issueDate}</span>
                </div>
                {selected.description && (
                  <div className="glass rounded-xl p-4 border border-white/5 mb-5">
                    {/* Description with proper overflow handling */}
                    <p className="text-text-secondary leading-relaxed text-sm break-anywhere whitespace-pre-wrap">
                      {selected.description}
                    </p>
                  </div>
                )}
                {selected.credentialUrl && (
                  <a href={selected.credentialUrl.startsWith('http') ? selected.credentialUrl : 'https://' + selected.credentialUrl}
                    target="_blank" rel="noopener noreferrer"
                    className="btn-primary inline-flex items-center gap-2">
                    <ExternalLink size={15} /> View Credential
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
