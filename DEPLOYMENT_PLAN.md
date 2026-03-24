# 🚀 DEPLOYMENT PLAN — Step by Step (Vercel + Supabase)

> This guide will take you from zero to a fully deployed portfolio in ~20 minutes.
> Recommended stack: **Vercel** (hosting) + **Supabase** (database + file storage)
> Both are FREE on their starter plans.

---

## PART 1: Set Up Supabase (Database + Storage)

### Step 1.1 — Create Supabase Account
1. Go to https://supabase.com and click "Start your project"
2. Sign in with GitHub
3. Click "New Project"
4. Fill in:
   - **Name**: `haridev-portfolio`
   - **Database Password**: Create a strong password — **SAVE THIS, you need it later**
   - **Region**: Choose closest to you (e.g., `Southeast Asia (Singapore)`)
5. Click "Create new project" — wait ~2 minutes for it to set up

### Step 1.2 — Get Your Database URLs
1. In Supabase dashboard → click **"Project Settings"** (gear icon, left sidebar)
2. Click **"Database"** tab
3. Scroll down to **"Connection String"**
4. Click **"Transaction"** tab → copy the URL
   - This is your `DATABASE_URL`
   - Replace `[YOUR-PASSWORD]` with your actual password from Step 1.1
5. Click **"Session"** tab → copy the URL
   - This is your `DIRECT_URL`
   - Also replace `[YOUR-PASSWORD]`

**Example format:**
```
DATABASE_URL = postgresql://postgres.xxxx:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL   = postgresql://postgres.xxxx:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
```

### Step 1.3 — Get API Keys
1. Still in "Project Settings" → click **"API"** tab
2. Copy these 3 values:
   - **Project URL** → this is `NEXT_PUBLIC_SUPABASE_URL`
   - **anon (public)** key → this is `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role (secret)** key → this is `SUPABASE_SERVICE_ROLE_KEY`

### Step 1.4 — Create Storage Bucket
1. In Supabase dashboard → click **"Storage"** (left sidebar)
2. Click **"New bucket"**
3. **Bucket name**: `portfolio` (EXACT — no spaces, no capitals)
4. Toggle **"Public bucket"** to ON
5. Click **"Save"**

✅ Supabase is ready!

---

## PART 2: Set Up GitHub

### Step 2.1 — Push Code to GitHub
```bash
# In your haridev-portfolio folder:
git init
git add .
git commit -m "Initial portfolio"
git branch -M main

# Create a new repo on github.com (don't add README)
git remote add origin https://github.com/YOUR-USERNAME/haridev-portfolio.git
git push -u origin main
```

---

## PART 3: Deploy to Vercel

### Step 3.1 — Create Vercel Account
1. Go to https://vercel.com
2. Click **"Sign Up"** → sign in with GitHub (same account)

### Step 3.2 — Import Your Project
1. Click **"Add New..."** → **"Project"**
2. Find and click **"Import"** next to your `haridev-portfolio` repository
3. Vercel will detect Next.js automatically

### Step 3.3 — Add Environment Variables
Before clicking "Deploy", click **"Environment Variables"** and add ALL of these:

| Variable Name | Value | Where to Get |
|---|---|---|
| `DATABASE_URL` | `postgresql://postgres.xxxx:PASSWORD@...supabase.com:6543/postgres?pgbouncer=true` | Supabase → Settings → Database → Transaction URL |
| `DIRECT_URL` | `postgresql://postgres.xxxx:PASSWORD@...supabase.com:5432/postgres` | Supabase → Settings → Database → Session URL |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbG...` (long key) | Supabase → Settings → API → anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbG...` (different long key) | Supabase → Settings → API → service_role key |
| `NEXTAUTH_SECRET` | Run: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` | Generate on your computer |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | You'll get this URL after first deploy — update it then |
| `ADMIN_EMAIL` | `admin@haridev.dev` | Your choice — this is the login email |
| `ADMIN_PASSWORD` | `Admin@1234` | Your choice — change this to something secure! |
| `GMAIL_USER` | `haridevshaji@gmail.com` | Your Gmail address |
| `GMAIL_APP_PASSWORD` | `xxxx xxxx xxxx xxxx` | See Step 3.4 below |

### Step 3.4 — Get Gmail App Password
1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification** if not already
3. Search for "App Passwords" in the search bar
4. Select **"Mail"** and **"Windows Computer"**
5. Copy the 16-character password
6. Use this as `GMAIL_APP_PASSWORD` (spaces don't matter)

> If you skip this step, the contact form still saves messages to the database — you just won't get email notifications.

### Step 3.5 — Deploy!
1. Click **"Deploy"**
2. Wait ~3-4 minutes for the build to complete
3. You'll get a URL like `haridev-portfolio-xxx.vercel.app`

### Step 3.6 — Update NEXTAUTH_URL
1. Go to Vercel dashboard → your project → **"Settings"** → **"Environment Variables"**
2. Find `NEXTAUTH_URL` → Edit it to your actual Vercel URL:
   ```
   https://haridev-portfolio-xxx.vercel.app
   ```
3. Go to **"Deployments"** tab → **"Redeploy"** the latest deployment

### Step 3.7 — Set Up Database
After the first successful deploy, run from your LOCAL computer:
```bash
# Make sure your .env has the correct DATABASE_URL and DIRECT_URL
npm run db:generate
npm run db:push      # Creates all tables in Supabase
npm run db:seed      # Seeds default data (admin account, skills, etc.)
```

✅ Your portfolio is LIVE!

---

## PART 4: Set Up Custom Domain (Optional)

1. Vercel Dashboard → your project → **"Settings"** → **"Domains"**
2. Add your domain (e.g., `haridev.dev`)
3. Add the DNS records shown by Vercel in your domain registrar

---

## 🔄 How to Update Your Portfolio

After making code changes:
```bash
git add .
git commit -m "Update portfolio"
git push
```
Vercel auto-deploys on every push to `main`. ✅

---

## 🐛 Troubleshooting

### "prisma generate failed" or "Cannot find module '@prisma/client'"
- The `package.json` has `"postinstall": "prisma generate"` which runs automatically
- If it still fails, go to Vercel → Settings → and add a build command: `prisma generate && next build`

### "Image upload not working in production"
- Make sure the `portfolio` Storage bucket exists in Supabase
- Make sure it's set to **Public**
- Make sure `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are all set in Vercel

### "Cannot connect to database"
- Use the **Transaction pooler** URL (port 6543) for `DATABASE_URL`
- Use the **Session pooler** URL (port 5432) for `DIRECT_URL`
- Make sure you replaced `[YOUR-PASSWORD]` with your actual Supabase password

### "Login to admin not working"
- Make sure `NEXTAUTH_SECRET` is set (at least 32 characters)
- Make sure `NEXTAUTH_URL` matches your EXACT Vercel URL (no trailing slash)
- Re-run `npm run db:seed` to make sure the admin account was created

### "Everything works locally but not on Vercel"
- Check that ALL environment variables are set in Vercel (Settings → Environment Variables)
- Click "Redeploy" after adding any new environment variables

---

## 📋 Quick Reference — All Environment Variables

```env
DATABASE_URL=postgresql://postgres.XXXX:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.XXXX:PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://XXXX.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXTAUTH_SECRET=your-random-32-char-string
NEXTAUTH_URL=https://your-app.vercel.app
ADMIN_EMAIL=admin@haridev.dev
ADMIN_PASSWORD=YourSecurePassword123
GMAIL_USER=haridevshaji@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```
