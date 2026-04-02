import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getWriteClient } from '@/lib/db-write';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const file = await db.scheduleFile.findUnique({
      where: { id },
    });
    if (!file) {
      return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 });
    }
    return NextResponse.json(file);
  } catch (error) {
    console.error('Error fetching schedule file:', error);
    return NextResponse.json({ error: 'Error al obtener archivo' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const prisma = getWriteClient();
  try {
    const { id } = await params;
    
    // Verificar si el archivo existe antes de eliminar
    const existingFile = await prisma.scheduleFile.findUnique({
      where: { id },
      select: { id: true }
    });
    
    if (!existingFile) {
      // El archivo ya no existe, retornar éxito (ya fue eliminado)
      await prisma.$disconnect();
      return NextResponse.json({ success: true, message: 'Archivo ya eliminado' });
    }
    
    await prisma.scheduleFile.delete({ where: { id } });
    await prisma.$disconnect();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting schedule file:', error);
    await prisma.$disconnect();
    
    // Manejar error específico de registro no encontrado
    if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === 'P2025') {
      return NextResponse.json({ success: true, message: 'Archivo ya eliminado' });
    }
    
    return NextResponse.json({ error: 'Error al eliminar archivo' }, { status: 500 });
  }
}
