import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifySessionToken } from '@/lib/auth';

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
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const bucket = formData.get('bucket') as string; // 'certificates' or 'resume'
        
        if (!file || !bucket) {
            return NextResponse.json({ error: 'File and bucket are required' }, { status: 400 });
        }
        
        // Convert file to arrayBuffer and then Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Generate a unique filename to prevent overwrites
        const extension = file.name.split('.').pop();
        const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${extension}`;
        
        // Upload to Supabase Storage using service role client
        const { error } = await supabaseAdmin.storage
            .from(bucket)
            .upload(filename, buffer, {
                contentType: file.type,
                duplex: 'half'
            });
            
        if (error) throw error;
        
        // Get public URL
        const { data: { publicUrl } } = supabaseAdmin.storage
            .from(bucket)
            .getPublicUrl(filename);
            
        return NextResponse.json({ success: true, url: publicUrl, filename: file.name });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
