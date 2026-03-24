import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendContactEmail } from '@/lib/email'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const messages = await prisma.message.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(messages)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // Save to DB
    const saved = await prisma.message.create({ data: { name, email, message } })

    // Send email (non-blocking — don't fail if email fails)
    try {
      await sendContactEmail({ name, email, message })
    } catch (emailErr) {
      console.error('Email send failed:', emailErr)
    }

    return NextResponse.json({ success: true, id: saved.id })
  } catch {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id, isRead } = await req.json()
    const msg = await prisma.message.update({ where: { id }, data: { isRead } })
    return NextResponse.json(msg)
  } catch {
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id } = await req.json()
    await prisma.message.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 })
  }
}
