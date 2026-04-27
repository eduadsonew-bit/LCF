import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

// GET - Listar todos los daños
export async function GET() {
  try {
    const damages = await db.pageDamage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(damages);
  } catch (error) {
    console.error('Error fetching damages:', error);
    return NextResponse.json({ error: 'Error al obtener daños' }, { status: 500 });
  }
}

// POST - Crear un daño
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { page, damageType, message } = body;

    if (!page || !damageType || !message) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: page, damageType, message' },
        { status: 400 }
      );
    }

    const validTypes = ['warning', 'collapse', 'custom'];
    if (!validTypes.includes(damageType)) {
      return NextResponse.json(
        { error: 'damageType debe ser: warning, collapse o custom' },
        { status: 400 }
      );
    }

    const damage = await db.pageDamage.create({
      data: { page, damageType, message },
    });

    return NextResponse.json(damage, { status: 201 });
  } catch (error) {
    console.error('Error creating damage:', error);
    return NextResponse.json({ error: 'Error al crear daño' }, { status: 500 });
  }
}
