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
    const slide = await prisma.carouselSlide.update({
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
    await prisma.$disconnect();
    return NextResponse.json(slide);
  } catch (error) {
    console.error('Error updating carousel slide:', error);
    await prisma.$disconnect();
    return NextResponse.json({ error: 'Error al actualizar slide' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const prisma = getWriteClient();
  try {
    const { id } = await params;
    await prisma.carouselSlide.delete({ where: { id } });
    await prisma.$disconnect();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting carousel slide:', error);
    await prisma.$disconnect();
    return NextResponse.json({ error: 'Error al eliminar slide' }, { status: 500 });
  }
}
