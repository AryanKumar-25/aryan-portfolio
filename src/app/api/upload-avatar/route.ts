import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifySessionToken } from '@/lib/auth';

export async function POST(request: Request) {
    // Auth guard
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

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate image type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
        }

        // Convert to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Always overwrite with the same filename so old URLs stay short
        const extension = file.name.split('.').pop() || 'jpg';
        const filename = `profile.${extension}`;

        // Upload (upsert) to avatars bucket
        const { error: uploadError } = await supabaseAdmin.storage
            .from('avatars')
            .upload(filename, buffer, {
                contentType: file.type,
                upsert: true,
                duplex: 'half'
            });

        if (uploadError) throw uploadError;

        // Get the public URL — append a cache-bust so the browser reloads it
        const { data: { publicUrl } } = supabaseAdmin.storage
            .from('avatars')
            .getPublicUrl(filename);

        const cacheBustedUrl = `${publicUrl}?t=${Date.now()}`;

        // Save to site_config table
        const { error: configError } = await supabaseAdmin
            .from('site_config')
            .upsert({ key: 'avatar_url', value: cacheBustedUrl }, { onConflict: 'key' });

        if (configError) throw configError;

        return NextResponse.json({ success: true, url: cacheBustedUrl });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
