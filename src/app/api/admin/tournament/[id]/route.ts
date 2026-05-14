import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const tournament = await db.tournament.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        status: data.status,
        category: data.category,
        image: data.image,
        order: data.order != null && data.order >= 1 ? data.order : undefined,
      },
    });
    return NextResponse.json(tournament);
  } catch (error) {
    console.error('Error updating tournament:', error);
    return NextResponse.json({ error: 'Error al actualizar torneo' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.tournament.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting tournament:', error);
    return NextResponse.json({ error: 'Error al eliminar torneo' }, { status: 500 });
  }
}
