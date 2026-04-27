import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

// GET - Consultar daños activos para una página específica
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');

    if (!page) {
      return NextResponse.json({ error: 'Parámetro page requerido' }, { status: 400 });
    }

    const damages = await db.pageDamage.findMany({
      where: {
        active: true,
        OR: [
          { page: page },
          { page: '*' },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(damages);
  } catch (error) {
    console.error('Error fetching public damages:', error);
    return NextResponse.json({ error: 'Error al consultar daños' }, { status: 500 });
  }
}
