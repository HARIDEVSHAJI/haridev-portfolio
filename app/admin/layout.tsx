import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import SessionProvider from './SessionProvider'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  )
}
