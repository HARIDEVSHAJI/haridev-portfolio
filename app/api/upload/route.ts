import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getSupabaseAdmin, STORAGE_BUCKET } from '@/lib/supabase'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const type = (formData.get('type') as string) || 'image'

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const allowedTypes: Record<string, string[]> = {
      cv: ['application/pdf'],
      avatar: ['image/jpeg', 'image/png', 'image/webp'],
      image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      certificate: ['image/jpeg', 'image/png', 'image/webp'],
    }
    const allowed = allowedTypes[type] || allowedTypes.image
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type: ' + file.type }, { status: 400 })
    }

    const maxSize = type === 'cv' ? 10 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const ext = (file.name.split('.').pop() || 'bin').toLowerCase()
    const filename = `${type}-${Date.now()}.${ext}`

    // Try Supabase Storage first (works on Vercel)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (supabaseUrl && supabaseKey) {
      const supabase = getSupabaseAdmin()
      const storagePath = `${type}/${filename}`

      const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(storagePath, buffer, { contentType: file.type, upsert: true, cacheControl: '3600' })

      if (error) throw new Error('Supabase upload failed: ' + error.message)

      const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath)
      return NextResponse.json({ url: urlData.publicUrl })
    }

    // Local filesystem fallback (dev without Supabase)
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', type)
    await mkdir(uploadDir, { recursive: true })
    await writeFile(path.join(uploadDir, filename), buffer)
    return NextResponse.json({ url: `/uploads/${type}/${filename}` })

  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Upload failed' }, { status: 500 })
  }
}
