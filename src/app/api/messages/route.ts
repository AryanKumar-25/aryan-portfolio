import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifySessionToken } from '@/lib/auth';

// ── Auth guard ───────────────────────────────────────────────────────────────
async function guard(request: Request) {
    const sessionCookie = request.headers.get('cookie')
        ?.split(';')
        .find(c => c.trim().startsWith('admin_session='))
        ?.split('=')[1];
    return verifySessionToken(sessionCookie);
}

// GET — fetch all messages ordered newest first
export async function GET(request: Request) {
    if (!(await guard(request))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!supabaseAdmin) {
        return NextResponse.json({ error: 'Supabase admin client uninitialized' }, { status: 500 });
    }
    try {
        const { data, error } = await supabaseAdmin
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return NextResponse.json({ data });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
