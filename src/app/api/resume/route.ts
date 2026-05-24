import { NextResponse } from 'next/server';
import { supabasePublic, supabaseAdmin } from '@/lib/supabase';
import { verifySessionToken } from '@/lib/auth';

// 1. GET - Fetch latest resume
export async function GET() {
    if (!supabasePublic) {
        return NextResponse.json({ error: 'Supabase public client uninitialized' }, { status: 500 });
    }
    
    try {
        const { data, error } = await supabasePublic
            .from('resume')
            .select('*')
            .order('uploaded_at', { ascending: false })
            .limit(1);
            
        if (error) throw error;
        
        const resumeItem = data && data.length > 0 ? data[0] : null;
        return NextResponse.json({ data: resumeItem });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// 2. POST - Insert a new resume record (requires admin authentication)
export async function POST(request: Request) {
    const sessionCookie = request.headers.get('cookie')
        ?.split(';')
        .find(c => c.trim().startsWith('admin_session='))
        ?.split('=')[1];
        
    const isSessionValid = await verifySessionToken(sessionCookie);
    if (!isSessionValid) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!supabaseAdmin) {
        return NextResponse.json({ error: 'Supabase admin client uninitialized' }, { status: 500 });
    }
    
    try {
        const body = await request.json();
        const { file_url } = body;
        
        if (!file_url) {
            return NextResponse.json({ error: 'file_url is required' }, { status: 400 });
        }
        
        // Insert the new resume link
        const { data, error } = await supabaseAdmin
            .from('resume')
            .insert([{ 
                file_url, 
                uploaded_at: new Date().toISOString() 
            }])
            .select()
            .single();
            
        if (error) throw error;
        return NextResponse.json({ success: true, data });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
