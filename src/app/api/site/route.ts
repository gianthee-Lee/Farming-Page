import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let siteInfo = await prisma.siteInfo.findUnique({
      where: { id: 1 },
    });

    if (!siteInfo) {
      siteInfo = await prisma.siteInfo.create({
        data: {
          id: 1,
        },
      });
    }

    let parsedCabinImages = [];
    try {
      parsedCabinImages = JSON.parse(siteInfo.cabinImages);
    } catch (e) {}

    if (parsedCabinImages.length === 0 && siteInfo.cabinImage) {
      parsedCabinImages = [siteInfo.cabinImage];
    }

    return NextResponse.json({ success: true, data: { ...siteInfo, cabinImages: parsedCabinImages } });
  } catch (error) {
    console.error('Error fetching site info:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const cabinImagesString = Array.isArray(data.cabinImages) ? JSON.stringify(data.cabinImages) : '[]';

    const siteInfo = await prisma.siteInfo.upsert({
      where: { id: 1 },
      update: {
        farmName: data.farmName,
        farmIntro: data.farmIntro,
        heroNotice: data.heroNotice,
        cartName: data.cartName,
        farmImage: data.farmImage,
        cabinIntro: data.cabinIntro,
        cabinImage: data.cabinImage,
        cabinImages: cabinImagesString,
        phoneNumber: data.phoneNumber,
        kakaoLink: data.kakaoLink,
        address: data.address,
      },
      create: {
        id: 1,
        farmName: data.farmName,
        farmIntro: data.farmIntro,
        heroNotice: data.heroNotice,
        cartName: data.cartName,
        farmImage: data.farmImage,
        cabinIntro: data.cabinIntro,
        cabinImage: data.cabinImage,
        cabinImages: cabinImagesString,
        phoneNumber: data.phoneNumber,
        kakaoLink: data.kakaoLink,
        address: data.address,
      },
    });

    let parsedCabinImages = [];
    try {
      parsedCabinImages = JSON.parse(siteInfo.cabinImages);
    } catch (e) {}

    return NextResponse.json({ success: true, data: { ...siteInfo, cabinImages: parsedCabinImages } });
  } catch (error) {
    console.error('Error updating site info:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
