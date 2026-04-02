import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET all teams
export async function GET() {
  try {
    const teams = await db.team.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json({ error: 'Error al obtener equipos' }, { status: 500 });
  }
}

// POST create new team
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, logo, city, category } = body;

    if (!name) {
      return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 });
    }

    const team = await db.team.create({
      data: {
        name,
        logo: logo || null,
        city: city || null,
        category: category || null,
      },
    });

    return NextResponse.json(team, { status: 201 });
  } catch (error) {
    console.error('Error creating team:', error);
    return NextResponse.json({ error: 'Error al crear equipo' }, { status: 500 });
  }
}
