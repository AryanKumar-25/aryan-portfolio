import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifySessionToken } from '@/lib/auth';

// Helper to authenticate route requests
async function isAuthorized(request: Request): Promise<boolean> {
    const sessionCookie = request.headers.get('cookie')
        ?.split(';')
        .find(c => c.trim().startsWith('admin_session='))
        ?.split('=')[1];
    return await verifySessionToken(sessionCookie);
}

// 1. PUT - Update project (requires admin authentication)
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
        const { title, description, tech_stack, github_url, live_url, featured } = body;
        
        // Convert comma-separated string into string array for database stack column
        const stackArray = tech_stack 
            ? tech_stack.split(',').map((s: string) => s.trim()).filter(Boolean) 
            : undefined;
            
        const updatePayload: any = {
            title,
            description,
            github_url,
            live_url,
            featured: featured !== undefined ? !!featured : undefined
        };
        if (stackArray !== undefined) {
            updatePayload.stack = stackArray;
        }
        
        const { data, error } = await supabaseAdmin
            .from('projects')
            .update(updatePayload)
            .eq('id', id)
            .select()
            .single();
            
        if (error) throw error;
        
        const mappedData = data ? {
            ...data,
            tech_stack: data.stack ? data.stack.join(', ') : ''
        } : null;
        
        return NextResponse.json({ success: true, data: mappedData });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// 2. DELETE - Delete project (requires admin authentication)
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
            .from('projects')
            .delete()
            .eq('id', id);
            
        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
