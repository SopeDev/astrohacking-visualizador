import { NextResponse } from 'next/server'
import { createClient as createSupabaseMiddlewareClient } from '@/utils/supabase/middleware'
import { checkAdminBasicAuthHeader } from '@/lib/adminBasicAuth'

function unauthorized() {
  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Astrohacking Admin"' },
  })
}

export async function proxy(request) {
  const { pathname } = request.nextUrl
  const { supabase, response } = createSupabaseMiddlewareClient(request)
  const isPublicShareRoute = pathname === '/p' || pathname.startsWith('/p/')

  // Refreshes auth cookies/session when Supabase auth is used.
  if (supabase) {
    await supabase.auth.getUser()
  }

  if (!isPublicShareRoute) {
    const auth = checkAdminBasicAuthHeader(request.headers.get('authorization'))
    if (!auth.ok) {
      if (auth.status === 503) {
        return new NextResponse(auth.message, { status: 503 })
      }
      return unauthorized()
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
