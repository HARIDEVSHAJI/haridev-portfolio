'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const categoryColors: Record<string, string> = {
  'AI / ML': '#00e5ff',
  'Backend': '#818cf8',
  'Frontend': '#34d399',
  'DevOps': '#fbbf24',
  'Tools': '#f87171',
}

function SkillIcon({ name }: { name: string }) {
  const icons: Record<string, string> = {
    python:'🐍', tensorflow:'🧠', pytorch:'🔥', sklearn:'📊', pandas:'🐼',
    numpy:'🔢', opencv:'👁', langchain:'⛓', nodejs:'🟢', fastapi:'⚡',
    express:'🚂', django:'🎸', postgresql:'🐘', mongodb:'🍃', redis:'🔴',
    docker:'🐳', react:'⚛', typescript:'🔷', nextjs:'▲', git:'🌿',
    linux:'🐧', api:'🔌', default:'💻',
  }
  return <span className="text-2xl" role="img">{icons[name] || icons.default}</span>
}

interface Skill { id: string; name: string; category: string; iconName: string; level: number }

export default function SkillsSection({ skills }: { skills: Skill[] }) {
  const categories = ['All', ...Array.from(new Set(skills.map(s => s.category)))]
  const [active, setActive] = useState('All')
  const filtered = active === 'All' ? skills : skills.filter(s => s.category === active)

  return (
    <section id="skills" className="section-padding relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent-2/3 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.6 }} className="text-center mb-16">
          <p className="text-accent text-xs font-medium tracking-[0.25em] uppercase mb-4" style={{ fontFamily: 'var(--font-jetbrains)' }}>
            What I work with
          </p>
          <h2 className="section-title" style={{ fontFamily: 'var(--font-syne)' }}>
            Skills &amp; <span className="gradient-text">Expertise</span>
          </h2>
        </motion.div>

        {/* Filter tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }} className="flex flex-wrap justify-center gap-2.5 mb-12">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActive(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                active === cat
                  ? 'bg-accent text-background font-bold shadow-[0_0_20px_rgba(0,229,255,0.3)]'
                  : 'glass border border-white/8 text-text-secondary hover:text-text-primary hover:border-accent/20'
              }`}
              style={{ fontFamily: 'var(--font-syne)' }}>
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Skills grid */}
        <motion.div key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((skill, i) => {
            const color = categoryColors[skill.category] || '#00e5ff'
            return (
              <motion.div key={skill.id}
                initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.035, duration: 0.4 }}
                whileHover={{ y: -5, scale: 1.03 }}
                className="glass rounded-2xl p-5 border border-white/4 hover:border-white/12 transition-all duration-300 cursor-default group">
                
                <div className="mb-3 flex items-center justify-between">
                  <SkillIcon name={skill.iconName} />
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{
                    color, background: `${color}12`, border: `1px solid ${color}25`,
                    fontFamily: 'var(--font-jetbrains)',
                  }}>
                    {skill.category}
                  </span>
                </div>

                <h3 className="font-semibold text-text-primary text-sm mb-3" style={{ fontFamily: 'var(--font-syne)' }}>
                  {skill.name}
                </h3>

                {/* Progress bar only — no percentage text */}
                <div className="progress-bar">
                  <motion.div className="progress-fill" initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }} viewport={{ once: true }}
                    transition={{ duration: 1.3, delay: i * 0.035, ease: [0.16, 1, 0.3, 1] }} />
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center text-text-muted py-20">No skills in this category yet.</div>
        )}
      </div>
    </section>
  )
}
