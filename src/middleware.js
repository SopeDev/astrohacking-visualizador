import { NextResponse } from 'next/server'
import { createClient as createSupabaseMiddlewareClient } from '@/utils/supabase/middleware'

function unauthorized() {
  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Astrohacking Admin"' },
  })
}

function checkAdminBasicAuth(request) {
  const user = process.env.ADMIN_BASIC_USER
  const pass = process.env.ADMIN_BASIC_PASSWORD
  if (!user || !pass) {
    return {
      ok: false,
      status: 503,
      message: 'Set ADMIN_BASIC_USER and ADMIN_BASIC_PASSWORD in the environment.',
    }
  }

  const header = request.headers.get('authorization')
  if (!header?.startsWith('Basic ')) {
    return { ok: false, status: 401 }
  }

  let decoded
  try {
    decoded = atob(header.slice(6))
  } catch {
    return { ok: false, status: 401 }
  }

  const sep = decoded.indexOf(':')
  const u = decoded.slice(0, sep)
  const p = decoded.slice(sep + 1)
  return { ok: u === user && p === pass, status: 401 }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl
  const { supabase, response } = createSupabaseMiddlewareClient(request)
  const isPublicShareRoute = pathname === '/p' || pathname.startsWith('/p/')

  // Refreshes auth cookies/session when Supabase auth is used.
  if (supabase) {
    await supabase.auth.getUser()
  }

  if (!isPublicShareRoute) {
    const auth = checkAdminBasicAuth(request)
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
