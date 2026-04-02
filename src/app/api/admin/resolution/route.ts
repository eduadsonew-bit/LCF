import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getWriteClient } from '@/lib/db-write';

export async function GET() {
  try {
    const resolutions = await db.resolution.findMany({
      where: { active: true },
      orderBy: { date: 'desc' },
    });
    return NextResponse.json(resolutions);
  } catch (error) {
    console.error('Error fetching resolutions:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  const prisma = getWriteClient();
  try {
    const data = await request.json();
    const resolution = await prisma.resolution.create({
      data: {
        title: data.title,
        type: data.type || 'resolucion',
        number: data.number || '',
        description: data.description,
        fileUrl: data.fileUrl,
        fileData: data.fileData,
        fileName: data.fileName,
        fileType: data.fileType,
        date: data.date ? new Date(data.date) : new Date(),
        active: data.active ?? true,
      },
    });
    await prisma.$disconnect();
    return NextResponse.json(resolution);
  } catch (error) {
    console.error('Error creating resolution:', error);
    await prisma.$disconnect();
    return NextResponse.json({ error: 'Error al crear resolución' }, { status: 500 });
  }
}
