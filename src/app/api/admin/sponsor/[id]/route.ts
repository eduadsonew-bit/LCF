import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const sponsor = await db.sponsor.update({
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
    return NextResponse.json(sponsor);
  } catch (error) {
    console.error('Error updating sponsor:', error);
    return NextResponse.json({ error: 'Error al actualizar patrocinador' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.sponsor.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting sponsor:', error);
    return NextResponse.json({ error: 'Error al eliminar patrocinador' }, { status: 500 });
  }
}
