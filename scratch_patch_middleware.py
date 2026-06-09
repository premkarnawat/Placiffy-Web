# -*- coding: utf-8 -*-
middleware_code = """// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Public routes bypass middleware
  if (!pathname.startsWith('/candidate') && 
      !pathname.startsWith('/company') && 
      !pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Edge-level Session Validation (Phase 5 & 6)
  // Check for Supabase Auth cookies
  const cookies = req.cookies.getAll();
  const hasAuthCookie = cookies.some(c => c.name.startsWith('sb-') && c.name.endsWith('-auth-token'));
  
  if (!hasAuthCookie) {
    // Immediate edge rejection, preventing protected client bundles from loading
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  // The client-side layouts (CandidateLayout, CompanyLayout, AdminLayout)
  // now handle the strict DB-backed Role Authorization checks.
  return NextResponse.next();
}

export const config = {
  matcher: ['/candidate/:path*', '/company/:path*', '/admin/:path*'],
};
"""

with open("middleware.ts", "w", encoding="utf-8") as f:
    f.write(middleware_code)

print("Edge Middleware rewritten for strict unauthenticated redirection!")
