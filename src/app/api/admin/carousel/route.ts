import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const slide = await db.carouselSlide.create({
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
    return NextResponse.json(slide);
  } catch (error) {
    console.error('Error creating carousel slide:', error);
    return NextResponse.json({ error: 'Error al crear slide' }, { status: 500 });
  }
}
