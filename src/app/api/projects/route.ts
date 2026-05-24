import { NextResponse } from 'next/server';
import { supabasePublic, supabaseAdmin } from '@/lib/supabase';
import { verifySessionToken } from '@/lib/auth';

// 1. GET - Fetch all projects
export async function GET() {
    if (!supabasePublic) {
        return NextResponse.json({ error: 'Supabase URL or Anon Key is missing' }, { status: 500 });
    }
    
    try {
        const { data, error } = await supabasePublic
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        
        // Map database stack array to client-side comma separated string
        const mappedData = data ? data.map((p: any) => ({
            ...p,
            tech_stack: p.stack ? p.stack.join(', ') : (p.tech_stack || '')
        })) : [];
        
        return NextResponse.json({ data: mappedData });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// 2. POST - Create a new project (requires admin authentication)
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
        const { title, description, tech_stack, github_url, live_url, featured } = body;
        
        if (!title || !description) {
            return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
        }
        
        // Convert comma-separated string into string array for database stack column
        const stackArray = tech_stack 
            ? tech_stack.split(',').map((s: string) => s.trim()).filter(Boolean) 
            : [];
            
        const { data, error } = await supabaseAdmin
            .from('projects')
            .insert([{
                title,
                description,
                stack: stackArray,
                github_url: github_url || '',
                live_url: live_url || '',
                featured: !!featured
            }])
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
