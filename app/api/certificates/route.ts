import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const certs = await prisma.certificate.findMany({ orderBy: { order: 'asc' } })
    return NextResponse.json(certs)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch certificates' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const data = await req.json()
    const cert = await prisma.certificate.create({ data })
    return NextResponse.json(cert)
  } catch {
    return NextResponse.json({ error: 'Failed to create certificate' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const data = await req.json()
    const { id, ...rest } = data
    const cert = await prisma.certificate.update({ where: { id }, data: rest })
    return NextResponse.json(cert)
  } catch {
    return NextResponse.json({ error: 'Failed to update certificate' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id } = await req.json()
    await prisma.certificate.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete certificate' }, { status: 500 })
  }
}
