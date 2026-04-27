import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const resolutions = await db.resolution.findMany({
      where: { active: true },
      orderBy: { date: 'desc' },
    });
    return NextResponse.json(resolutions);
  } catch (error) {
    console.error('Error fetching resolutions:', error);
    return NextResponse.json({ error: 'Error al obtener resoluciones' }, { status: 500 });
  }
}
