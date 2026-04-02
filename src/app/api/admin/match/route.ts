import { NextRequest, NextResponse } from 'next/server';
import { getWriteClient } from '@/lib/db-write';

export async function POST(request: NextRequest) {
  const prisma = getWriteClient();
  try {
    const data = await request.json();
    const match = await prisma.match.create({
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
    await prisma.$disconnect();
    return NextResponse.json(match);
  } catch (error) {
    console.error('Error creating match:', error);
    await prisma.$disconnect();
    return NextResponse.json({ error: 'Error al crear partido' }, { status: 500 });
  }
}
