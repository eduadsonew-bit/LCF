import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const files = await db.matchExcelFile.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(files);
  } catch (error) {
    console.error('Error fetching match excel files:', error);
    return NextResponse.json({ error: 'Error al obtener archivos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, fileName, fileType, fileData, description } = body;

    if (!name || !fileName || !fileType || !fileData) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    // Validate file type
    if (!['xlsx', 'xls'].includes(fileType)) {
      return NextResponse.json({ error: 'Solo se permiten archivos Excel (.xlsx, .xls)' }, { status: 400 });
    }

    const file = await db.matchExcelFile.create({
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
    console.error('Error creating match excel file:', error);
    return NextResponse.json({ error: 'Error al subir archivo' }, { status: 500 });
  }
}
