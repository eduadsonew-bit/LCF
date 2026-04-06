import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const standings = await db.standing.findMany({
      where: { active: true },
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    });
    return NextResponse.json(standings);
  } catch (error) {
    console.error('Error fetching standings:', error);
    return NextResponse.json({ error: 'Error al obtener tabla' }, { status: 500 });
  }
}
