import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const protectedRoutes = ['/products', '/cart'];

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value;
  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // No token — redirect protected routes to login
  if (!token) {
    if (isProtected) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname + request.nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Token exists — validate it before letting the request through
  if (isProtected && API_URL) {
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const response = NextResponse.redirect(new URL('/auth/login', request.url));
        response.cookies.delete('authToken');
        return response;
      }
    } catch {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/products/:path*', '/cart/:path*'],
};
