import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const file = await db.matchExcelFile.findUnique({
      where: { id },
    });
    if (!file) {
      return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 });
    }
    return NextResponse.json(file);
  } catch (error) {
    console.error('Error fetching match excel file:', error);
    return NextResponse.json({ error: 'Error al obtener archivo' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existingFile = await db.matchExcelFile.findUnique({
      where: { id },
      select: { id: true }
    });

    if (!existingFile) {
      return NextResponse.json({ success: true, message: 'Archivo ya eliminado' });
    }

    await db.matchExcelFile.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting match excel file:', error);

    if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === 'P2025') {
      return NextResponse.json({ success: true, message: 'Archivo ya eliminado' });
    }

    return NextResponse.json({ error: 'Error al eliminar archivo' }, { status: 500 });
  }
}
