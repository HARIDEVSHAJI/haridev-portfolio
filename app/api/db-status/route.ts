import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const result = { database: false, storage: false, dbLatency: 0, storageConfigured: false, errors: [] as string[] }

  const dbStart = Date.now()
  try {
    await prisma.$queryRaw`SELECT 1`
    result.database = true
    result.dbLatency = Date.now() - dbStart
  } catch (e) {
    result.errors.push('DB: ' + (e instanceof Error ? e.message : 'Unknown'))
  }

  const hasSupabase = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
  result.storageConfigured = hasSupabase

  if (hasSupabase) {
    try {
      const { getSupabaseAdmin, STORAGE_BUCKET } = await import('@/lib/supabase')
      const sb = getSupabaseAdmin()
      const { error } = await sb.storage.getBucket(STORAGE_BUCKET)
      result.storage = !error
      if (error) result.errors.push('Storage bucket: ' + error.message)
    } catch (e) {
      result.errors.push('Storage: ' + (e instanceof Error ? e.message : String(e)))
    }
  } else {
    result.storage = true // local fs used
  }

  return NextResponse.json(result)
}
