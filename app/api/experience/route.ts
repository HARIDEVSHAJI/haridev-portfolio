import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const items = await (prisma as any).experience.findMany({ orderBy: { order: 'asc' } })
    return NextResponse.json(items)
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const data = await req.json()
    const item = await (prisma as any).experience.create({ data })
    return NextResponse.json(item)
  } catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }) }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id, ...rest } = await req.json()
    const item = await (prisma as any).experience.update({ where: { id }, data: rest })
    return NextResponse.json(item)
  } catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }) }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id } = await req.json()
    await (prisma as any).experience.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}
