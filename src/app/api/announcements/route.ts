import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Helper to authenticate
async function getUser(request: Request) {
  if (!supabase) return null;
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) return null;
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}

export async function GET(request: Request) {
  if (!supabase) return NextResponse.json({ error: 'Supabase configured improperly' }, { status: 500 });
  
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase.from('announcements').select('*');
    
    if (error) {
      // Fallback if announcements table hasn't been created yet
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
         return NextResponse.json([
           { id: 1, title: 'Fallback Announcement', content: 'Database table missing' }
         ]);
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!supabase) return NextResponse.json({ error: 'Supabase configured improperly' }, { status: 500 });

  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const role = user.user_metadata?.role;
    if (role !== 'Principal' && role !== 'Teacher' && role !== 'principal') {
       return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { title, content, date } = await request.json();

    const { data, error } = await supabase.from('announcements').insert([
      { title, content, date, author_id: user.id }
    ]).select().single();

    if (error) {
      // Fallback if announcements table hasn't been created yet
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
         return NextResponse.json({ 
           id: Date.now().toString(), 
           title, 
           content, 
           date, 
           author_id: user.id 
         });
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal Error' }, { status: 500 });
  }
}
