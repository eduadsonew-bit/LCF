import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const event = await db.event.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        date: data.date ? new Date(data.date) : null,
        location: data.location,
        image: data.image,
        eventType: data.eventType,
        order: data.order != null && data.order >= 1 ? data.order : undefined,
      },
    });
    return NextResponse.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Error al actualizar evento' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.event.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Error al eliminar evento' }, { status: 500 });
  }
}
