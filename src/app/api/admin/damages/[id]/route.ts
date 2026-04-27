import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

// DELETE - Eliminar (arreglar) un daño
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.pageDamage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting damage:', error);
    return NextResponse.json({ error: 'Error al eliminar daño' }, { status: 500 });
  }
}
