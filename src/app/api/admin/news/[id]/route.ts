import { NextRequest, NextResponse } from 'next/server';
import { getWriteClient } from '@/lib/db-write';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const prisma = getWriteClient();
  try {
    const { id } = await params;
    const data = await request.json();
    const news = await prisma.news.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        summary: data.summary,
        image: data.image,
        author: data.author,
        published: data.published,
        featured: data.featured,
        publishedAt: data.published ? new Date() : null,
      },
    });
    await prisma.$disconnect();
    return NextResponse.json(news);
  } catch (error) {
    console.error('Error updating news:', error);
    await prisma.$disconnect();
    return NextResponse.json({ error: 'Error al actualizar noticia' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const prisma = getWriteClient();
  try {
    const { id } = await params;
    await prisma.news.delete({ where: { id } });
    await prisma.$disconnect();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting news:', error);
    await prisma.$disconnect();
    return NextResponse.json({ error: 'Error al eliminar noticia' }, { status: 500 });
  }
}
