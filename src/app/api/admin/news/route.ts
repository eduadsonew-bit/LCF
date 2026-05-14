import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET all news (including drafts) for admin panel
export async function GET() {
  try {
    const news = await db.news.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(news);
  } catch (error) {
    console.error('Error fetching all news:', error);
    return NextResponse.json({ error: 'Error al obtener noticias' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const news = await db.news.create({
      data: {
        title: data.title,
        content: data.content,
        summary: data.summary,
        image: data.image,
        author: data.author,
        published: data.published || false,
        featured: data.featured || false,
        publishedAt: data.published ? new Date() : null,
        order: data.order || 1,
      },
    });
    return NextResponse.json(news);
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json({ error: 'Error al crear noticia' }, { status: 500 });
  }
}
