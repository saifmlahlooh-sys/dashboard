import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase is not configured properly.' }, { status: 500 });
  }

  // Extract API Key from headers
  const apiKey = request.headers.get('x-api-key') || request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!apiKey) {
    return NextResponse.json({ error: 'Missing API Key in headers (x-api-key)' }, { status: 401 });
  }

  // Find Website via API Key
  const { data: website, error: websiteError } = await supabase
    .from('websites')
    .select('id, name')
    .eq('api_key', apiKey)
    .single();

  if (websiteError || !website) {
    return NextResponse.json({ error: 'Invalid API Key or Website Not Found' }, { status: 403 });
  }

  // Fetch Site Data Content
  const { data: siteData, error: dataError } = await supabase
    .from('site_data')
    .select('key_name, value')
    .eq('website_id', website.id);

  if (dataError) {
    return NextResponse.json({ error: 'Data query error' }, { status: 500 });
  }
  
  // Format Array of KV into single strict object payload 
  const formattedData = siteData.reduce((acc, curr) => {
    acc[curr.key_name] = curr.value;
    return acc;
  }, {} as Record<string, string | null>);

  return NextResponse.json({
    success: true,
    website: website.name,
    dynamic_data: formattedData
  });
}
