import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getWriteClient } from '@/lib/db-write';

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
  const prisma = getWriteClient();
  try {
    const { id } = await params;
    const data = await request.json();

    // Verificar si existe
    const existing = await prisma.resolution.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      await prisma.$disconnect();
      return NextResponse.json({ error: 'Resolución no encontrada' }, { status: 404 });
    }

    const resolution = await prisma.resolution.update({
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
    await prisma.$disconnect();
    return NextResponse.json(resolution);
  } catch (error) {
    console.error('Error updating resolution:', error);
    await prisma.$disconnect();
    return NextResponse.json({ error: 'Error al actualizar resolución' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const prisma = getWriteClient();
  try {
    const { id } = await params;

    // Verificar si existe antes de eliminar
    const existing = await prisma.resolution.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      await prisma.$disconnect();
      return NextResponse.json({ error: 'Resolución no encontrada' }, { status: 404 });
    }

    await prisma.resolution.delete({
      where: { id },
    });
    await prisma.$disconnect();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting resolution:', error);
    await prisma.$disconnect();
    return NextResponse.json({ error: 'Error al eliminar resolución' }, { status: 500 });
  }
}
