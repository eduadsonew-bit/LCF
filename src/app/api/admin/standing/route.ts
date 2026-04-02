import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const standings = await db.standing.findMany({
      orderBy: [{ category: 'asc' }, { points: 'desc' }],
    });
    return NextResponse.json(standings);
  } catch (error) {
    console.error('Error fetching standings:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const standing = await db.standing.create({
      data: {
        teamName: data.teamName,
        teamLogo: data.teamLogo,
        category: data.category,
        played: parseInt(data.played) || 0,
        won: parseInt(data.won) || 0,
        drawn: parseInt(data.drawn) || 0,
        lost: parseInt(data.lost) || 0,
        goalsFor: parseInt(data.goalsFor) || 0,
        goalsAgainst: parseInt(data.goalsAgainst) || 0,
        points: parseInt(data.points) || 0,
        order: parseInt(data.order) || 0,
        active: data.active ?? true,
      },
    });
    return NextResponse.json(standing);
  } catch (error) {
    console.error('Error creating standing:', error);
    return NextResponse.json({ error: 'Error al crear posición' }, { status: 500 });
  }
}
