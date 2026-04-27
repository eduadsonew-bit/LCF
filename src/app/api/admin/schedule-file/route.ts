import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, fileName, fileType, fileData, description } = body;

    if (!name || !fileName || !fileType || !fileData) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const file = await db.scheduleFile.create({
      data: {
        name,
        fileName,
        fileType,
        fileData,
        description,
        active: true,
      },
    });
    return NextResponse.json(file);
  } catch (error) {
    console.error('Error creating schedule file:', error);
    return NextResponse.json({ error: 'Error al subir archivo' }, { status: 500 });
  }
}
