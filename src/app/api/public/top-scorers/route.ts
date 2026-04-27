import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const scorers = await db.topScorer.findMany({
      where: { active: true },
      orderBy: [{ category: 'asc' }, { goals: 'desc' }],
    });
    return NextResponse.json(scorers);
  } catch (error) {
    console.error('Error fetching top scorers:', error);
    return NextResponse.json({ error: 'Error al obtener goleadores' }, { status: 500 });
  }
}
