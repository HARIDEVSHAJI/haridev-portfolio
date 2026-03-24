# 🚀 Haridev Shaji — Portfolio

A professional, production-ready personal portfolio with a **full Admin CMS panel**, **interactive 3D hero**, smooth animations, and complete backend — built with the modern stack.

---

## ⚡ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Framework** | Next.js 14 (App Router) | Best SSR/SSG, API Routes, file-based routing |
| **Database** | PostgreSQL + Prisma ORM | Robust, type-safe, relational |
| **Auth** | NextAuth.js | Secure session-based admin login |
| **3D** | Three.js + React Three Fiber | Interactive 3D hero globe |
| **Animations** | Framer Motion | Smooth, physics-based UI animations |
| **Styling** | Tailwind CSS + CSS Variables | Design tokens, glassmorphism, responsive |
| **Email** | Nodemailer (Gmail SMTP) | Contact form emails to your inbox |
| **Uploads** | Next.js API + local storage | CV, avatar, project images, certificates |
| **Fonts** | Syne + Plus Jakarta Sans + JetBrains Mono | Premium typography system |

---

## 📋 Prerequisites

Install these before anything else:

### 1. Node.js (v18 or higher)
```bash
# Check your version
node --version

# Download from https://nodejs.org if needed
```

### 2. PostgreSQL
**Option A — Local (recommended for development):**
- **Windows**: Download from https://www.postgresql.org/download/windows/
- **Mac**: `brew install postgresql@16 && brew services start postgresql@16`
- **Linux (Ubuntu)**: `sudo apt install postgresql postgresql-contrib && sudo service postgresql start`

**Option B — Free Cloud (easiest, works immediately):**
- Go to https://neon.tech → Sign up free
- Create a project → Copy the connection string
- Paste it as `DATABASE_URL` in your `.env`

### 3. Git
Download from https://git-scm.com if not installed.

---

## 🛠️ Setup & Run

### Step 1 — Install dependencies
```bash
cd haridev-portfolio
npm install
```

### Step 2 — Configure environment
Open `.env` and fill in your values:

```env
# If using local PostgreSQL:
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/haridev_portfolio"

# If using Neon (cloud):
DATABASE_URL="postgresql://user:pass@host.neon.tech/dbname?sslmode=require"

# Generate a secret key (run this in terminal):
# node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
NEXTAUTH_SECRET="your-generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"

ADMIN_EMAIL="admin@haridev.dev"
ADMIN_PASSWORD="Admin@1234"

# Gmail App Password (see section below)
GMAIL_USER="haridevshaji@gmail.com"
GMAIL_APP_PASSWORD="your-16-char-app-password"
```

### Step 3 — Create database (local PostgreSQL only)
```bash
# Open psql terminal
psql -U postgres

# Inside psql, create the database:
CREATE DATABASE haridev_portfolio;
\q
```

### Step 4 — Push schema to database
```bash
npm run db:generate
npm run db:push
```

### Step 5 — Seed default data
```bash
npm run db:seed
```
This creates:
- Your admin account
- Default profile
- All AI/ML & backend skills pre-loaded
- Default services
- Sample achievements

### Step 6 — Start development server
```bash
npm run dev
```

Open **http://localhost:3000** 🎉

---

## 🔐 Admin Panel

Access your admin panel by manually typing in the URL:
```
http://localhost:3000/admin
```

**Default credentials:**
- Email: `admin@haridev.dev`  
- Password: `Admin@1234`

> ⚠️ **Change your password** after first login (update `ADMIN_PASSWORD` in `.env` and re-seed)

### What you can edit from Admin:
| Section | Editable |
|---|---|
| Profile | Tagline, bio, social links, availability, avatar, CV |
| CV/Resume | Upload PDF → auto-appears as download button in navbar |
| Skills | Add/delete skills, set proficiency level, category, icon |
| Services | Add/edit/delete services with icons |
| Projects | Add/edit/delete, upload images, set featured, add tech stack |
| Certificates | Add/delete with image upload and credential URL |
| Achievements | Add/delete with icons and dates |
| Messages | View, read/unread, reply via email, delete |

---

## 📧 Gmail Setup (Contact Form)

To receive contact form emails:

1. Enable 2-Factor Authentication on your Google account
2. Go to: https://myaccount.google.com/apppasswords
3. Create a new App Password (name it "Portfolio")
4. Copy the 16-character password
5. Add to `.env`:
   ```
   GMAIL_USER="haridevshaji@gmail.com"
   GMAIL_APP_PASSWORD="abcd efgh ijkl mnop"  ← your 16 chars
   ```

