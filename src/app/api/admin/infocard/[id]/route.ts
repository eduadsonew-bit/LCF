import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const card = await db.infoCard.update({
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
    return NextResponse.json(card);
  } catch (error) {
    console.error('Error updating info card:', error);
    return NextResponse.json({ error: 'Error al actualizar tarjeta' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.infoCard.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting info card:', error);
    return NextResponse.json({ error: 'Error al eliminar tarjeta' }, { status: 500 });
  }
}
