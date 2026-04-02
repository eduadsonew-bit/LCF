import { NextRequest, NextResponse } from 'next/server';
import { getWriteClient } from '@/lib/db-write';

export async function POST(request: NextRequest) {
  const prisma = getWriteClient();
  try {
    const data = await request.json();
    const item = await prisma.galleryItem.create({
      data: {
        title: data.title,
        description: data.description,
        image: data.image,
        category: data.category,
        order: data.order || 0,
        active: data.active ?? true,
      },
    });
    await prisma.$disconnect();
    return NextResponse.json(item);
  } catch (error) {
    console.error('Error creating gallery item:', error);
    await prisma.$disconnect();
    return NextResponse.json({ error: 'Error al crear item de galería' }, { status: 500 });
  }
}
