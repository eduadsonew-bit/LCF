import { NextRequest, NextResponse } from 'next/server';
import { getWriteClient } from '@/lib/db-write';

export async function POST(request: NextRequest) {
  const prisma = getWriteClient();
  try {
    const body = await request.json();
    const { name, fileName, fileType, fileData, description } = body;

    if (!name || !fileName || !fileType || !fileData) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const file = await prisma.scheduleFile.create({
      data: {
        name,
        fileName,
        fileType,
        fileData,
        description,
        active: true,
      },
    });
    await prisma.$disconnect();
    return NextResponse.json(file);
  } catch (error) {
    console.error('Error creating schedule file:', error);
    await prisma.$disconnect();
    return NextResponse.json({ error: 'Error al subir archivo' }, { status: 500 });
  }
}
