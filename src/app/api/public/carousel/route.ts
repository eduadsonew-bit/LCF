import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const slides = await db.carouselSlide.findMany({
      where: {
        active: true,
      },
      orderBy: {
        order: 'asc',
      },
    });
    return NextResponse.json(slides);
  } catch (error) {
    console.error('Error fetching carousel:', error);
    return NextResponse.json({ error: 'Error al obtener carrusel' }, { status: 500 });
  }
}
