'use client'
import { motion } from 'framer-motion'
import { ExternalLink, Calendar, BookOpen } from 'lucide-react'

interface Article { id: string; title: string; description: string; url: string; platform: string; publishedAt: string; imageUrl?: string | null }

function ensureAbs(url: string) { return url.startsWith('http') ? url : 'https://' + url }

export default function ArticlesClient({ articles }: { articles: Article[] }) {
  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-20">
          <p className="section-label mb-4">Writing</p>
          <h1 className="section-title">My <span className="gradient-text">Articles</span></h1>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, i) => (
            <motion.a key={article.id} href={ensureAbs(article.url)} target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07, duration: 0.5 }}
              className="glass rounded-2xl border border-white/5 hover:border-accent/20 overflow-hidden group transition-all hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
              style={{ display: 'block' }}>
              {article.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={article.imageUrl} alt={article.title} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-44 flex items-center justify-center" style={{ background: 'var(--surface-2)' }}>
                  <BookOpen size={40} style={{ color: 'rgba(249,115,22,0.2)' }} />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  {article.platform && <span className="tag text-xs">{article.platform}</span>}
                  {article.publishedAt && <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}><Calendar size={10} />{article.publishedAt}</span>}
                </div>
                <h3 className="font-bold text-base mb-2 group-hover:text-accent transition-colors" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{article.title}</h3>
                {article.description && <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{article.description}</p>}
                <div className="flex items-center gap-1 mt-4 text-xs font-semibold" style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
                  <ExternalLink size={12} /> Read Article
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  )
}
