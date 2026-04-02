import { NextRequest, NextResponse } from 'next/server';
import { getWriteClient } from '@/lib/db-write';

export async function POST(request: NextRequest) {
  const prisma = getWriteClient();
  try {
    const data = await request.json();
    const sponsor = await prisma.sponsor.create({
      data: {
        name: data.name,
        logo: data.logo,
        website: data.website,
        tier: data.tier || 'bronze',
        active: data.active ?? true,
        order: data.order || 0,
      },
    });
    await prisma.$disconnect();
    return NextResponse.json(sponsor);
  } catch (error) {
    console.error('Error creating sponsor:', error);
    await prisma.$disconnect();
    return NextResponse.json({ error: 'Error al crear patrocinador' }, { status: 500 });
  }
}
