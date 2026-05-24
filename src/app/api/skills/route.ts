import { NextResponse } from 'next/server';
import { supabasePublic, supabaseAdmin } from '@/lib/supabase';
import { verifySessionToken } from '@/lib/auth';

// 1. GET - Fetch all skills
export async function GET() {
    if (!supabasePublic) {
        return NextResponse.json({ error: 'Supabase URL or Anon Key is missing' }, { status: 500 });
    }
    
    try {
        const { data, error } = await supabasePublic
            .from('skills')
            .select('*')
            .order('name', { ascending: true });
            
        if (error) throw error;
        return NextResponse.json({ data });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// 2. POST - Add a new skill
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
        const { name, category } = body;
        
        if (!name || !category) {
            return NextResponse.json({ error: 'Name and category are required' }, { status: 400 });
        }
        
        // Clean name to uppercase to fit visual design style
        const cleanName = name.trim().toUpperCase();
        
        const { data, error } = await supabaseAdmin
            .from('skills')
            .insert([{ name: cleanName, category }])
            .select()
            .single();
            
        if (error) throw error;
        return NextResponse.json({ success: true, data });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
