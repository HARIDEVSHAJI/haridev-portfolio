# 🚀 Deployment Guide — Vercel + Supabase

## Step 1: Set up Supabase (Free Tier)

1. Go to https://supabase.com → Create account → New Project
2. Set a strong database password (save it!)
3. Wait for project to be ready (~2 min)

### Get your credentials from Supabase Dashboard:

**Database URL** → Project Settings → Database → Connection String:
- Use **"Transaction" pooler** URL (port 6543) as `DATABASE_URL`
- Use **"Session" pooler** URL (port 5432) as `DIRECT_URL`
- Replace `[YOUR-PASSWORD]` with your actual password

**API Keys** → Project Settings → API:
- `NEXT_PUBLIC_SUPABASE_URL` = Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `anon` public key
- `SUPABASE_SERVICE_ROLE_KEY` = `service_role` key (keep secret!)

### Create Storage Bucket in Supabase:
1. Supabase Dashboard → Storage → New bucket
2. Name it exactly: `portfolio`
3. Make it **Public** (so uploaded files are accessible)
4. Click Create

## Step 2: Set up Vercel

1. Push your code to GitHub
2. Go to https://vercel.com → Import from GitHub
3. Add all environment variables in Vercel dashboard:

```
DATABASE_URL          = (Supabase Transaction pooler URL)
DIRECT_URL            = (Supabase Session pooler URL)
NEXT_PUBLIC_SUPABASE_URL = (Supabase Project URL)
NEXT_PUBLIC_SUPABASE_ANON_KEY = (anon key)
SUPABASE_SERVICE_ROLE_KEY = (service_role key)
NEXTAUTH_SECRET       = (run: openssl rand -base64 32)
NEXTAUTH_URL          = https://your-app.vercel.app
ADMIN_EMAIL           = admin@haridev.dev
ADMIN_PASSWORD        = Admin@1234
GMAIL_USER            = haridevshaji@gmail.com
GMAIL_APP_PASSWORD    = xxxx xxxx xxxx xxxx
```

4. Deploy!

## Step 3: Initialize Database

After first deploy, run migrations in Vercel Console or locally:
```bash
# Set env vars locally then:
npm run db:push
npm run db:seed
```

## Local Development

```bash
cp .env.example .env
# Fill in your Supabase credentials (or use local PostgreSQL)
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

## Troubleshooting

**"Can't upload images"** → Make sure `portfolio` bucket exists in Supabase Storage and is set to Public

**"prisma generate failed"** → The `postinstall` script handles this automatically on Vercel

**"NEXTAUTH_URL mismatch"** → Set `NEXTAUTH_URL` to your exact Vercel URL in Vercel environment variables

**"Database connection error"** → Use the Transaction pooler URL (port 6543), not the direct connection URL
