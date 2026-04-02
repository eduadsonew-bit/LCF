import { NextRequest, NextResponse } from 'next/server';
import { getWriteClient } from '@/lib/db-write';

export async function POST(request: NextRequest) {
  const prisma = getWriteClient();
  try {
    const data = await request.json();
    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        date: data.date ? new Date(data.date) : null,
        location: data.location,
        image: data.image,
        eventType: data.eventType,
      },
    });
    await prisma.$disconnect();
    return NextResponse.json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    await prisma.$disconnect();
    return NextResponse.json({ error: 'Error al crear evento' }, { status: 500 });
  }
}
