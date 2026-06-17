import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const data = await request.json();
    
    const reservation = await prisma.reservation.update({
      where: { id: Number(resolvedParams.id) },
      data: {
        status: data.status,
      }
    });

    return NextResponse.json({ success: true, data: reservation });
  } catch (error) {
    console.error('Error updating reservation:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
