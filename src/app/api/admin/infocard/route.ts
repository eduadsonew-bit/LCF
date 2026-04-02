import { NextRequest, NextResponse } from 'next/server';
import { getWriteClient } from '@/lib/db-write';

export async function POST(request: NextRequest) {
  const prisma = getWriteClient();
  try {
    const data = await request.json();
    const card = await prisma.infoCard.create({
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
    await prisma.$disconnect();
    return NextResponse.json(card);
  } catch (error) {
    console.error('Error creating info card:', error);
    await prisma.$disconnect();
    return NextResponse.json({ error: 'Error al crear tarjeta' }, { status: 500 });
  }
}
