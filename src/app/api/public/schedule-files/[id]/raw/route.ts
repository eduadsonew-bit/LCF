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

    if (!file || !file.fileData) {
      return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 });
    }

    // Decode base64 to binary buffer
    const base64Data = file.fileData.split(',')[1] || file.fileData;
    const buffer = Buffer.from(base64Data, 'base64');

    // Set correct content type
    let contentType = 'application/octet-stream';
    if (file.fileType === 'pdf') {
      contentType = 'application/pdf';
    } else if (file.fileType === 'xlsx') {
      contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    } else if (file.fileType === 'xls') {
      contentType = 'application/vnd.ms-excel';
    }

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${file.fileName}"`,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error serving raw file:', error);
    return NextResponse.json({ error: 'Error al obtener archivo' }, { status: 500 });
  }
}
