'use client'

import { motion } from 'framer-motion'
import { GraduationCap, Briefcase, MapPin, Calendar, Award, BookOpen, FileText, ExternalLink } from 'lucide-react'

const education = [
  { institution: 'Lovely Professional University', location: 'Phagwara, Punjab', degree: 'B.Tech — CSE (AI & ML)', duration: 'Aug 2023 – Jun 2027' },
  { institution: 'Bharatiya Vidya Bhavan School', location: 'Calicut, Kerala', degree: 'Intermediate (Class XII)', duration: 'Jun 2022 – Mar 2023' },
  { institution: 'Bharatiya Vidya Bhavan', location: 'Calicut, Kerala', degree: 'Matriculation (Class X)', duration: 'Jun 2021 – May 2022' },
]

interface Profile {
  bio: string; avatarUrl?: string | null; currently: string
  statYears: string; statProjects: string; statSpec: string; statUni: string
}
interface Experience { id: string; role: string; company: string; duration: string; description: string }
interface Patent { id: string; title: string; number: string; description: string; filedDate: string; status: string; pdfUrl?: string | null }
interface Training { id: string; title: string; provider: string; duration: string; description: string }

function SectionCard({ icon, title, color, children }: { icon: React.ReactNode; title: string; color?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center border" style={{ background: `${color || 'var(--accent)'}12`, border: `1px solid ${color || 'var(--accent)'}20`, color: color || 'var(--accent)' }}>
          {icon}
        </div>
        <h3 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{title}</h3>
      </div>
      {children}
    </div>
  )
}

