import { NextRequest, NextResponse } from 'next/server';
import { getWriteClient } from '@/lib/db-write';

export async function POST(request: NextRequest) {
  const prisma = getWriteClient();
  try {
    const data = await request.json();
    const news = await prisma.news.create({
      data: {
        title: data.title,
        content: data.content,
        summary: data.summary,
        image: data.image,
        author: data.author,
        published: data.published || false,
        featured: data.featured || false,
        publishedAt: data.published ? new Date() : null,
      },
    });
    await prisma.$disconnect();
    return NextResponse.json(news);
  } catch (error) {
    console.error('Error creating news:', error);
    await prisma.$disconnect();
    return NextResponse.json({ error: 'Error al crear noticia' }, { status: 500 });
  }
}
