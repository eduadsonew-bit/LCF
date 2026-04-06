import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const matches = await db.match.findMany({
      include: {
        tournament: true,
      },
      orderBy: {
        matchDate: 'asc',
      },
    });
    return NextResponse.json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json({ error: 'Error al obtener partidos' }, { status: 500 });
  }
}
