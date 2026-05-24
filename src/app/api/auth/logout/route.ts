import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json({ success: true });
    
    // Invalidate session cookie immediately
    response.cookies.set('admin_session', '', {
        httpOnly: true,
        path: '/',
        maxAge: 0 // Deletes cookie instantly
    });
    
    return response;
}

export async function GET() {
    // Also support GET for simple anchor redirections
    const response = NextResponse.redirect(new URL('/admin/login', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
    response.cookies.set('admin_session', '', {
        httpOnly: true,
        path: '/',
        maxAge: 0
    });
    return response;
}
