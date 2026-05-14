import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const event = await db.event.create({
      data: {
        title: data.title,
        description: data.description,
        date: data.date ? new Date(data.date) : null,
        location: data.location,
        image: data.image,
        eventType: data.eventType,
        order: data.order || 1,
      },
    });
    return NextResponse.json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Error al crear evento' }, { status: 500 });
  }
}
