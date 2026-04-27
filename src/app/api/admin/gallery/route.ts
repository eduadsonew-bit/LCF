import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const item = await db.galleryItem.create({
      data: {
        title: data.title,
        description: data.description,
        image: data.image,
        category: data.category,
        order: data.order || 0,
        active: data.active ?? true,
      },
    });
    return NextResponse.json(item);
  } catch (error) {
    console.error('Error creating gallery item:', error);
    return NextResponse.json({ error: 'Error al crear item de galería' }, { status: 500 });
  }
}
