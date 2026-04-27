import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const cards = await db.infoCard.findMany({
      where: {
        active: true,
      },
      orderBy: {
        order: 'asc',
      },
    });
    return NextResponse.json(cards);
  } catch (error) {
    console.error('Error fetching info cards:', error);
    return NextResponse.json({ error: 'Error al obtener tarjetas de información' }, { status: 500 });
  }
}
