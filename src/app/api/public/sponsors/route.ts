import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const sponsors = await db.sponsor.findMany({
      where: {
        active: true,
      },
      orderBy: {
        order: 'asc',
      },
    });
    return NextResponse.json(sponsors);
  } catch (error) {
    console.error('Error fetching sponsors:', error);
    return NextResponse.json({ error: 'Error al obtener patrocinadores' }, { status: 500 });
  }
}
