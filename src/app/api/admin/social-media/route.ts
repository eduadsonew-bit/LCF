import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const socialMedia = await db.socialMedia.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(socialMedia);
  } catch (error) {
    console.error('Error fetching social media:', error);
    return NextResponse.json({ error: 'Error al obtener redes sociales' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { platform, url, icon, active, order } = body;

    if (!platform || !url) {
      return NextResponse.json({ error: 'Plataforma y URL son obligatorios' }, { status: 400 });
    }

    const socialMedia = await db.socialMedia.create({
      data: {
        platform,
        url,
        icon: icon || platform,
        active: active !== false,
        order: order || 0,
      },
    });

    return NextResponse.json(socialMedia, { status: 201 });
  } catch (error) {
    console.error('Error creating social media:', error);
    return NextResponse.json({ error: 'Error al crear red social' }, { status: 500 });
  }
}
