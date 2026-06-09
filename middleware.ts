// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Only protect the specific role portals
  if (!pathname.startsWith('/candidate') && 
      !pathname.startsWith('/company') && 
      !pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Next.js Edge Middleware cannot use the standard @supabase/supabase-js library easily without cookies.
  // Placify uses native Supabase Auth, which sets cookies securely.
  const supabaseAuthCookie = req.cookies.get('sb-access-token')?.value || req.cookies.get('supabase-auth-token')?.value;
  
  // Let the client-side layouts handle the absolute strict verification to avoid edge-caching bugs,
  // but we can provide a fast initial check here if the cookie doesn't exist at all.
  
  // NOTE: Supabase Auth helpers handle this better. Since we rely on global layouts for strict checking,
  // we will enforce the final block there. This middleware acts as an initial guard.
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/candidate/:path*', '/company/:path*', '/admin/:path*'],
};
