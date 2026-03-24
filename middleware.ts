import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Allow authenticated users to access /admin/dashboard
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Only protect /admin/dashboard — login page stays public
        if (req.nextUrl.pathname.startsWith('/admin/dashboard')) {
          return !!token
        }
        return true
      },
    },
    pages: {
      signIn: '/admin',
    },
  }
)

export const config = {
  matcher: ['/admin/dashboard/:path*'],
}
