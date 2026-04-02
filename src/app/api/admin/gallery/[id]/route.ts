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
    const item = await prisma.galleryItem.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        image: data.image,
        category: data.category,
        order: data.order,
        active: data.active,
      },
    });
    await prisma.$disconnect();
    return NextResponse.json(item);
  } catch (error) {
    console.error('Error updating gallery item:', error);
    await prisma.$disconnect();
    return NextResponse.json({ error: 'Error al actualizar item de galería' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const prisma = getWriteClient();
  try {
    const { id } = await params;
    await prisma.galleryItem.delete({ where: { id } });
    await prisma.$disconnect();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    await prisma.$disconnect();
    return NextResponse.json({ error: 'Error al eliminar item de galería' }, { status: 500 });
  }
}
