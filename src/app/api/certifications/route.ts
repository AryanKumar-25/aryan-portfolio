import { NextResponse } from 'next/server';
import { supabasePublic, supabaseAdmin } from '@/lib/supabase';
import { verifySessionToken } from '@/lib/auth';

// 1. GET - Fetch all certifications
export async function GET() {
    if (!supabasePublic) {
        return NextResponse.json({ error: 'Supabase URL or Anon Key is missing' }, { status: 500 });
    }
    
    try {
        const { data, error } = await supabasePublic
            .from('certifications')
            .select('*')
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        
        // Map database columns to client fields
        const mappedData = data ? data.map((c: any) => ({
            ...c,
            url: c.credential_url || c.url || '',
            badge_image_url: c.badge_image_url || c.badge_image || ''
        })) : [];
        
        return NextResponse.json({ data: mappedData });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// 2. POST - Add a new certification (requires admin authentication)
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
        const { name, issuer, date, url, badge_image_url } = body;
        
        if (!name || !issuer || !date) {
            return NextResponse.json({ error: 'Name, issuer, and date are required' }, { status: 400 });
        }
        
        const { data, error } = await supabaseAdmin
            .from('certifications')
            .insert([{
                name,
                issuer,
                date,
                credential_url: url || '',
                url: url || '',
                badge_image_url: badge_image_url || ''
            }])
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
