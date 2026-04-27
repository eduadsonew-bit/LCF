import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const card = await db.infoCard.create({
      data: {
        title: data.title,
        description: data.description,
        image: data.image,
        icon: data.icon,
        link: data.link,
        linkText: data.linkText,
        color: data.color,
        order: data.order || 0,
        active: data.active ?? true,
      },
    });
    return NextResponse.json(card);
  } catch (error) {
    console.error('Error creating info card:', error);
    return NextResponse.json({ error: 'Error al crear tarjeta' }, { status: 500 });
  }
}
