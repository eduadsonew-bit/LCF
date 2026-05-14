import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const tournaments = await db.tournament.findMany({
      include: {
        matches: true,
      },
      orderBy: [
        { order: 'desc' },
        { createdAt: 'desc' },
      ],
    });
    return NextResponse.json(tournaments);
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    return NextResponse.json({ error: 'Error al obtener torneos' }, { status: 500 });
  }
}
