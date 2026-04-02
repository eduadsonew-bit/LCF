import { NextRequest, NextResponse } from 'next/server';
import { getWriteClient } from '@/lib/db-write';

export async function POST(request: NextRequest) {
  const prisma = getWriteClient();
  try {
    const data = await request.json();
    const tournament = await prisma.tournament.create({
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
    await prisma.$disconnect();
    return NextResponse.json(tournament);
  } catch (error) {
    console.error('Error creating tournament:', error);
    await prisma.$disconnect();
    return NextResponse.json({ error: 'Error al crear torneo' }, { status: 500 });
  }
}
