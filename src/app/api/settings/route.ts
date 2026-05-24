import { NextResponse } from 'next/server';
import { supabasePublic, supabaseAdmin } from '@/lib/supabase';
import { verifySessionToken } from '@/lib/auth';

// 1. GET - Fetch site configurations
export async function GET() {
    if (!supabasePublic) {
        return NextResponse.json({ error: 'Supabase public client uninitialized' }, { status: 500 });
    }
    
    try {
        const { data, error } = await supabasePublic
            .from('site_config')
            .select('*');
            
        if (error) throw error;
        
        // Convert to key-value record for ease of client consumption
        const config: Record<string, string> = {};
        if (data) {
            data.forEach((row: any) => {
                config[row.key] = row.value;
            });
        }
        return NextResponse.json({ data: config });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// 2. POST - Save or update configurations (requires admin authentication)
export async function POST(request: Request) {
    const sessionCookie = request.headers.get('cookie')
        ?.split(';')
        .find(c => c.trim().startsWith('admin_session='))
        ?.split('=')[1];
        
    const isSessionValid = await verifySessionToken(sessionCookie);
    if (!isSessionValid) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const client = supabaseAdmin;
    if (!client) {
        return NextResponse.json({ error: 'Supabase admin client uninitialized' }, { status: 500 });
    }
    
    try {
        const body = await request.json(); // Object structure e.g., { email: '...', tagline: '...', available: 'true' }
        
        const promises = Object.entries(body).map(async ([key, value]) => {
            const { error } = await client
                .from('site_config')
                .upsert({ key, value: String(value) }, { onConflict: 'key' });
                
            if (error) throw error;
        });
        
        await Promise.all(promises);
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
