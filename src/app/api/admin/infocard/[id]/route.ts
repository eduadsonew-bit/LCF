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
    const card = await prisma.infoCard.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        image: data.image,
        icon: data.icon,
        link: data.link,
        linkText: data.linkText,
        color: data.color,
        order: data.order ? parseInt(data.order) : 0,
        active: data.active,
      },
    });
    await prisma.$disconnect();
    return NextResponse.json(card);
  } catch (error) {
    console.error('Error updating info card:', error);
    await prisma.$disconnect();
    return NextResponse.json({ error: 'Error al actualizar tarjeta' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const prisma = getWriteClient();
  try {
    const { id } = await params;
    await prisma.infoCard.delete({ where: { id } });
    await prisma.$disconnect();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting info card:', error);
    await prisma.$disconnect();
    return NextResponse.json({ error: 'Error al eliminar tarjeta' }, { status: 500 });
  }
}
