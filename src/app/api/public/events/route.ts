import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const events = await db.event.findMany({
      orderBy: {
        date: 'asc',
      },
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Error al obtener eventos' }, { status: 500 });
  }
}
