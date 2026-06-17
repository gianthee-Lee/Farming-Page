import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { fetchWikipediaImage } from '@/lib/wikiImage';

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const id = parseInt(params.id, 10);
    const data = await request.json();

    let imageUrl = data.image;
    if ((!imageUrl || imageUrl.trim() === '') && data.autoFetchImage === true) {
      imageUrl = await fetchWikipediaImage(data.name);
    }

    const crop = await prisma.crop.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        image: imageUrl,
        isAvailable: data.isAvailable,
      },
    });

    return NextResponse.json({ success: true, data: crop });
  } catch (error) {
    console.error('Error updating crop:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const id = parseInt(params.id, 10);
    await prisma.crop.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting crop:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
