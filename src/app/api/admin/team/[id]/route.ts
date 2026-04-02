import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// PUT update team
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, logo, city, category } = body;

    if (!name) {
      return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 });
    }

    const team = await db.team.update({
      where: { id },
      data: {
        name,
        logo: logo || null,
        city: city || null,
        category: category || null,
      },
    });

    return NextResponse.json(team);
  } catch (error) {
    console.error('Error updating team:', error);
    return NextResponse.json({ error: 'Error al actualizar equipo' }, { status: 500 });
  }
}

// DELETE team
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.team.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting team:', error);
    return NextResponse.json({ error: 'Error al eliminar equipo' }, { status: 500 });
  }
}
