'use client'

import { motion } from 'framer-motion'
import { Server, Brain, Layers, Code, Globe, Shield, Cpu, Database } from 'lucide-react'

const iconMap: Record<string, React.ReactNode> = {
  server: <Server size={28} />, brain: <Brain size={28} />, layers: <Layers size={28} />,
  code: <Code size={28} />, globe: <Globe size={28} />, shield: <Shield size={28} />,
  cpu: <Cpu size={28} />, database: <Database size={28} />,
}

const cardAccents = [
  { color: '#00e5ff', bg: 'rgba(0,229,255,0.04)' },
  { color: '#818cf8', bg: 'rgba(129,140,248,0.04)' },
  { color: '#34d399', bg: 'rgba(52,211,153,0.04)' },
  { color: '#fbbf24', bg: 'rgba(251,191,36,0.04)' },
]

interface Service { id: string; title: string; description: string; iconName: string; order: number }

export default function ServicesSection({ services }: { services: Service[] }) {
  return (
    <section id="services" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="absolute top-1/4 left-0 w-[350px] h-[350px] bg-accent/3 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.6 }} className="text-center mb-20">
          <p className="text-accent text-xs font-medium tracking-[0.25em] uppercase mb-4" style={{ fontFamily: 'var(--font-jetbrains)' }}>What I offer</p>
          <h2 className="section-title" style={{ fontFamily: 'var(--font-syne)' }}>
            What I <span className="gradient-text">Do</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((svc, i) => {
            const accent = cardAccents[i % cardAccents.length]
            return (
              <motion.div key={svc.id}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -6 }}
                className="relative rounded-2xl p-7 border border-white/5 hover:border-white/10 transition-all duration-400 group overflow-hidden"
                style={{ background: accent.bg }}>

                {/* Number watermark */}
                <div className="absolute top-5 right-6 text-5xl font-bold opacity-4 group-hover:opacity-8 transition-opacity" style={{ fontFamily: 'var(--font-syne)', color: accent.color }}>
                  {String(i + 1).padStart(2, '0')}
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-b-2xl"
                  style={{ background: `linear-gradient(90deg, ${accent.color}, transparent)` }} />

                <div className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${accent.color}12`, color: accent.color, border: `1px solid ${accent.color}18` }}>
                  {iconMap[svc.iconName] || <Code size={28} />}
                </div>

                <div className="relative z-10">
                  <h3 className="text-lg font-bold text-text-primary mb-3" style={{ fontFamily: 'var(--font-syne)' }}>{svc.title}</h3>
                  <p className="text-text-secondary leading-relaxed text-sm">{svc.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {services.length === 0 && <div className="text-center text-text-muted py-20">No services added yet.</div>}
      </div>
    </section>
  )
}
