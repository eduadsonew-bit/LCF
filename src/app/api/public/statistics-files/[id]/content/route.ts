import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const file = await db.statisticsFile.findUnique({
      where: { id },
    });

    if (!file) {
      return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 });
    }

    const response: {
      type: 'pdf' | 'excel';
      name: string;
      fileName: string;
      fileData?: string;
      sheets?: { name: string; data: Record<string, unknown>[]; headers: string[] }[];
      error?: string;
    } = {
      type: file.fileType === 'pdf' ? 'pdf' : 'excel',
      name: file.name,
      fileName: file.fileName,
    };

    if (file.fileType === 'pdf') {
      response.fileData = file.fileData;
    } else {
      // For Excel files, return the base64 data
      response.fileData = file.fileData;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching file content:', error);
    return NextResponse.json({ error: 'Error al obtener contenido del archivo' }, { status: 500 });
  }
}
