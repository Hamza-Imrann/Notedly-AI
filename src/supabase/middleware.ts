import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const isAuthRoute = ["/login", "/signup"].includes(request.nextUrl.pathname)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redirect authenticated users away from login/signup
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_BASE_URL))
  }

  return response
}

export const config = {
  matcher: ['/', '/login', '/signup'], // Only run on relevant routes
}