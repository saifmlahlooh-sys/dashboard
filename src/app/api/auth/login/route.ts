import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  if (!supabase) return NextResponse.json({ error: 'Supabase configured improperly' }, { status: 500 });
  
  try {
    const { email, password } = await request.json();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Return the session elements carefully mapped so test-api.ts gets data.token
    return NextResponse.json({
      message: 'Login successful',
      token: data.session?.access_token,
      user: data.user,
    });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal Error' }, { status: 500 });
  }
}
