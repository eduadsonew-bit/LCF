import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const topScorers = await db.topScorer.findMany({
      orderBy: [{ category: 'asc' }, { goals: 'desc' }],
    });
    return NextResponse.json(topScorers);
  } catch (error) {
    console.error('Error fetching top scorers:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const topScorer = await db.topScorer.create({
      data: {
        name: data.name,
        team: data.team,
        goals: parseInt(data.goals) || 0,
        assists: parseInt(data.assists) || 0,
        category: data.category,
        order: parseInt(data.order) || 0,
        active: data.active ?? true,
      },
    });
    return NextResponse.json(topScorer);
  } catch (error) {
    console.error('Error creating top scorer:', error);
    return NextResponse.json({ error: 'Error al crear goleador' }, { status: 500 });
  }
}
