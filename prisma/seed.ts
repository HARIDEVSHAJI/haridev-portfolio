import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@1234', 12)
  await prisma.admin.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@haridev.dev' },
    update: {},
    create: { email: process.env.ADMIN_EMAIL || 'admin@haridev.dev', password: hashedPassword },
  })
  console.log('✅ Admin created')

  await prisma.profile.upsert({
    where: { id: 'default-profile' },
    update: {},
    create: {
      id: 'default-profile',
      tagline: 'AI Engineer & Backend Developer',
      bio: "I'm Haridev Shaji, a Computer Science student at LPU specializing in AI & ML. Passionate about building intelligent systems, scalable backend architectures, and turning ideas into impactful digital products.",
      github: 'https://github.com/haridevshaji',
      linkedin: 'https://linkedin.com/in/haridevshaji',
      twitter: '', instagram: '',
      email: 'haridevshaji@gmail.com',
      phone: '',
      location: 'Punjab, India',
      isAvailable: true,
      typingTexts: ['AI Engineer', 'Backend Developer', 'ML Enthusiast', 'Problem Solver'],
      currently: '3rd year B.Tech student at LPU specializing in AI & ML. Actively building ML projects, backend systems, and exploring LLM applications.',
      statYears: '2+', statProjects: '10+', statSpec: 'AI/ML', statUni: 'LPU',
    },
  })
  console.log('✅ Profile created')

  const skills = [
    { id:'sk1', name:'Python', category:'AI / ML', iconName:'python', level:90, order:1 },
    { id:'sk2', name:'TensorFlow', category:'AI / ML', iconName:'tensorflow', level:80, order:2 },
    { id:'sk3', name:'PyTorch', category:'AI / ML', iconName:'pytorch', level:75, order:3 },
    { id:'sk4', name:'Scikit-Learn', category:'AI / ML', iconName:'sklearn', level:85, order:4 },
    { id:'sk5', name:'Pandas', category:'AI / ML', iconName:'pandas', level:88, order:5 },
    { id:'sk6', name:'NumPy', category:'AI / ML', iconName:'numpy', level:88, order:6 },
    { id:'sk7', name:'OpenCV', category:'AI / ML', iconName:'opencv', level:72, order:7 },
    { id:'sk8', name:'LangChain', category:'AI / ML', iconName:'langchain', level:70, order:8 },
    { id:'sk9', name:'Node.js', category:'Backend', iconName:'nodejs', level:85, order:9 },
    { id:'sk10', name:'FastAPI', category:'Backend', iconName:'fastapi', level:82, order:10 },
    { id:'sk11', name:'Express.js', category:'Backend', iconName:'express', level:85, order:11 },
    { id:'sk12', name:'Django', category:'Backend', iconName:'django', level:75, order:12 },
    { id:'sk13', name:'PostgreSQL', category:'Backend', iconName:'postgresql', level:80, order:13 },
    { id:'sk14', name:'MongoDB', category:'Backend', iconName:'mongodb', level:78, order:14 },
    { id:'sk15', name:'Redis', category:'Backend', iconName:'redis', level:70, order:15 },
    { id:'sk16', name:'Docker', category:'DevOps', iconName:'docker', level:75, order:16 },
    { id:'sk17', name:'React', category:'Frontend', iconName:'react', level:80, order:17 },
    { id:'sk18', name:'TypeScript', category:'Frontend', iconName:'typescript', level:78, order:18 },
    { id:'sk19', name:'Next.js', category:'Frontend', iconName:'nextjs', level:75, order:19 },
    { id:'sk20', name:'Git', category:'Tools', iconName:'git', level:90, order:20 },
    { id:'sk21', name:'Linux', category:'Tools', iconName:'linux', level:82, order:21 },
    { id:'sk22', name:'REST APIs', category:'Backend', iconName:'api', level:90, order:22 },
  ]
  for (const s of skills) { await prisma.skill.upsert({ where: { id: s.id }, update: {}, create: s }) }
  console.log('✅ Skills created')

  const services = [
    { id:'svc1', title:'Backend Development', description:'Building high-performance, scalable APIs using Node.js, FastAPI, Django. From architecture to deployment.', iconName:'server', order:1 },
    { id:'svc2', title:'AI / ML Development', description:'Designing and deploying ML models, NLP systems, computer vision pipelines, and LLM-powered applications.', iconName:'brain', order:2 },
    { id:'svc3', title:'System Architecture', description:'Designing robust, cloud-ready backend systems with microservices, database optimization, and CI/CD pipelines.', iconName:'layers', order:3 },
  ]
  for (const s of services) { await prisma.service.upsert({ where: { id: s.id }, update: {}, create: s }) }
  console.log('✅ Services created')

  const achievements = [
    { id:'ach1', title:'Smart India Hackathon Finalist', description:'Selected as a finalist among hundreds of teams at LPU campus.', iconName:'trophy', date:'2024', order:1 },
    { id:'ach2', title:"Dean's Merit List", description:"Recognized on Dean's Merit List at LPU for academic excellence.", iconName:'star', date:'2024', order:2 },
    { id:'ach3', title:'AWS Cloud Practitioner Certified', description:'Earned AWS Cloud Practitioner certification demonstrating cloud expertise.', iconName:'cloud', date:'2024', order:3 },
  ]
  for (const a of achievements) { await prisma.achievement.upsert({ where: { id: a.id }, update: {}, create: a }) }
  console.log('✅ Achievements created')

  console.log('🎉 Database seeded!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
