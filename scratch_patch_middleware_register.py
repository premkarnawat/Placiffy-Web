# -*- coding: utf-8 -*-
with open(r"middleware.ts", "r", encoding="utf-8") as f:
    content = f.read()

import re

new_middleware = """// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Registration routes MUST be public
  if (pathname.endsWith('/register')) {
    return NextResponse.next();
  }

  // Public routes bypass middleware
  if (!pathname.startsWith('/candidate') && 
      !pathname.startsWith('/company') && 
      !pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Edge-level Session Validation
  const cookies = req.cookies.getAll();
  const hasAuthCookie = cookies.some(c => c.name.startsWith('sb-') && c.name.endsWith('-auth-token'));
  
  if (!hasAuthCookie) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/candidate/:path*', '/company/:path*', '/admin/:path*'],
};
"""

with open("middleware.ts", "w", encoding="utf-8") as f:
    f.write(new_middleware)

print("Patched middleware.ts to allow public access to /register routes!")