> If you skip this step, the contact form still works and saves messages to the database — just no email notification.

---

## 🌐 Pages & Routes

| Route | Description |
|---|---|
| `/` | Home page (scroll through sections) |
| `/#about` | About section |
| `/#skills` | Skills grid |
| `/#services` | Services cards |
| `/#achievements` | Achievements |
| `/#contact` | Contact form |
| `/projects` | All projects gallery |
| `/projects/[slug]` | Individual project detail with image slider |
| `/certificates` | Certificates gallery with lightbox |
| `/admin` | Admin login (type manually in URL) |
| `/admin/dashboard` | Full CMS panel |

---

## 🚀 Deployment (Production)

### Option 1 — Vercel (Recommended, Free)

1. Push your code to GitHub
2. Go to https://vercel.com → Import your repo
3. Add all environment variables from `.env` in Vercel dashboard
4. Change `NEXTAUTH_URL` to your live domain:
   ```
   NEXTAUTH_URL="https://haridev.dev"
   ```
5. Use **Neon** or **Supabase** for your PostgreSQL database (both free tier)
6. Deploy!

```bash
# Build locally to test before deploying:
npm run build
npm run start
```

### Option 2 — Railway / Render
- Both support PostgreSQL + Next.js
- Set environment variables in their dashboard
- Connect GitHub repo for auto-deploy

---

## 📁 Project Structure

```
haridev-portfolio/
├── app/
│   ├── page.tsx              ← Home page
│   ├── layout.tsx            ← Root layout
│   ├── globals.css           ← Design system & animations
│   ├── admin/
│   │   ├── page.tsx          ← Login page
│   │   ├── layout.tsx        ← Auth wrapper
│   │   └── dashboard/
│   │       ├── page.tsx      ← Dashboard (server, auth guard)
│   │       ├── AdminDashboardClient.tsx  ← Main CMS UI
│   │       └── AdminTabComponents.tsx   ← Tab sections
│   ├── projects/
│   │   ├── page.tsx          ← Projects listing
│   │   ├── ProjectsClient.tsx
│   │   └── [slug]/           ← Dynamic project detail
│   ├── certificates/
│   │   └── page.tsx
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── profile/route.ts
│       ├── skills/route.ts
│       ├── services/route.ts
│       ├── projects/route.ts
│       ├── certificates/route.ts
│       ├── achievements/route.ts
│       ├── messages/route.ts
│       └── upload/route.ts
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── SkillsSection.tsx
│   │   ├── ServicesSection.tsx
│   │   ├── AchievementsSection.tsx
│   │   └── ContactSection.tsx
│   ├── three/
│   │   └── HeroGlobe.tsx     ← 3D interactive sphere
│   └── ui/
│       ├── CursorGlow.tsx
│       └── useScrollReveal.ts
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   └── email.ts
├── prisma/
│   ├── schema.prisma         ← Database schema
│   └── seed.ts               ← Default data
├── middleware.ts             ← Admin route protection
├── .env                      ← Your config (never commit!)
└── README.md
```

---

## 🎨 Customization

### Change Colors
Edit `app/globals.css` CSS variables:
```css
:root {
  --accent: #00d4ff;      /* Cyan - primary accent */
  --accent-2: #a855f7;   /* Purple - secondary accent */
  --background: #05050d; /* Near-black background */
}
```

### Change Name
The name **Haridev Shaji** is hardcoded in `components/sections/HeroSection.tsx` (intentionally non-editable as requested). Change it there if needed.

### Change Education
Education details are constant and hardcoded in `components/sections/AboutSection.tsx`.

---

## 🐛 Common Issues

**`prisma generate` fails:**
```bash
npm install prisma --save-dev
npx prisma generate
```

**Database connection error:**
- Check your `DATABASE_URL` format
- Make sure PostgreSQL is running: `sudo service postgresql status`
- For local: make sure the database exists: `psql -U postgres -c "CREATE DATABASE haridev_portfolio;"`

**`npm run build` error about Three.js:**
- Make sure `@react-three/fiber` and `@react-three/drei` are installed
- The HeroGlobe uses `dynamic()` with `ssr: false` — this is intentional

**Admin login not working:**
- Make sure you ran `npm run db:seed`
- Check `NEXTAUTH_SECRET` is set in `.env`
- Check `NEXTAUTH_URL` matches your current URL

---

## 📞 Support

Built for Haridev Shaji's personal portfolio.  
Edit any section from the admin panel at `/admin`.
