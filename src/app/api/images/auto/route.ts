import { NextResponse } from 'next/server';
import { fetchWikipediaImage } from '@/lib/wikiImage';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');

  if (!name) {
    return NextResponse.json({ success: false, message: 'Name is required' }, { status: 400 });
  }

  try {
    const imageUrl = await fetchWikipediaImage(name);
    return NextResponse.json({ success: true, url: imageUrl });
  } catch (error) {
    console.error('Error fetching auto image:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
