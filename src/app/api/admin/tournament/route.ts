import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const tournament = await db.tournament.create({
      data: {
        name: data.name,
        description: data.description,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        status: data.status || 'active',
        category: data.category,
        image: data.image,
      },
    });
    return NextResponse.json(tournament);
  } catch (error) {
    console.error('Error creating tournament:', error);
    return NextResponse.json({ error: 'Error al crear torneo' }, { status: 500 });
  }
}
