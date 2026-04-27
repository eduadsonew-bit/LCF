import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const slide = await db.carouselSlide.update({
      where: { id },
      data: {
        title: data.title,
        subtitle: data.subtitle,
        image: data.image,
        video: data.video,
        link: data.link,
        linkText: data.linkText,
        order: data.order,
        active: data.active,
      },
    });
    return NextResponse.json(slide);
  } catch (error) {
    console.error('Error updating carousel slide:', error);
    return NextResponse.json({ error: 'Error al actualizar slide' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.carouselSlide.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting carousel slide:', error);
    return NextResponse.json({ error: 'Error al eliminar slide' }, { status: 500 });
  }
}
