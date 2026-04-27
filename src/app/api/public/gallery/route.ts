import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const items = await db.galleryItem.findMany({
      where: {
        active: true,
      },
      orderBy: {
        order: 'asc',
      },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json({ error: 'Error al obtener galería' }, { status: 500 });
  }
}
