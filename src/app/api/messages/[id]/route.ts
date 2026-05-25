import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifySessionToken } from '@/lib/auth';

async function guard(request: Request) {
    const sessionCookie = request.headers.get('cookie')
        ?.split(';')
        .find(c => c.trim().startsWith('admin_session='))
        ?.split('=')[1];
    return verifySessionToken(sessionCookie);
}

// PATCH — mark a message as read
export async function PATCH(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    if (!(await guard(request))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!supabaseAdmin) {
        return NextResponse.json({ error: 'Supabase admin client uninitialized' }, { status: 500 });
    }
    try {
        const { error } = await supabaseAdmin
            .from('messages')
            .update({ read: true })
            .eq('id', id);
        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// DELETE — delete a message
export async function DELETE(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    if (!(await guard(request))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!supabaseAdmin) {
        return NextResponse.json({ error: 'Supabase admin client uninitialized' }, { status: 500 });
    }
    try {
        const { error } = await supabaseAdmin
            .from('messages')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
