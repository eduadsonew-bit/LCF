import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const match = await db.match.create({
      data: {
        tournamentId: data.tournamentId || null,
        homeTeam: data.homeTeam,
        awayTeam: data.awayTeam,
        homeScore: data.homeScore,
        awayScore: data.awayScore,
        matchDate: data.matchDate ? new Date(data.matchDate) : null,
        venue: data.venue,
        status: data.status || 'scheduled',
        homeTeamLogo: data.homeTeamLogo,
        awayTeamLogo: data.awayTeamLogo,
      },
    });
    return NextResponse.json(match);
  } catch (error) {
    console.error('Error creating match:', error);
    return NextResponse.json({ error: 'Error al crear partido' }, { status: 500 });
  }
}
