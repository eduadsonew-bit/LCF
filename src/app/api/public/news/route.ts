import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const news = await db.news.findMany({
      where: {
        published: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
    });
    return NextResponse.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Error al obtener noticias' }, { status: 500 });
  }
}
