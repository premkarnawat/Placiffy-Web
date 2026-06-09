# -*- coding: utf-8 -*-
middleware_code = """// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Pass all routing logic to the strict Layout Route Guards
  // (CandidateLayout, CompanyLayout, AdminLayout)
  // because edge middleware cannot access localStorage where Supabase JS persists sessions by default.
  return NextResponse.next();
}

export const config = {
  matcher: ['/candidate/:path*', '/company/:path*', '/admin/:path*'],
};
"""

with open("middleware.ts", "w", encoding="utf-8") as f:
    f.write(middleware_code)

print("Middleware reverted to permissive mode to allow robust Layout Guards to handle Auth securely!")
