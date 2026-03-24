import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const profile = await prisma.profile.findFirst()
    return NextResponse.json(profile)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await req.json()
    // Find the existing profile (seeded with a cuid, not 'default-profile')
    const existing = await prisma.profile.findFirst()
    let profile
    if (existing) {
      profile = await prisma.profile.update({
        where: { id: existing.id },
        data,
      })
    } else {
      profile = await prisma.profile.create({ data })
    }
    return NextResponse.json(profile)
  } catch {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
