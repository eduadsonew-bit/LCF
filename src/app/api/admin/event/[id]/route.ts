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
    const event = await prisma.event.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        date: data.date ? new Date(data.date) : null,
        location: data.location,
        image: data.image,
        eventType: data.eventType,
      },
    });
    await prisma.$disconnect();
    return NextResponse.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    await prisma.$disconnect();
    return NextResponse.json({ error: 'Error al actualizar evento' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const prisma = getWriteClient();
  try {
    const { id } = await params;
    await prisma.event.delete({ where: { id } });
    await prisma.$disconnect();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    await prisma.$disconnect();
    return NextResponse.json({ error: 'Error al eliminar evento' }, { status: 500 });
  }
}
