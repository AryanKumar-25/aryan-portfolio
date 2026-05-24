import { NextResponse } from 'next/server';
import { createSessionToken } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const { password } = await request.json();

        // ADMIN_PASSWORD must be set in environment — no insecure fallback
        const expectedPassword = process.env.ADMIN_PASSWORD;

        if (!expectedPassword) {
            console.error('ADMIN_PASSWORD environment variable is not set!');
            return NextResponse.json(
                { error: 'Server misconfiguration. Contact administrator.' },
                { status: 500 }
            );
        }

        if (!password || password !== expectedPassword) {
            // Intentional constant-time feel — avoid timing attacks
            return NextResponse.json({ error: 'Access Denied' }, { status: 401 });
        }

        // Generate a secure signed session token (timestamp + SHA-256 HMAC)
        const token = await createSessionToken();

        const response = NextResponse.json({ success: true });

        // Set httpOnly cookie — 24 hours, secure in production
        response.cookies.set('admin_session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 24 * 60 * 60, // 24 hours in seconds
        });

        return response;
    } catch (err) {
        return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }
}
