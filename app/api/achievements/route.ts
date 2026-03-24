import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const achievements = await prisma.achievement.findMany({ orderBy: { order: 'asc' } })
    return NextResponse.json(achievements)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const data = await req.json()
    const achievement = await prisma.achievement.create({ data })
    return NextResponse.json(achievement)
  } catch {
    return NextResponse.json({ error: 'Failed to create achievement' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const data = await req.json()
    const { id, ...rest } = data
    const achievement = await prisma.achievement.update({ where: { id }, data: rest })
    return NextResponse.json(achievement)
  } catch {
    return NextResponse.json({ error: 'Failed to update achievement' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id } = await req.json()
    await prisma.achievement.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete achievement' }, { status: 500 })
  }
}
