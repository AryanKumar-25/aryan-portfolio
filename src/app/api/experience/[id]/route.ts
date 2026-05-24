import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifySessionToken } from '@/lib/auth';

async function isAuthorized(request: Request): Promise<boolean> {
    const sessionCookie = request.headers.get('cookie')
        ?.split(';')
        .find(c => c.trim().startsWith('admin_session='))
        ?.split('=')[1];
    return await verifySessionToken(sessionCookie);
}

// 1. PUT - Update experience
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    if (!(await isAuthorized(request))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!supabaseAdmin) {
        return NextResponse.json({ error: 'Supabase admin client uninitialized' }, { status: 500 });
    }
    
    try {
        const body = await request.json();
        const { role, company, period, description, type } = body;
        
        const { data, error } = await supabaseAdmin
            .from('experience')
            .update({ role, company, period, description, type })
            .eq('id', id)
            .select()
            .single();
            
        if (error) throw error;
        return NextResponse.json({ success: true, data });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// 2. DELETE - Delete experience
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    if (!(await isAuthorized(request))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!supabaseAdmin) {
        return NextResponse.json({ error: 'Supabase admin client uninitialized' }, { status: 500 });
    }
    
    try {
        const { error } = await supabaseAdmin
            .from('experience')
            .delete()
            .eq('id', id);
            
        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
