import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const files = await db.statisticsFile.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(files);
  } catch (error) {
    console.error('Error fetching statistics files:', error);
    return NextResponse.json({ error: 'Error al obtener archivos' }, { status: 500 });
  }
}
