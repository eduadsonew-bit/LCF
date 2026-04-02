import { NextRequest, NextResponse } from 'next/server';
import { getWriteClient } from '@/lib/db-write';

export async function POST(request: NextRequest) {
  const prisma = getWriteClient();
  try {
    const data = await request.json();
    const slide = await prisma.carouselSlide.create({
      data: {
        title: data.title,
        subtitle: data.subtitle,
        image: data.image,
        video: data.video,
        link: data.link,
        linkText: data.linkText,
        order: data.order || 0,
        active: data.active ?? true,
      },
    });
    await prisma.$disconnect();
    return NextResponse.json(slide);
  } catch (error) {
    console.error('Error creating carousel slide:', error);
    await prisma.$disconnect();
    return NextResponse.json({ error: 'Error al crear slide' }, { status: 500 });
  }
}
