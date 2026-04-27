import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No se proporcion\u00f3 ning\u00fan archivo' }, { status: 400 });
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Tipo de archivo no permitido. Solo se permiten im\u00e1genes (jpg, jpeg, png, gif, webp, svg) y PDFs.' }, { status: 400 });
    }

    // Check file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'El archivo excede el tama\u00f1o m\u00e1ximo de 10MB' }, { status: 400 });
    }

    // Generate unique filename with timestamp prefix
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const timestamp = Date.now();
    const ext = file.name.split('.').pop() || '';
    const uniqueName = timestamp + '-' + Math.random().toString(36).substring(2, 9) + '.' + ext;

    // Ensure uploads directory exists
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch {
      // Directory already exists
    }

    // Write file
    const filePath = join(uploadsDir, uniqueName);
    await writeFile(filePath, buffer);

    // Return the URL path
    const url = '/uploads/' + uniqueName;
    return NextResponse.json({ url: url });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Error al subir el archivo' }, { status: 500 });
  }
}