export default function AboutSection({
  profile, experiences, patents, trainings
}: {
  profile: Profile; experiences?: Experience[]; patents?: Patent[]; trainings?: Training[]
}) {
  const stats = [
    { val: profile.statYears, label: 'Years Coding' },
    { val: profile.statProjects, label: 'Projects Built' },
    { val: profile.statSpec, label: 'Specialization' },
    { val: profile.statUni, label: 'University' },
  ]

  return (
    <section id="about" className="section-padding relative">
      <div className="absolute inset-0 dot-pattern opacity-25 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-20">
          <p className="section-label mb-4">Get to know me</p>
          <h2 className="section-title">About <span className="gradient-text">Me</span></h2>
        </motion.div>

        {/* Stats — editable from admin */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {stats.map((s) => (
            <div key={s.label} className="glass rounded-2xl p-6 text-center border border-white/6 hover:border-accent/15 transition-all">
              <div className="text-3xl font-bold gradient-text mb-2" style={{ fontFamily: 'var(--font-display)' }}>{s.val}</div>
              <div className="text-xs uppercase tracking-widest" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Avatar + Bio */}
        <div className="grid lg:grid-cols-5 gap-12 items-start mb-20">
          {profile.avatarUrl && (
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="lg:col-span-2 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl blur-2xl scale-110" style={{ background: 'rgba(249,115,22,0.08)' }} />
                <div className="relative rounded-2xl overflow-hidden border" style={{ width: '280px', maxWidth: '100%', borderColor: 'rgba(249,115,22,0.15)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={profile.avatarUrl} alt="Haridev Shaji" className="w-full object-cover object-top" style={{ maxHeight: '400px', mixBlendMode: 'screen' }} />
                  <div className="absolute bottom-0 left-0 right-0 h-20" style={{ background: 'linear-gradient(to top, var(--background) 0%, transparent 100%)' }} />
                </div>
                <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 glass rounded-xl px-4 py-2 border whitespace-nowrap" style={{ borderColor: 'rgba(249,115,22,0.2)' }}>
                  <p className="text-sm font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)' }}>Haridev Shaji</p>
                  <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>AI/ML Student @ LPU</p>
                </motion.div>
              </div>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className={profile.avatarUrl ? 'lg:col-span-3' : 'lg:col-span-5 max-w-3xl mx-auto text-center'}>
            <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Who I Am</h3>
            <p className="leading-relaxed mb-5 text-base" style={{ color: 'var(--text-secondary)' }}>{profile.bio}</p>
            <div className="glass rounded-xl p-4 border" style={{ borderColor: 'rgba(52,211,153,0.15)', background: 'rgba(52,211,153,0.03)' }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-display)', color: '#34d399' }}>Currently</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{profile.currently}</p>
            </div>
          </motion.div>
        </div>

        {/* Education + Experience */}
        <div className="grid lg:grid-cols-2 gap-14 mb-20">
          {/* Education */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <SectionCard icon={<GraduationCap size={20} />} title="Education">
              <div className="relative">
                <div className="absolute left-4 top-4 bottom-4 w-px" style={{ background: 'linear-gradient(to bottom, rgba(249,115,22,0.4), transparent)' }} />
                <div className="space-y-5">
                  {education.map((edu, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative pl-12">
                      <div className="absolute left-0 top-2 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border" style={{ background: 'var(--surface-2)', borderColor: 'rgba(249,115,22,0.25)', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>{i + 1}</div>
                      <div className="glass rounded-xl p-4 border border-white/5 hover:border-accent/12 transition-all">
                        <h4 className="font-semibold text-sm mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{edu.institution}</h4>
                        <p className="text-sm mb-2" style={{ color: 'var(--accent)' }}>{edu.degree}</p>
                        <div className="flex flex-wrap gap-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                          <span className="flex items-center gap-1"><MapPin size={10} />{edu.location}</span>
                          <span className="flex items-center gap-1"><Calendar size={10} />{edu.duration}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </SectionCard>
          </motion.div>

          {/* Experience */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <SectionCard icon={<Briefcase size={20} />} title="Experience" color="#818cf8">
              {experiences && experiences.length > 0 ? (
                <div className="space-y-4">
                  {experiences.map((exp, i) => (
                    <motion.div key={exp.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                      className="glass rounded-xl p-5 border border-white/5 hover:border-accent/12 transition-all">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-bold text-sm" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{exp.role}</h4>
                        <span className="text-xs ml-3 flex-shrink-0" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{exp.duration}</span>
                      </div>
                      <p className="text-xs mb-2" style={{ color: 'var(--accent)' }}>{exp.company}</p>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{exp.description}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="glass rounded-xl p-6 border border-white/5 text-center">
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No experience added yet. Add from admin panel → About Me → Experience.</p>
                </div>
              )}
            </SectionCard>
          </motion.div>
        </div>

        {/* Patents */}
        {patents && patents.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-20">
            <SectionCard icon={<FileText size={20} />} title="Patents & Publications" color="#d4a853">
              <div className="grid md:grid-cols-2 gap-5">
                {patents.map((patent, i) => (
                  <motion.div key={patent.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                    className="glass rounded-xl p-5 border border-white/5 hover:border-yellow-600/20 transition-all group">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-sm leading-snug pr-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{patent.title}</h4>
                      <span className="px-2 py-0.5 rounded-full text-xs flex-shrink-0" style={{ background: 'rgba(212,168,83,0.12)', border: '1px solid rgba(212,168,83,0.25)', color: 'var(--gold)' }}>{patent.status}</span>
                    </div>
                    {patent.number && <p className="text-xs mb-2" style={{ color: 'var(--gold)', fontFamily: 'var(--font-mono)' }}>#{patent.number}</p>}
                    {patent.filedDate && <p className="text-xs mb-2 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}><Calendar size={10} />{patent.filedDate}</p>}
                    {patent.description && <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{patent.description}</p>}
                    {patent.pdfUrl && (
                      <a href={patent.pdfUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)' }}>
                        <ExternalLink size={12} /> View Patent PDF
                      </a>
                    )}
                  </motion.div>
                ))}
              </div>
            </SectionCard>
          </motion.div>
        )}

        {/* Training */}
        {trainings && trainings.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <SectionCard icon={<BookOpen size={20} />} title="Training & Courses" color="#34d399">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {trainings.map((tr, i) => (
                  <motion.div key={tr.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                    className="glass rounded-xl p-4 border border-white/5 hover:border-emerald-500/15 transition-all">
                    <h4 className="font-semibold text-sm mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{tr.title}</h4>
                    <p className="text-xs mb-1" style={{ color: '#34d399' }}>{tr.provider}</p>
                    {tr.duration && <p className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{tr.duration}</p>}
                    {tr.description && <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{tr.description}</p>}
                  </motion.div>
                ))}
              </div>
            </SectionCard>
          </motion.div>
        )}
      </div>
    </section>
  )
}
