import { NextResponse } from 'next/server';
import { supabasePublic } from '@/lib/supabase';

export async function POST(request: Request) {
    if (!supabasePublic) {
        return NextResponse.json({ error: 'Supabase client uninitialized' }, { status: 500 });
    }

    try {
        const { name, email, message } = await request.json();

        if (!name?.trim() || !email?.trim() || !message?.trim()) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const { error } = await supabasePublic
            .from('messages')
            .insert([{ name: name.trim(), email: email.trim(), message: message.trim() }]);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
