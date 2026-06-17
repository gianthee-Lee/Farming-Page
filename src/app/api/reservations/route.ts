import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // data: { customerName, phoneNumber, items: [{ cropId, quantity }] }
    const reservation = await prisma.reservation.create({
      data: {
        customerName: data.customerName,
        phoneNumber: data.phoneNumber,
        items: {
          create: data.items.map((item: any) => ({
            cropId: item.cropId,
            quantity: item.quantity,
          }))
        }
      },
      include: {
        items: true
      }
    });

    return NextResponse.json({ success: true, data: reservation });
  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const reservations = await prisma.reservation.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            crop: true
          }
        }
      }
    });
    return NextResponse.json({ success: true, data: reservations });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
