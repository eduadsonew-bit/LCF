import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const news = await db.news.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(news, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Error al obtener noticias' }, { status: 500 });
  }
}
