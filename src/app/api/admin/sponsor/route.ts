import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const sponsor = await db.sponsor.create({
      data: {
        name: data.name,
        logo: data.logo,
        website: data.website,
        tier: data.tier || 'bronze',
        active: data.active ?? true,
        order: data.order || 0,
      },
    });
    return NextResponse.json(sponsor);
  } catch (error) {
    console.error('Error creating sponsor:', error);
    return NextResponse.json({ error: 'Error al crear patrocinador' }, { status: 500 });
  }
}
