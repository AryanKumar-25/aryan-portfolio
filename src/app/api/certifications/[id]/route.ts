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

// 1. PUT - Update certification (requires admin authentication)
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
        const { name, issuer, date, url, badge_image_url } = body;
        
        const { data, error } = await supabaseAdmin
            .from('certifications')
            .update({ 
                name, 
                issuer, 
                date, 
                credential_url: url || '',
                url: url || '',
                badge_image_url: badge_image_url || '' 
            })
            .eq('id', id)
            .select()
            .single();
            
        if (error) throw error;
        
        const mappedData = data ? {
            ...data,
            url: data.credential_url || data.url || '',
            badge_image_url: data.badge_image_url || data.badge_image || ''
        } : null;
        
        return NextResponse.json({ success: true, data: mappedData });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// 2. DELETE - Delete certification (requires admin authentication)
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
            .from('certifications')
            .delete()
            .eq('id', id);
            
        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
