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
    const tournament = await prisma.tournament.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        status: data.status,
        category: data.category,
        image: data.image,
      },
    });
    await prisma.$disconnect();
    return NextResponse.json(tournament);
  } catch (error) {
    console.error('Error updating tournament:', error);
    await prisma.$disconnect();
    return NextResponse.json({ error: 'Error al actualizar torneo' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const prisma = getWriteClient();
  try {
    const { id } = await params;
    await prisma.tournament.delete({ where: { id } });
    await prisma.$disconnect();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting tournament:', error);
    await prisma.$disconnect();
    return NextResponse.json({ error: 'Error al eliminar torneo' }, { status: 500 });
  }
}
