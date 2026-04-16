import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

export const createClient = async (cookieStore) => {
  const resolvedCookieStore = cookieStore ?? (await cookies())
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY')
  }

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return resolvedCookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            resolvedCookieStore.set(name, value, options)
          })
        } catch {
          // Can fail in Server Components; middleware will refresh sessions.
        }
      },
    },
  })
}
