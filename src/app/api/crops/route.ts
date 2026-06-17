import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { fetchWikipediaImage } from '@/lib/wikiImage';

export async function GET() {
  try {
    const crops = await prisma.crop.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: crops });
  } catch (error) {
    console.error('Error fetching crops:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    let imageUrl = data.image;
    if ((!imageUrl || imageUrl.trim() === '') && data.autoFetchImage !== false) {
      imageUrl = await fetchWikipediaImage(data.name);
    }

    const crop = await prisma.crop.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        image: imageUrl,
        isAvailable: data.isAvailable ?? true,
      },
    });
    return NextResponse.json({ success: true, data: crop });
  } catch (error) {
    console.error('Error creating crop:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
