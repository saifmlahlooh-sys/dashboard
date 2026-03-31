import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  if (!supabase) return NextResponse.json({ error: 'Supabase configured improperly' }, { status: 500 });
  
  try {
    const { email, password, name, role } = await request.json();
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role // Expects 'Principal' or 'Teacher' or 'Student'
        }
      }
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      message: 'User registered successfully',
      user: data.user,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Error' }, { status: 500 });
  }
}
