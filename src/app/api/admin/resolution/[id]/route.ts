import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const resolution = await db.resolution.findUnique({
      where: { id },
    });

    if (!resolution) {
      return NextResponse.json({ error: 'Resolución no encontrada' }, { status: 404 });
    }

    return NextResponse.json(resolution);
  } catch (error) {
    console.error('Error fetching resolution:', error);
    return NextResponse.json({ error: 'Error al obtener resolución' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();

    // Verificar si existe
    const existing = await db.resolution.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Resolución no encontrada' }, { status: 404 });
    }

    const resolution = await db.resolution.update({
      where: { id },
      data: {
        title: data.title,
        type: data.type,
        number: data.number,
        description: data.description,
        fileUrl: data.fileUrl,
        fileData: data.fileData,
        fileName: data.fileName,
        fileType: data.fileType,
        date: data.date ? new Date(data.date) : undefined,
        active: data.active,
      },
    });
    return NextResponse.json(resolution);
  } catch (error) {
    console.error('Error updating resolution:', error);
    return NextResponse.json({ error: 'Error al actualizar resolución' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Verificar si existe antes de eliminar
    const existing = await db.resolution.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Resolución no encontrada' }, { status: 404 });
    }

    await db.resolution.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting resolution:', error);
    return NextResponse.json({ error: 'Error al eliminar resolución' }, { status: 500 });
  }
}
