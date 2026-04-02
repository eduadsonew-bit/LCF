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
    const sponsor = await prisma.sponsor.update({
      where: { id },
      data: {
        name: data.name,
        logo: data.logo,
        website: data.website,
        tier: data.tier,
        active: data.active,
        order: data.order,
      },
    });
    await prisma.$disconnect();
    return NextResponse.json(sponsor);
  } catch (error) {
    console.error('Error updating sponsor:', error);
    await prisma.$disconnect();
    return NextResponse.json({ error: 'Error al actualizar patrocinador' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const prisma = getWriteClient();
  try {
    const { id } = await params;
    await prisma.sponsor.delete({ where: { id } });
    await prisma.$disconnect();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting sponsor:', error);
    await prisma.$disconnect();
    return NextResponse.json({ error: 'Error al eliminar patrocinador' }, { status: 500 });
  }
}
