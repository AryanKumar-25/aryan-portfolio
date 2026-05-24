import { NextResponse } from 'next/server';
import { supabasePublic, supabaseAdmin } from '@/lib/supabase';
import { verifySessionToken } from '@/lib/auth';

// 1. GET - Fetch all experience
export async function GET() {
    if (!supabasePublic) {
        return NextResponse.json({ error: 'Supabase URL or Anon Key is missing' }, { status: 500 });
    }
    
    try {
        const { data, error } = await supabasePublic
            .from('experience')
            .select('*')
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        return NextResponse.json({ data });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// 2. POST - Create a new experience
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
        return NextResponse.json({ error: 'Supabase Service Role Key is missing' }, { status: 500 });
    }
    
    try {
        const body = await request.json();
        const { role, company, period, description, type } = body;
        
        if (!role || !company || !period || !description || !type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        
        if (type !== 'Work' && type !== 'Education') {
            return NextResponse.json({ error: 'Invalid type (must be Work or Education)' }, { status: 400 });
        }
        
        const { data, error } = await supabaseAdmin
            .from('experience')
            .insert([{ role, company, period, description, type }])
            .select()
            .single();
            
        if (error) throw error;
        return NextResponse.json({ success: true, data });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
