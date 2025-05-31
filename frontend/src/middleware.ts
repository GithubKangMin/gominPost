import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 보호된 라우트 체크
    if (pathname.startsWith('/profile') || pathname.startsWith('/dashboard')) {
        const token = request.cookies.get('access_token');
        
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // 응답 수정
    const response = NextResponse.next();

    // CORS 헤더 설정
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return response;
}

export const config = {
    matcher: [
        '/profile/:path*',
        '/dashboard/:path*',
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}; 