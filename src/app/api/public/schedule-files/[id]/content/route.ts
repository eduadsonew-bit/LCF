import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
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

    const response = {
      type: 'pdf',
      name: file.name,
      fileName: file.fileName,
      fileData: file.fileData,
      fileType: file.fileType,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching file content:', error);
    return NextResponse.json({ error: 'Error al obtener contenido del archivo' }, { status: 500 });
  }
}
